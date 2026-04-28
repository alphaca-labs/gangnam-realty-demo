import type { AddressLookupProvider, AddressSuggestion } from '../types/providers';
import { MockAddressLookupProvider } from './mock-address-lookup';

export interface KakaoAddressLookupOptions {
  proxyUrl?: string;
  apiKey?: string;
}

export class KakaoAddressLookupProvider implements AddressLookupProvider {
  private fallback: MockAddressLookupProvider;

  constructor(private options: KakaoAddressLookupOptions = {}) {
    this.fallback = new MockAddressLookupProvider();
  }

  async search(query: string): Promise<AddressSuggestion[]> {
    if (!this.options.proxyUrl || !this.options.apiKey) {
      return this.fallback.search(query);
    }
    return this.fallback.search(query);
  }
}
