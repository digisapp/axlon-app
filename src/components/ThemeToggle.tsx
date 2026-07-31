'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeToggle({ size = 'default' }: { size?: 'default' | 'sm' }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration gate: theme is unknown until mount
    setMounted(true);
  }, []);

  const btnClass = size === 'sm'
    ? 'h-10 w-10 md:h-8 md:w-8 rounded-full glass-button touch-manipulation'
    : 'h-10 w-10 rounded-full glass-button touch-manipulation';

  const iconClass = size === 'sm' ? 'h-4 w-4 transition-transform' : 'h-5 w-5 transition-transform';

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={btnClass} disabled>
        <span className={iconClass} />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      className={btnClass}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className={iconClass} />
      ) : (
        <Moon className={iconClass} />
      )}
    </Button>
  );
}
