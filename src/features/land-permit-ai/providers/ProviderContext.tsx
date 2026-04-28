'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { ProviderBundle } from '../types/providers';
import { MockLandLookupProvider } from './mock-land-lookup';
import { MockAddressLookupProvider } from './mock-address-lookup';

const ProviderContext = createContext<ProviderBundle | null>(null);

export interface ProviderContextProviderProps {
  providers?: Partial<ProviderBundle>;
  children: ReactNode;
}

export function ProviderContextProvider({
  providers,
  children,
}: ProviderContextProviderProps) {
  const value = useMemo<ProviderBundle>(() => {
    return {
      landLookup: providers?.landLookup ?? new MockLandLookupProvider(),
      addressLookup: providers?.addressLookup ?? new MockAddressLookupProvider(),
    };
  }, [providers]);

  return <ProviderContext.Provider value={value}>{children}</ProviderContext.Provider>;
}

export function useProviders(): ProviderBundle {
  const ctx = useContext(ProviderContext);
  if (!ctx) {
    throw new Error('useProviders must be used inside ProviderContextProvider');
  }
  return ctx;
}
