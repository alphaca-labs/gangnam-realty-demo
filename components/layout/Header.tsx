"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Building2 } from "lucide-react";

const navLinks = [
  { href: "/chat", label: "AI 질의" },
  { href: "/calculator", label: "수수료 계산기" },
  { href: "/prices", label: "실거래가" },
  { href: "/guide", label: "민원 가이드" },
  { href: "/map", label: "지도" },
  { href: "/documents", label: "서류/양식" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="w-7 h-7 text-gangnam-primary" />
          <span className="font-bold text-lg text-gangnam-text">강남부동산톡</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-md text-sm font-medium text-gangnam-sub hover:text-gangnam-primary hover:bg-gangnam-bg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setOpen(!open)}
          aria-label="메뉴 열기"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t border-border bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-base font-medium text-gangnam-sub hover:text-gangnam-primary hover:bg-gangnam-bg border-b border-border/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
