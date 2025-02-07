/* eslint-disable no-undef */
import { useMemo, useState, useEffect, useCallback } from 'react';

import axiosInstance, { endpoints } from 'src/utils/axios';

export function useGetReceivecase() {
  const url = endpoints.dashboard.receivecaseJoin;

  const [Rec, setRec] = useState([]); // Data from API
  const [isLoading, setIsLoading] = useState(false); // Loading state
  // eslint-disable-next-line no-bitwise, no-self-compare
  const [error, setError] = useState(null); // Error state

  const fetchReceivecase = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const maxRetries = 2;
    // eslint-disable-next-line no-plusplus
    for (let attempts = 0; attempts <= maxRetries; attempts++) {
      try {
        console.log(`📌 Attempt ${attempts + 1}: Fetching data from`, url);

        // eslint-disable-next-line no-await-in-loop
        const response = await axiosInstance.get(url);

        if (response.status === 200 && response.headers['content-type'].includes('application/json')) {
          console.log('📌 API Data:', response.data);
          setRec(response.data);
          setIsLoading(false);
          return; // Successfully fetched, exit function
        }

        throw new Error('Received non-JSON data');
      } catch (err) {
        console.error(`❌ Attempt ${attempts + 1} Failed:`, err.message);
        if (attempts === maxRetries) {
          setError(err.message || 'An error occurred');
          setIsLoading(false);
        } else {
          console.log('🔄 Retrying...');
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    fetchReceivecase(); // Fetch data on mount
  }, [fetchReceivecase]);

  const memoizedValue = useMemo(
    () => ({
      Receivecase: Rec,
      ReceivecaseLoading: isLoading,
      ReceivecaseError: error,
      refetchReceivecase: fetchReceivecase,
    }),
    [Rec, isLoading, error, fetchReceivecase]
  );

  return memoizedValue;
}
