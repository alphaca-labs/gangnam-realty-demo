"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/format";

const trends = [
  {
    dong: "압구정동",
    complex: "현대아파트 1차",
    area: "84㎡",
    price: 285000,
    change: 2.5,
    date: "2026.03.15",
  },
  {
    dong: "대치동",
    complex: "래미안대치팰리스",
    area: "115㎡",
    price: 420000,
    change: -1.2,
    date: "2026.03.12",
  },
  {
    dong: "삼성동",
    complex: "아이파크삼성",
    area: "134㎡",
    price: 480000,
    change: 0,
    date: "2026.03.14",
  },
];

export default function TrendCards() {
  return (
    <section className="max-w-3xl mx-auto px-4 mt-8">
      <h2 className="text-lg font-bold text-gangnam-text mb-4 flex items-center gap-2">
        <BarChartIcon />
        강남구 실거래가 트렌드
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {trends.map((t, i) => (
          <motion.div
            key={t.complex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs bg-gangnam-primary/10 text-gangnam-primary">
                    {t.dong}
                  </Badge>
                  <span className="text-xs text-gangnam-sub">{t.date}</span>
                </div>
                <p className="font-semibold text-gangnam-text text-sm mb-1">{t.complex}</p>
                <p className="text-xs text-gangnam-sub mb-2">{t.area}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gangnam-primary">{formatPrice(t.price)}</span>
                  <ChangeIndicator change={t.change} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ChangeIndicator({ change }: { change: number }) {
  if (change > 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs text-red-500 font-medium">
        <TrendingUp className="w-3.5 h-3.5" />+{change}%
      </span>
    );
  }
  if (change < 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs text-blue-500 font-medium">
        <TrendingDown className="w-3.5 h-3.5" />{change}%
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-xs text-gangnam-sub font-medium">
      <Minus className="w-3.5 h-3.5" />0%
    </span>
  );
}

function BarChartIcon() {
  return (
    <span className="w-6 h-6 rounded-md bg-gangnam-primary/10 text-gangnam-primary flex items-center justify-center text-sm">
      📊
    </span>
  );
}
