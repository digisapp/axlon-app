import type { ComponentType } from 'react';

/**
 * Loader wrappers for next/dynamic.
 *
 * A dynamic() loader that rejects — a flaky mobile connection, a navigation
 * cancelling the request, a deploy swapping chunk hashes mid-visit — throws a
 * ChunkLoadError into the nearest error boundary. For anything mounted in a
 * layout (the floating chat widget) that boundary is the root error.tsx, so
 * one failed optional download replaced the whole page with "Something went
 * wrong".
 */

/** Retry a failed chunk download once before giving up. */
export function retryImport<T>(load: () => Promise<T>, retryDelayMs = 1500): () => Promise<T> {
  return () =>
    load().catch(
      () => new Promise<void>((resolve) => setTimeout(resolve, retryDelayMs)).then(load)
    );
}

/**
 * For optional pieces of a page: retry once, then render `fallback` instead of
 * throwing, so the page around it keeps working.
 */
export function optionalImport<P>(
  load: () => Promise<ComponentType<P>>,
  fallback: ComponentType<P>
): () => Promise<ComponentType<P>> {
  return () => retryImport(load)().catch(() => fallback);
}

/** Fallback for optional widgets that should just not appear. */
export function Nothing() {
  return null;
}
