import Link from "next/link";
import { FileText, MapPin, Building2, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { guideCategories } from "@/data/guide-content";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  MapPin,
  Building2,
  ShieldCheck,
};

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gangnam-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-gangnam-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gangnam-text">민원 가이드</h1>
          <p className="text-sm text-gangnam-sub">부동산 관련 민원 절차를 안내합니다</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guideCategories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? FileText;
          return (
            <Link key={cat.slug} href={`/guide/${cat.slug}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${cat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="font-bold text-gangnam-text mb-1">{cat.title}</h2>
                  <p className="text-sm text-gangnam-sub">{cat.description}</p>
                  <p className="text-xs text-gangnam-primary font-medium mt-3">자세히 보기 →</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
