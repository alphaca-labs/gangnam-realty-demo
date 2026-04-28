export interface LandLookupResult {
  category: string;
  areaSqm: number;
  zone: string;
  source: 'mock' | 'vworld';
}

export interface LandLookupProvider {
  lookup(address: string, lotNumber: string): Promise<LandLookupResult>;
}

export interface AddressSuggestion {
  roadAddress: string;
  jibunAddress: string;
  zipCode?: string;
}

export interface AddressLookupProvider {
  search(query: string): Promise<AddressSuggestion[]>;
}

export interface ProviderBundle {
  landLookup: LandLookupProvider;
  addressLookup: AddressLookupProvider;
}
