import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { guideCategories } from "@/data/guide-content";

export function generateStaticParams() {
  return guideCategories.map((cat) => ({ slug: cat.slug }));
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guideCategories.find((c) => c.slug === slug);
  if (!guide) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link href="/guide" className="inline-flex items-center gap-1 text-sm text-gangnam-sub hover:text-gangnam-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> 민원 가이드 목록
      </Link>

      <div className="mb-6">
        <Badge className={`mb-2 ${guide.color}`}>{guide.title}</Badge>
        <h1 className="text-xl font-bold text-gangnam-text">{guide.title} 안내</h1>
        <p className="text-sm text-gangnam-sub mt-1">{guide.description}</p>
      </div>

      {/* Steps */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <h2 className="font-bold text-gangnam-text mb-4">절차 안내</h2>
          <div className="space-y-4">
            {guide.steps.map((step, i) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gangnam-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {step.step}
                  </div>
                  {i < guide.steps.length - 1 && (
                    <div className="w-0.5 h-full bg-gangnam-primary/20 mt-1" />
                  )}
                </div>
                <div className="pb-4">
                  <h3 className="font-semibold text-gangnam-text">{step.title}</h3>
                  <p className="text-sm text-gangnam-sub mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notice */}
      {guide.notice && (
        <Card className="mb-4 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800 font-medium">⚠️ {guide.notice}</p>
          </CardContent>
        </Card>
      )}

      {/* Checklist */}
      {guide.checklist && (
        <Card>
          <CardContent className="p-5">
            <h2 className="font-bold text-gangnam-text mb-3">체크리스트</h2>
            <div className="space-y-2">
              {guide.checklist.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gangnam-secondary shrink-0 mt-0.5" />
                  <span className="text-sm text-gangnam-text">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
