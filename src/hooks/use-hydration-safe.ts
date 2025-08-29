import { useState, useEffect } from 'react';

/**
 * Hook to safely handle hydration mismatches caused by browser extensions
 * that modify form inputs (like password managers adding fdprocessedid)
 */
export const useHydrationSafe = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return { isHydrated };
};

/**
 * Hook to safely handle form input values that might be modified by browser extensions
 */
export const useFormHydrationSafe = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);
  const { isHydrated } = useHydrationSafe();

  // Only update the value after hydration to prevent mismatches
  const handleChange = (newValue: string) => {
    if (isHydrated) {
      setValue(newValue);
    }
  };

  return {
    value: isHydrated ? value : initialValue,
    handleChange,
    isHydrated
  };
};

/**
 * Hook to safely handle form submission and prevent hydration issues
 */
export const useFormSubmissionSafe = () => {
  const { isHydrated } = useHydrationSafe();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (submitFunction: () => Promise<void>) => {
    if (!isHydrated || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFunction();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
    isHydrated
  };
};
