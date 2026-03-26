import { Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-white border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-gangnam-primary" />
          <span className="font-bold text-gangnam-text">강남부동산톡</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gangnam-sub">
          <div>
            <p className="font-medium text-gangnam-text mb-2">서비스</p>
            <p>AI 부동산 상담</p>
            <p>실거래가 조회</p>
            <p>중개수수료 계산기</p>
          </div>
          <div>
            <p className="font-medium text-gangnam-text mb-2">민원 안내</p>
            <p>거래신고</p>
            <p>토지거래허가</p>
            <p>중개업 개설</p>
          </div>
          <div>
            <p className="font-medium text-gangnam-text mb-2">관련 사이트</p>
            <p>강남구청</p>
            <p>국토교통부</p>
            <p>서울시 부동산정보광장</p>
          </div>
          <div>
            <p className="font-medium text-gangnam-text mb-2">문의</p>
            <p>강남구 부동산정보과</p>
            <p>02-3423-5850</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border text-xs text-gangnam-sub">
          © 2026 강남구청 부동산정보과. 본 서비스는 데모 버전입니다.
        </div>
      </div>
    </footer>
  );
}
