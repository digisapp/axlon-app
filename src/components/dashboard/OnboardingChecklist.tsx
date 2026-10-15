'use client';

import { useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Check, Upload, ListPlus, Phone, Users, Building2, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { panelClass } from './panel';

interface OnboardingStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  completed: boolean;
}

interface OnboardingChecklistProps {
  hasCompanyName: boolean;
  hasListings: boolean;
  hasImported: boolean;
  hasPhoneNumber: boolean;
  hasLeads: boolean;
}

const COLLAPSED_KEY = 'axlon.setup.collapsed';
const HIDDEN_KEY = 'axlon.setup.hidden';

// localStorage-backed flags. Read through useSyncExternalStore so the server
// renders the card expanded and the browser applies the saved state on
// hydration without a setState-in-effect.
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function readFlag(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function writeFlag(key: string, on: boolean) {
  try {
    if (on) window.localStorage.setItem(key, '1');
    else window.localStorage.removeItem(key);
  } catch {
    // private mode / blocked storage — the card just won't remember
  }
  listeners.forEach((l) => l());
}

function useLocalFlag(key: string): [boolean, (on: boolean) => void] {
  const value = useSyncExternalStore(subscribe, () => readFlag(key), () => false);
  const set = useCallback((on: boolean) => writeFlag(key, on), [key]);
  return [value, set];
}

/**
 * Setup checklist for a new dealer: one compact row that can be collapsed,
 * dismissed, and disappears on its own once every step is done.
 */
export function OnboardingChecklist({
  hasCompanyName,
  hasListings,
  hasImported,
  hasPhoneNumber,
  hasLeads,
}: OnboardingChecklistProps) {
  const [collapsed, setCollapsed] = useLocalFlag(COLLAPSED_KEY);
  const [hidden, setHidden] = useLocalFlag(HIDDEN_KEY);

  const steps: OnboardingStep[] = [
    {
      id: 'company',
      label: 'Add your company name',
      icon: <Building2 className="w-4 h-4" />,
      href: '/dashboard/settings',
      completed: hasCompanyName,
    },
    {
      id: 'listing',
      label: 'Create your first listing',
      icon: <ListPlus className="w-4 h-4" />,
      href: '/dashboard/listings/new',
      completed: hasListings,
    },
    {
      id: 'import',
      label: 'Import your inventory',
      icon: <Upload className="w-4 h-4" />,
      href: '/dashboard/bulk',
      completed: hasImported,
    },
    {
      id: 'phone',
      label: 'Turn on AXLON Voice',
      icon: <Phone className="w-4 h-4" />,
      href: '/dashboard/voice-agent',
      completed: hasPhoneNumber,
    },
    {
      id: 'lead',
      label: 'Receive your first lead',
      icon: <Users className="w-4 h-4" />,
      href: '/dashboard/leads',
      completed: hasLeads,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const allDone = completedCount === steps.length;
  const progress = (completedCount / steps.length) * 100;

  if (allDone || hidden) return null;

  const toggle = () => setCollapsed(!collapsed);
  const dismiss = () => setHidden(true);

  return (
    <section className={cn(panelClass, 'border-primary/20')} aria-label="Setup checklist">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={!collapsed}
          className="flex flex-1 items-center gap-3 text-left min-w-0"
        >
          <ChevronDown
            className={cn('w-4 h-4 shrink-0 text-muted-foreground transition-transform', collapsed && '-rotate-90')}
          />
          <span className="font-semibold text-sm">Set up AXLON</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {completedCount} of {steps.length} done
          </span>
          <span className="hidden sm:block flex-1 max-w-40 h-1.5 bg-muted rounded-full overflow-hidden">
            <span
              className="block h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </span>
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Hide setup checklist"
          className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!collapsed && (
        <div className="grid gap-2 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <Link
              key={step.id}
              href={step.href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors',
                step.completed
                  ? 'border-transparent bg-emerald-500/10 text-muted-foreground'
                  : 'border-border/60 hover:border-primary/40 hover:bg-muted/50'
              )}
            >
              <span
                className={cn(
                  'flex w-7 h-7 shrink-0 items-center justify-center rounded-full',
                  step.completed ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                )}
              >
                {step.completed ? <Check className="w-3.5 h-3.5" /> : step.icon}
              </span>
              <span className={cn('min-w-0 leading-tight', step.completed && 'line-through')}>{step.label}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
