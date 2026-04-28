import type { LandLookupProvider, LandLookupResult } from '../types/providers';
import { MockLandLookupProvider } from './mock-land-lookup';

export interface VWorldLandLookupOptions {
  proxyUrl?: string;
  apiKey?: string;
}

export class VWorldLandLookupProvider implements LandLookupProvider {
  private fallback: MockLandLookupProvider;

  constructor(private options: VWorldLandLookupOptions = {}) {
    this.fallback = new MockLandLookupProvider();
  }

  async lookup(address: string, lotNumber: string): Promise<LandLookupResult> {
    if (!this.options.proxyUrl || !this.options.apiKey) {
      return this.fallback.lookup(address, lotNumber);
    }
    return this.fallback.lookup(address, lotNumber);
  }
}
