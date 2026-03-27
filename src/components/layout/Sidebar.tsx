'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare, Calculator, ClipboardList, FileText,
  LayoutGrid, BarChart3, MapPin, Landmark, Bot,
  Plus, X, Menu, ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { recentChats } from '@/data/chat-scenarios';

const menuItems = [
  { href: '/', label: 'AI 상담', icon: MessageSquare },
  { href: '/calculator/', label: '수수료 계산기', icon: Calculator },
  { href: '/checklist/', label: '확인서 도우미', icon: ClipboardList },
  { href: '/contract/', label: '전자계약 가이드', icon: FileText },
  { href: '/examples/', label: '타입별 출력 예시', icon: LayoutGrid },
  { href: '/prices/', label: '실거래가 조회', icon: BarChart3 },
  { href: '/map/', label: '부동산 지도', icon: MapPin },
  { href: '/civil/', label: '민원 가이드', icon: Landmark },
  { href: '/ai-compare/', label: 'AI 상담 고도화', icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const basePath = '/gangnam-realty-demo';

  function isActive(href: string) {
    const fullPath = basePath + href;
    if (href === '/') return pathname === basePath || pathname === basePath + '/';
    return pathname.startsWith(fullPath);
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
          강
        </div>
        <span className="text-base font-semibold text-foreground">강남부동산톡</span>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-2">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-hover"
        >
          <Plus className="h-4 w-4" />
          새 대화
        </Link>
      </div>

      {/* Menu Items */}
      <div className="px-3 py-2">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">기능 메뉴</p>
        <nav className="flex flex-col gap-0.5">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                isActive(item.href)
                  ? 'bg-sidebar-hover text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-sidebar-hover hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Recent Chats */}
      <div className="mt-auto border-t px-3 py-3">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">최근 대화</p>
        <div className="flex flex-col gap-0.5">
          {recentChats.map((chat) => (
            <button
              key={chat.id}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground"
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md transition-colors hover:bg-gray-50 lg:hidden"
        aria-label="메뉴 열기"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-sidebar transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-hover"
          aria-label="메뉴 닫기"
        >
          <X className="h-4 w-4" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[260px] lg:shrink-0 lg:flex-col lg:border-r lg:bg-sidebar">
        {sidebarContent}
      </aside>
    </>
  );
}
