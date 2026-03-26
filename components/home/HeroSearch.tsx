"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const examples = [
  "압구정동 아파트 실거래가",
  "중개수수료 얼마?",
  "전세사기 예방 방법",
  "거래신고 방법",
];

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (q?: string) => {
    const searchQuery = q ?? query;
    if (searchQuery.trim()) {
      router.push(`/chat?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gangnam-primary via-[#1a5a9e] to-[#144070] text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl md:text-4xl font-bold mb-3">
            강남 부동산, 물어보고 바로 보세요
          </h1>
          <p className="text-white/80 text-sm md:text-base mb-8">
            카카오톡에서는 텍스트로만 볼 수 있던 정보를,<br />
            이제 차트 · 지도 · 계산기로 바로 확인하세요
          </p>

          <div className="relative max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden">
              <Search className="w-5 h-5 text-gangnam-sub ml-4 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="무엇이든 물어보세요..."
                className="flex-1 px-3 py-4 text-gangnam-text text-base outline-none"
              />
              <button
                onClick={() => handleSubmit()}
                className="bg-gangnam-primary text-white px-5 py-4 font-medium hover:bg-gangnam-primary/90 transition-colors"
              >
                검색
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => handleSubmit(ex)}
                className="text-xs md:text-sm px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-full transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
