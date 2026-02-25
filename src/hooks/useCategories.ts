import { useEffect, useState } from 'react';
import type { Category } from '@/types';
import { logger } from '@/lib/logger';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);
        }
      } catch (error) {
        logger.error('Error fetching categories', { error });
      }
    };
    fetchCategories();
  }, []);

  return categories;
}
