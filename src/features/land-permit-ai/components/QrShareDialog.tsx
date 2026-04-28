'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { CaseType } from '@/data/land-permit';
import type { Answers } from '../types/answers';
import { buildShareUrl, encodeShareToken } from '../share/encode';
import { Icons } from './v2/Icons';

interface QrShareDialogProps {
  open: boolean;
  caseType: CaseType | null;
  answers: Answers;
  onClose: () => void;
}

export function QrShareDialog({ open, caseType, answers, onClose }: QrShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const url = useMemo(() => {
    if (!caseType) return '';
    const token = encodeShareToken({ caseType, answers });
    return buildShareUrl(token);
  }, [caseType, answers]);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    return undefined;
  }, [open, onClose]);

  if (!open) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const fallback = document.createElement('textarea');
      fallback.value = url;
      document.body.appendChild(fallback);
      fallback.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(fallback);
      }
    }
  }

  function handleDownload() {
    const svg = svgRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const size = 720;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(svgUrl);
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const png = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = png;
      a.download = '토지거래허가_공유.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 60,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          background: 'white',
          borderRadius: 18,
          padding: 24,
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
          border: '1px solid var(--line)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            width: 32,
            height: 32,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            background: 'transparent',
            border: 'none',
            color: 'var(--ink-3)',
          }}
        >
          <Icons.close size={16} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--brand-ink)',
              margin: 0,
            }}
          >
            QR 공유
          </p>
          <h3
            style={{
              marginTop: 6,
              marginBottom: 0,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
            }}
          >
            QR로 입력 내역을 전달하세요
          </h3>
          <p style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-3)' }}>
            서버 저장 없이 URL 해시(#s=…)에만 데이터가 담깁니다.
          </p>
        </div>

        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              borderRadius: 16,
              border: '1px solid var(--line)',
              background: 'white',
              padding: 12,
              boxShadow: 'var(--shadow-1)',
            }}
          >
            {url ? (
              <QRCodeSVG
                ref={svgRef}
                value={url}
                size={220}
                level="M"
                marginSize={2}
                fgColor="rgb(20, 65, 150)"
                bgColor="#FFFFFF"
              />
            ) : (
              <div
                style={{
                  width: 220,
                  height: 220,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  color: 'var(--ink-3)',
                }}
              >
                URL 생성 중...
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            border: '1px solid var(--line)',
            background: 'var(--paper-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
            }}
          >
            공유 URL
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: 'var(--ink)',
              wordBreak: 'break-all',
            }}
          >
            {url}
          </p>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={handleCopy}
            className="btn btn-ghost"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Icons.copy size={14} />
            {copied ? '복사됨' : 'URL 복사'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Icons.download size={14} />
            QR 저장
          </button>
        </div>
      </div>
    </div>
  );
}
