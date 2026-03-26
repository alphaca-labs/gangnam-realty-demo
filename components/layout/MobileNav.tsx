"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Calculator, BarChart3, FileText } from "lucide-react";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/chat", label: "AI 질의", icon: MessageSquare },
  { href: "/calculator", label: "수수료", icon: Calculator },
  { href: "/prices", label: "실거래가", icon: BarChart3 },
  { href: "/guide", label: "민원", icon: FileText },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] px-2 py-1 rounded-md transition-colors ${
                isActive
                  ? "text-gangnam-primary"
                  : "text-gangnam-sub hover:text-gangnam-primary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
