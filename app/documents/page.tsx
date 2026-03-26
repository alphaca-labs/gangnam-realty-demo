import { FileText, CheckCircle2, Download, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const requiredFields = [
  { section: "계약 당사자 정보", items: ["매도인(임대인) 성명 및 주민등록번호", "매수인(임차인) 성명 및 주민등록번호", "주소 및 연락처"] },
  { section: "부동산 표시", items: ["소재지 (주소)", "건물 유형 (아파트/오피스텔 등)", "면적 (전용면적, 공급면적)", "동·호수"] },
  { section: "거래 조건", items: ["거래금액 (매매가 또는 보증금/월세)", "계약금/중도금/잔금 일정", "특약사항"] },
  { section: "중개 관련", items: ["중개업소 상호 및 대표자", "사업자등록번호", "중개보수 금액 및 지급 시기", "공제증서 번호"] },
];

const sampleDocuments = [
  { name: "부동산 매매계약서 (표준)", desc: "국토교통부 표준 서식", type: "PDF" },
  { name: "전세(임대차) 계약서", desc: "주택임대차 표준계약서", type: "PDF" },
  { name: "중개대상물 확인·설명서", desc: "공인중개사법 시행규칙 서식", type: "PDF" },
  { name: "부동산 거래신고서", desc: "부동산거래신고법 서식", type: "PDF" },
  { name: "권리관계 확인서류 체크리스트", desc: "등기부등본, 건축물대장 등", type: "PDF" },
];

export default function DocumentsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gangnam-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-gangnam-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gangnam-text">서류/양식 가이드</h1>
          <p className="text-sm text-gangnam-sub">중개계약 관련 서류와 양식을 안내합니다</p>
        </div>
      </div>

      {/* Required Fields Checklist */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <h2 className="font-bold text-gangnam-text mb-1">중개계약서 필수 입력 항목</h2>
          <p className="text-xs text-gangnam-sub mb-4">아래 항목을 반드시 확인하세요</p>

          <div className="space-y-5">
            {requiredFields.map((section) => (
              <div key={section.section}>
                <h3 className="font-semibold text-sm text-gangnam-primary mb-2">{section.section}</h3>
                <div className="space-y-1.5">
                  {section.items.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gangnam-secondary shrink-0 mt-0.5" />
                      <span className="text-sm text-gangnam-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Documents */}
      <Card>
        <CardContent className="p-5">
          <h2 className="font-bold text-gangnam-text mb-1">서류 견본 / 양식</h2>
          <p className="text-xs text-gangnam-sub mb-4">표준 서식을 확인하세요 (데모에서는 다운로드 불가)</p>

          <div className="space-y-3">
            {sampleDocuments.map((doc, i) => (
              <div key={doc.name}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gangnam-text">{doc.name}</p>
                      <p className="text-xs text-gangnam-sub">{doc.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-[10px]">{doc.type}</Badge>
                    <button className="p-2 rounded-lg hover:bg-gangnam-bg transition-colors" title="미리보기">
                      <Eye className="w-4 h-4 text-gangnam-sub" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gangnam-bg transition-colors" title="다운로드">
                      <Download className="w-4 h-4 text-gangnam-sub" />
                    </button>
                  </div>
                </div>
                {i < sampleDocuments.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gangnam-sub">
            <p className="font-medium text-gangnam-primary mb-1">ℹ️ 안내</p>
            <p>본 데모에서는 서류 미리보기 및 다운로드가 제공되지 않습니다. 실제 서비스에서는 PDF 뷰어와 다운로드 기능이 제공될 예정입니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
