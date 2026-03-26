"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  { label: "텍스트 질의/응답", kakao: true, web: true },
  { label: "인터랙티브 차트", kakao: false, web: true },
  { label: "테이블 정렬/필터", kakao: false, web: true },
  { label: "실시간 수수료 계산기", kakao: false, web: true },
  { label: "지도 위 매물 표시", kakao: false, web: true },
  { label: "서류 양식 뷰어", kakao: false, web: true },
];

export default function ComparisonBanner() {
  return (
    <section className="max-w-3xl mx-auto px-4 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-xl p-5 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gangnam-text mb-4">
          왜 웹버전이 필요할까요?
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-gangnam-sub font-medium">기능</th>
                <th className="py-2 px-3 text-center text-gangnam-sub font-medium">카카오톡</th>
                <th className="py-2 px-3 text-center text-gangnam-primary font-medium">웹버전</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.label} className="border-b border-border/50">
                  <td className="py-2.5 pr-4 text-gangnam-text">{f.label}</td>
                  <td className="py-2.5 px-3 text-center">
                    {f.kakao ? (
                      <Check className="w-5 h-5 text-gangnam-secondary mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Check className="w-5 h-5 text-gangnam-secondary mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
