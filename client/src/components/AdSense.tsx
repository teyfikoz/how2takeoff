/**
 * Google AdSense Integration Component
 *
 * Publisher ID: ca-pub-1281503375146617
 * Ad Slot ID: 5782684334
 *
 * Get your AdSense IDs from: https://adsense.google.com/
 */
import { Adsense } from '@ctrl/react-adsense';
import type { CSSProperties } from 'react';

// AdSense Configuration
const ADSENSE_CLIENT = "ca-pub-1281503375146617";
const ADSENSE_SLOT = "5782684334";

interface AdUnitProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | '';
  layout?: 'in-article' | 'in-feed';
  style?: CSSProperties;
  className?: string;
}

export function AdUnit({
  slot = ADSENSE_SLOT,
  format = 'auto',
  layout,
  style = {},
  className = ''
}: AdUnitProps) {
  return (
    <div className={`my-4 text-center ${className}`} style={{ minHeight: '90px', ...style }}>
      <Adsense
        client={ADSENSE_CLIENT}
        slot={slot}
        style={{ display: 'block' }}
        format={format}
        layout={layout}
        responsive="true"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function HeaderAd() {
  return (
    <AdUnit
      format="auto"
      className="max-w-7xl mx-auto"
      style={{ minHeight: '90px' }}
    />
  );
}

export function SidebarAd() {
  return (
    <AdUnit
      format="rectangle"
      className="sticky top-4"
      style={{ minHeight: '250px' }}
    />
  );
}

export function InContentAd() {
  return (
    <AdUnit
      format="fluid"
      layout="in-article"
      style={{ minHeight: '100px' }}
    />
  );
}

export function FooterAd() {
  return (
    <AdUnit
      format="auto"
      className="max-w-7xl mx-auto"
      style={{ minHeight: '90px' }}
    />
  );
}
