interface LogoProps {
  small?: boolean;
}

export function Logo({ small }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        className="logo-mark"
        style={small ? { width: 28, height: 28, fontSize: 14 } : undefined}
      >
        강
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ fontWeight: 700, fontSize: small ? 14 : 15, letterSpacing: '-0.02em' }}>
          강남부동산톡
        </span>
        <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500 }}>
          토지거래허가 도우미
        </span>
      </div>
    </div>
  );
}
