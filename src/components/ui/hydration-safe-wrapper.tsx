import React from 'react';
import { useHydrationSafe } from '@/hooks/use-hydration-safe';

interface HydrationSafeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const HydrationSafeWrapper: React.FC<HydrationSafeWrapperProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { isHydrated } = useHydrationSafe();

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
