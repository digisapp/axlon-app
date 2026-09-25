'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Coordination for the fixed "chrome" at the bottom of the mobile viewport.
 *
 * Bottom bars (MobileBottomNav, the listing and storefront contact bars) publish
 * their rendered height as --bottom-bar-h, the CompareBar as --compare-bar-h and
 * the floating call button its slot as --fab-call-slot. Floating buttons are
 * positioned with the `bottom-fab` / `bottom-fab-2` utilities (globals.css), so
 * they always stack above whatever is on screen instead of guessing offsets.
 *
 * Visibility is driven by data attributes on <html>, styled in globals.css:
 *   data-overlay-open   a chat panel or photo viewer is open → floating buttons
 *                       and the compare bar hide so they can't cover it
 *   data-keyboard-open  a text field has focus on a touch device → floating
 *                       buttons and bottom bars hide, like native tab bars do
 *   data-scrolling-down the user is scrolling down on a touch device → floating
 *                       buttons fade so they don't sit on the cards being read;
 *                       they return on scroll-up or once scrolling pauses
 * Mark elements with data-fab (floating buttons) or data-bottom-bar (bars).
 */

type ChromeVar = '--bottom-bar-h' | '--compare-bar-h' | '--fab-call-slot';

/**
 * Callback ref that publishes the element's rendered height (plus `gap` when
 * visible) as a CSS variable on <html>, and clears it when the element unmounts.
 * A display:none element measures 0, so breakpoint-hidden bars publish nothing.
 */
export function usePublishedHeight(name: ChromeVar, gap = 0) {
  return useCallback(
    (el: HTMLElement | null) => {
      if (!el) return;
      const root = document.documentElement;
      const update = () => {
        const h = el.offsetHeight;
        root.style.setProperty(name, `${h > 0 ? h + gap : 0}px`);
      };
      update();
      const observer = new ResizeObserver(update);
      observer.observe(el);
      return () => {
        observer.disconnect();
        root.style.removeProperty(name);
      };
    },
    [name, gap]
  );
}

let openOverlays = 0;

/** Mark a panel (chat, photo viewer) as open while `open` is true. */
export function useOverlayOpen(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    openOverlays += 1;
    root.dataset.overlayOpen = '';
    return () => {
      openOverlays = Math.max(0, openOverlays - 1);
      if (openOverlays === 0) delete root.dataset.overlayOpen;
    };
  }, [open]);
}

const NON_TEXT_INPUTS = new Set([
  'button', 'checkbox', 'color', 'file', 'hidden', 'image', 'radio', 'range', 'reset', 'submit',
]);

function isTextEntry(el: Element | null): boolean {
  if (el instanceof HTMLTextAreaElement) return true;
  if (el instanceof HTMLInputElement) return !NON_TEXT_INPUTS.has(el.type);
  return el instanceof HTMLElement && el.isContentEditable;
}

/**
 * Keeps data-keyboard-open and data-scrolling-down on <html> in sync on touch
 * devices. Mounted once in the root layout.
 */
export function MobileChrome() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    const root = document.documentElement;
    let frame = 0;
    let idle = 0;
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      if (Math.abs(dy) < 8) return; // ignore jitter and momentum tails
      lastY = y;
      if (dy > 0 && y > 160) root.dataset.scrollingDown = '';
      else delete root.dataset.scrollingDown;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => delete root.dataset.scrollingDown, 900);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      // focusout fires before focus lands on the next field — check a frame
      // later so hopping between fields doesn't flash the bars back in.
      frame = requestAnimationFrame(() => {
        if (isTextEntry(document.activeElement)) root.dataset.keyboardOpen = '';
        else delete root.dataset.keyboardOpen;
      });
    };
    document.addEventListener('focusin', sync);
    document.addEventListener('focusout', sync);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      document.removeEventListener('focusin', sync);
      document.removeEventListener('focusout', sync);
      window.removeEventListener('scroll', onScroll);
      delete root.dataset.keyboardOpen;
      delete root.dataset.scrollingDown;
    };
  }, []);
  return null;
}

/**
 * While `active`, returns the part of the layout viewport the user can actually
 * see once the iOS keyboard is up ({ top, height } in px), or null when no
 * keyboard is showing. Fixed panels use it to stay above the keyboard — iOS
 * doesn't shrink the layout viewport, so `bottom: 0` sits behind the keyboard.
 */
export function useVisibleViewport(active: boolean) {
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!active || !vv) return;
    const update = () => {
      const layoutHeight = document.documentElement.clientHeight;
      // Treat anything that eats more than 15% of the screen as a keyboard;
      // smaller changes are the Safari toolbar collapsing.
      if (vv.height < layoutHeight * 0.85) {
        setBox({ top: Math.round(vv.offsetTop), height: Math.round(vv.height) });
      } else {
        setBox(null);
      }
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, [active]);

  return active ? box : null;
}

/** True on devices with a precise pointer (mouse/trackpad) — safe to autofocus. */
export function canAutofocus() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}
