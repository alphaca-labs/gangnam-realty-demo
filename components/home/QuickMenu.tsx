"use client";

import Link from "next/link";
import { FileText, Calculator, BarChart3, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { href: "/guide/transaction-report", label: "거래신고", icon: FileText, color: "bg-blue-50 text-blue-600" },
  { href: "/calculator", label: "중개수수료", icon: Calculator, color: "bg-green-50 text-green-600" },
  { href: "/prices", label: "실거래가 조회", icon: BarChart3, color: "bg-purple-50 text-purple-600" },
  { href: "/guide/fraud-prevention", label: "전세 안심", icon: ShieldCheck, color: "bg-amber-50 text-amber-600" },
];

export default function QuickMenu() {
  return (
    <section className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
      <div className="grid grid-cols-4 gap-3">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Link
                href={item.href}
                className="flex flex-col items-center gap-2 p-3 md:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gangnam-text">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
