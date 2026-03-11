'use client';

import Link from 'next/link';
import { Check, Upload, ListPlus, Phone, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  completed: boolean;
}

interface OnboardingChecklistProps {
  hasListings: boolean;
  hasImported: boolean;
  hasPhoneNumber: boolean;
  hasLeads: boolean;
}

export function OnboardingChecklist({
  hasListings,
  hasImported,
  hasPhoneNumber,
  hasLeads,
}: OnboardingChecklistProps) {
  const steps: OnboardingStep[] = [
    {
      id: 'import',
      label: 'Import your inventory',
      description: 'Upload a CSV or drop files to bulk import',
      icon: <Upload className="w-4 h-4" />,
      href: '/dashboard/bulk',
      completed: hasImported,
    },
    {
      id: 'listing',
      label: 'Create your first listing',
      description: 'List a piece of equipment on the marketplace',
      icon: <ListPlus className="w-4 h-4" />,
      href: '/dashboard/listings/new',
      completed: hasListings,
    },
    {
      id: 'phone',
      label: 'Connect your phone number',
      description: 'Set up AXLON Voice to answer calls 24/7',
      icon: <Phone className="w-4 h-4" />,
      href: '/dashboard/voice-agent',
      completed: hasPhoneNumber,
    },
    {
      id: 'lead',
      label: 'Receive your first lead',
      description: 'AI captures leads from calls, chat, and inquiries',
      icon: <Users className="w-4 h-4" />,
      href: '/dashboard/leads',
      completed: hasLeads,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const allDone = completedCount === steps.length;
  const progress = (completedCount / steps.length) * 100;

  if (allDone) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Get Started with AXLON</CardTitle>
          <span className="text-xs font-medium text-muted-foreground">
            {completedCount}/{steps.length} complete
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {steps.map((step) => (
            <Link
              key={step.id}
              href={step.href}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-colors',
                step.completed
                  ? 'bg-emerald-50 dark:bg-emerald-950/20'
                  : 'hover:bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  step.completed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {step.completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-sm font-medium',
                    step.completed && 'line-through text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {!step.completed && (
                <Button variant="ghost" size="sm" className="shrink-0 text-xs">
                  Start
                </Button>
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
