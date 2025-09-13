import { useState, useEffect } from 'react';

// Custom hook for managing form state
export const useFormState = <T extends Record<string, unknown>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const updateField = (field: keyof T, value: T[keyof T]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const setFieldError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    updateField,
    setFieldError,
    clearErrors,
    resetForm,
    setFormData
  };
};

// Custom hook for API calls with loading states
export const useApiCall = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (apiCall: () => Promise<{ success: boolean; data: T; error?: string }>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data);
        return response.data;
      } else {
        setError(response.error || 'An error occurred');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, execute, reset };
};

// Custom hook for local storage
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
};

// Custom hook for debounced values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for media queries (responsive design)
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    
    if (media.addListener) {
      media.addListener(listener);
    } else {
      media.addEventListener('change', listener);
    }

    return () => {
      if (media.removeListener) {
        media.removeListener(listener);
      } else {
        media.removeEventListener('change', listener);
      }
    };
  }, [matches, query]);

  return matches;
};

// Custom hook for interval
export const useInterval = (callback: () => void, delay: number | null) => {
  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
};
