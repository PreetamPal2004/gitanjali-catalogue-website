import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CMSData } from '../types';
import mockData from '../data/mockData';
import { fetchCMSData } from '../services/cmsApi';

const API_URL = import.meta.env.VITE_GSHEETS_API_URL || '';
const CACHE_KEY = 'gitanjali_cms_cache_v1';

function getInitialData(): CMSData {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback to default mockData on JSON error
  }
  return mockData;
}

interface CMSContextType {
  data: CMSData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType>({
  data: getInitialData(),
  loading: false,
  error: null,
  refresh: async () => {},
});

export function CMSProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CMSData>(getInitialData);
  const [loading, setLoading] = useState<boolean>(() => {
    return !!API_URL;
  });
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (API_URL) {
      setLoading(true);
    }
    setError(null);

    try {
      const fetched = await fetchCMSData();
      setData(fetched);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(fetched));
      } catch {
        // Handle storage quota limits gracefully
      }
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
