import type { AddressLookupProvider, AddressSuggestion } from '../types/providers';

const seedSuggestions: AddressSuggestion[] = [
  {
    roadAddress: '서울특별시 강남구 압구정로 123',
    jibunAddress: '서울시 강남구 압구정동 123-45',
    zipCode: '06015',
  },
  {
    roadAddress: '서울특별시 강남구 청담로 88',
    jibunAddress: '서울시 강남구 청담동 88-12',
    zipCode: '06070',
  },
  {
    roadAddress: '서울특별시 강남구 봉은사로 167',
    jibunAddress: '서울시 강남구 삼성동 167-3',
    zipCode: '06164',
  },
  {
    roadAddress: '서울특별시 강남구 테헤란로 456',
    jibunAddress: '서울시 강남구 역삼동 456-78',
    zipCode: '06168',
  },
  {
    roadAddress: '서울특별시 강남구 도곡로 514',
    jibunAddress: '서울시 강남구 대치동 514-21',
    zipCode: '06280',
  },
  {
    roadAddress: '서울특별시 강남구 학동로 789',
    jibunAddress: '서울시 강남구 논현동 789-12',
    zipCode: '06120',
  },
  {
    roadAddress: '서울특별시 강남구 남부순환로 450',
    jibunAddress: '서울시 강남구 도곡동 450-1',
    zipCode: '06262',
  },
];

export class MockAddressLookupProvider implements AddressLookupProvider {
  async search(query: string): Promise<AddressSuggestion[]> {
    await new Promise((r) => setTimeout(r, 200));
    const q = query.replace(/\s+/g, '');
    if (!q) return seedSuggestions.slice(0, 5);
    const matches = seedSuggestions.filter(
      (s) =>
        s.roadAddress.replace(/\s+/g, '').includes(q) ||
        s.jibunAddress.replace(/\s+/g, '').includes(q),
    );
    if (matches.length > 0) return matches;
    return seedSuggestions.slice(0, 5);
  }
}
