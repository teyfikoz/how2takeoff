/**
 * Google AdSense Integration Component
 * 
 * IMPORTANT: Before deploying to production, you MUST replace the placeholder values:
 * 
 * 1. In client/index.html (line ~80):
 *    Replace: ca-pub-XXXXXXXXXXXXXXXX
 *    With: Your actual Google AdSense Publisher ID
 * 
 * 2. In this file (line 26):
 *    Replace: ca-pub-XXXXXXXXXXXXXXXX
 *    With: Your actual Google AdSense Publisher ID
 * 
 * 3. Update ad slot IDs in each component below:
 *    - HeaderAd slot="1234567890" → Your actual Header Ad Slot ID
 *    - SidebarAd slot="0987654321" → Your actual Sidebar Ad Slot ID
 *    - InContentAd slot="1122334455" → Your actual In-Content Ad Slot ID
 *    - FooterAd slot="5544332211" → Your actual Footer Ad Slot ID
 * 
 * Get your AdSense IDs from: https://adsense.google.com/
 */
import { Adsense } from '@ctrl/react-adsense';
import type { CSSProperties } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | '';
  layout?: 'in-article' | 'in-feed';
  style?: CSSProperties;
  className?: string;
}

export function AdUnit({ 
  slot, 
  format = 'auto', 
  layout, 
  style = {},
  className = ''
}: AdUnitProps) {
  return (
    <div className={`my-4 text-center ${className}`} style={{ minHeight: '90px', ...style }}>
      <Adsense
        client="ca-pub-XXXXXXXXXXXXXXXX"
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
      slot="1234567890" 
      format="auto"
      className="max-w-7xl mx-auto"
      style={{ minHeight: '90px' }}
    />
  );
}

export function SidebarAd() {
  return (
    <AdUnit 
      slot="0987654321" 
      format="rectangle"
      className="sticky top-4"
      style={{ minHeight: '250px' }}
    />
  );
}

export function InContentAd() {
  return (
    <AdUnit 
      slot="1122334455" 
      format="fluid"
      layout="in-article"
      style={{ minHeight: '100px' }}
    />
  );
}

export function FooterAd() {
  return (
    <AdUnit 
      slot="5544332211" 
      format="auto"
      className="max-w-7xl mx-auto"
      style={{ minHeight: '90px' }}
    />
  );
}
