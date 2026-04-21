'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Calculator,
  ClipboardList,
  FileCheck,
  FileText,
  LayoutGrid,
  BarChart3,
  MapPin,
  Landmark,
  Bot,
  Plus,
  X,
  Menu,
  ExternalLink,
  UserPlus,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { recentChats } from '@/data/chat-scenarios';
import { quickSiteLinks } from '@/data/channel-home';

const menuItems = [
  { href: '/land-permit/', label: '토지거래허가', icon: FileCheck },
  { href: '/', label: '채널 홈', icon: MessageSquare },
  { href: '/civil/', label: '자주 찾는 안내', icon: Landmark },
  { href: '/contract/', label: '계약/신고 가이드', icon: FileText },
  { href: '/calculator/', label: '부동산중개보수', icon: Calculator },
  { href: '/prices/', label: '실거래가 조회', icon: BarChart3 },
  { href: '/map/', label: '부동산 지도', icon: MapPin },
  { href: '/checklist/', label: '확인서 도우미', icon: ClipboardList },
  { href: '/employment/', label: '고용신고 도우미', icon: UserPlus },
  { href: '/business-registration/', label: '개설 등록 도우미', icon: Store },
  { href: '/examples/', label: '웹 출력 예시', icon: LayoutGrid },
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
        <Image src="/gangnam-realty-demo/gangnam-logo.png" alt="강남구" width={32} height={32} className="object-contain" />
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
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">메뉴</p>
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

      {/* Site Links */}
      <div className="border-t px-3 py-3">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">사이트 바로가기</p>
        <div className="flex flex-col gap-0.5">
          {quickSiteLinks.map((item) => (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{item.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Chats */}
      <div className="mt-auto border-t px-3 py-3">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">자주 묻는 질문</p>
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
