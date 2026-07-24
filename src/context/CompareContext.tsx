import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '../types';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isCompareOpen: boolean;
  setCompareOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType>({
  compareList: [],
  addToCompare: () => {},
  removeFromCompare: () => {},
  clearCompare: () => {},
  isInCompare: () => false,
  isCompareOpen: false,
  setCompareOpen: () => {},
});

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setCompareOpen] = useState(false);

  const addToCompare = useCallback((product: Product) => {
    setCompareList(prev => {
      if (prev.length >= 4) return prev;
      if (prev.find(p => p.productId === product.productId)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareList(prev => prev.filter(p => p.productId !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    setCompareOpen(false);
  }, []);

  const isInCompare = useCallback(
    (productId: string) => compareList.some(p => p.productId === productId),
    [compareList]
  );

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare, isCompareOpen, setCompareOpen }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);
