import React from 'react';

interface LogoProps {
  className?: string;
  useBrandColor?: boolean;
}

/**
 * Local, bundled logo files: no network request is made at runtime.
 * Logos are sourced from Simple Icons and curated Wikimedia-derived SVG collections.
 * Brand trademarks remain the property of their respective owners.
 */
export function BrandLogo({
  brandId,
  className = 'w-6 h-6',
  useBrandColor = true
}: {
  brandId: string;
  className?: string;
  useBrandColor?: boolean;
}) {
  const id = brandId.toLowerCase();
  const known = new Set(['mitsubishi','toyota','nissan','suzuki','subaru','honda','mazda','lexus','infiniti','daihatsu','isuzu']);
  const safeId = known.has(id) ? id : 'mitsubishi';
  return (
    <img
      src={`/brand-logos/${safeId}.svg`}
      className={className}
      alt={`${safeId[0].toUpperCase() + safeId.slice(1)} logo`}
      loading="eager"
      decoding="async"
      style={{ objectFit: 'contain' }}
    />
  );
}

export {
  BrandLogo as MitsubishiLogo,
  BrandLogo as ToyotaLogo,
  BrandLogo as NissanLogo,
  BrandLogo as SuzukiLogo,
  BrandLogo as SubaruLogo,
  BrandLogo as HondaLogo,
  BrandLogo as MazdaLogo,
  BrandLogo as LexusLogo,
  BrandLogo as InfinitiLogo,
  BrandLogo as DaihatsuLogo,
  BrandLogo as IsuzuLogo
};
