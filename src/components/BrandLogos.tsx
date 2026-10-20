import React from 'react';

interface LogoProps {
  className?: string;
  useBrandColor?: boolean;
}

/**
 * Bundled local logos. Unknown IDs use a neutral generic car mark instead of
 * silently displaying Mitsubishi's logo, which made several brands appear duplicated.
 */
const KNOWN_BRANDS = new Set([
  'mitsubishi', 'toyota', 'nissan', 'suzuki', 'subaru', 'honda',
  'mazda', 'lexus', 'infiniti', 'daihatsu', 'isuzu'
]);

export function BrandLogo({
  brandId,
  className = 'w-6 h-6',
}: {
  brandId: string;
  className?: string;
  useBrandColor?: boolean;
}) {
  const id = brandId.toLowerCase();
  const safeId = KNOWN_BRANDS.has(id) ? id : 'generic-car';
  return (
    <img
      src={`/brand-logos/${safeId}.svg`}
      className={className}
      alt={KNOWN_BRANDS.has(id) ? `${id[0].toUpperCase() + id.slice(1)} logo` : 'Generic car symbol'}
      loading="eager"
      decoding="async"
      style={{ objectFit: 'contain', flexShrink: 0, backgroundColor: '#fff', borderRadius: '0.375rem', padding: '2px', boxSizing: 'border-box' }}
      onError={(event) => {
        const image = event.currentTarget;
        if (!image.src.endsWith('/brand-logos/generic-car.svg')) {
          image.src = '/brand-logos/generic-car.svg';
          image.alt = 'Generic car symbol';
        }
      }}
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
