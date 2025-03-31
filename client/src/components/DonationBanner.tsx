import React from 'react';

export default function DonationBanner() {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-sm font-medium text-blue-800 mb-2">Support This Project</h3>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">XRP: rPu9SuQBv9ZWXGBaUgaHJ1PauSj98arjbV</span>
          <a href="https://xaman.app/detect/request:rPu9SuQBv9ZWXGBaUgaHJ1PauSj98arjbV" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">XUMM Wallet</a>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">USDT (TRC20): TJoUFBDEFXMPgdZ2yj8yBXCo7TURfiZ3hQ</span>
          <a href="https://link.trustwallet.com/send?address=TJoUFBDEFXMPgdZ2yj8yBXCo7TURfiZ3hQ&asset=c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">Trust Wallet</a>
        </div>
      </div>
    </div>
  );
}