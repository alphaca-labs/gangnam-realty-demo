"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function MapPreview() {
  return (
    <section className="max-w-3xl mx-auto px-4 mt-8 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Link href="/map" className="block">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-40 md:h-52 bg-gradient-to-br from-blue-100 to-green-50 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-gangnam-primary mx-auto mb-2" />
                <p className="text-gangnam-primary font-bold text-lg">강남구 부동산 지도</p>
                <p className="text-gangnam-sub text-sm mt-1">주요 단지 위치와 시세를 지도에서 확인하세요</p>
              </div>
              {/* Decorative dots for map-like effect */}
              <div className="absolute top-6 left-10 w-3 h-3 bg-red-400 rounded-full opacity-60" />
              <div className="absolute top-12 right-16 w-3 h-3 bg-red-400 rounded-full opacity-60" />
              <div className="absolute bottom-14 left-20 w-3 h-3 bg-red-400 rounded-full opacity-60" />
              <div className="absolute bottom-8 right-24 w-3 h-3 bg-red-400 rounded-full opacity-60" />
              <div className="absolute top-20 left-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-60" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gangnam-text">지도 보기</span>
              <span className="text-xs text-gangnam-primary font-medium">탭하여 이동 →</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
