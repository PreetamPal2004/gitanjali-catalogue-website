import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CMSData } from '../types';
import mockData from '../data/mockData';
import { fetchCMSData } from '../services/cmsApi';

const API_URL = import.meta.env.VITE_GSHEETS_API_URL || '';

const emptyData: CMSData = mockData;

interface CMSContextType {
  data: CMSData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType>({
  data: API_URL ? emptyData : mockData,
  loading: !!API_URL,
  error: null,
  refresh: async () => {},
});

export function CMSProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CMSData>(API_URL ? emptyData : mockData);
  const [loading, setLoading] = useState(!!API_URL);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await fetchCMSData();
      setData(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load CMS data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <CMSContext.Provider value={{ data, loading, error, refresh }}>
      {children}
    </CMSContext.Provider>
  );
}

export const useCMS = () => useContext(CMSContext);
