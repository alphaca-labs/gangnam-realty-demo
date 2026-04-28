import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '강남부동산톡 | AI 부동산 상담',
  description: '강남 부동산, 무엇이든 물어보세요. AI 기반 부동산 상담 서비스.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
