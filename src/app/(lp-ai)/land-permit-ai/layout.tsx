import { Gowun_Batang, JetBrains_Mono } from 'next/font/google';
import './tokens.css';

const serif = Gowun_Batang({
  weight: ['400', '700'],
  variable: '--lp-font-serif',
  subsets: ['latin'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  weight: ['400', '500'],
  variable: '--lp-font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export default function LandPermitAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${serif.variable} ${mono.variable} lp-ai-root`}>
      {children}
    </div>
  );
}
