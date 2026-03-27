'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Calculator,
  FileCheck,
  FileText,
  BarChart3,
  Map,
  FileQuestion,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: MessageSquare, label: 'AI 상담', href: '/' },
  { icon: Calculator, label: '수수료 계산기', href: '/calculator' },
  { icon: FileCheck, label: '확인서 도우미', href: '/checklist' },
  { icon: FileText, label: '전자계약 가이드', href: '/contract' },
  { icon: BarChart3, label: '실거래가 조회', href: '/prices' },
  { icon: Map, label: '부동산 지도', href: '/map' },
  { icon: FileQuestion, label: '민원 가이드', href: '/civil' },
  { icon: Sparkles, label: 'AI 상담 고도화', href: '/ai-compare' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-sidebar border-r border-border transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="text-2xl">🏛️</div>
              <div>
                <h1 className="font-bold text-lg text-primary">강남부동산톡</h1>
                <p className="text-xs text-text-secondary">AI 부동산 상담</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-sidebar-hover rounded-lg transition-colors"
          >
            {collapsed ? (
              <PanelLeft className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* 메뉴 */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className={cn('text-xs font-semibold text-text-secondary mb-2', collapsed && 'hidden')}>
            기능 메뉴
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'hover:bg-sidebar-hover text-text-primary',
                  collapsed && 'justify-center'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* 푸터 */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="text-xs text-text-secondary text-center">
              © 2026 강남구청
              <br />
              Demo v2.0
            </div>
          </div>
        )}
      </aside>

      {/* 모바일 헤더 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🏛️</div>
            <div>
              <h1 className="font-bold text-sm text-primary">강남부동산톡</h1>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 하단 네비게이션 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-border">
        <div className="flex justify-around items-center py-2">
          {menuItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
                  isActive ? 'text-primary' : 'text-text-secondary'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
