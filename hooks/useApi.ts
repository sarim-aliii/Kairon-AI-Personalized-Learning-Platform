import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/errorHandler';


export const useApi = <T, P extends any[]>(
  apiFunc: (...args: P) => Promise<T>,
  successMessage?: string
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: P) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunc(...args);
      
      setData(result);
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message); // Automatically show the toast
      throw err; // Re-throw so the component can still react if needed
    } finally {
      setLoading(false);
    }
  }, [apiFunc, successMessage]);

  return { execute, data, loading, error, setData };
};