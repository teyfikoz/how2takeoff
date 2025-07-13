import React from 'react';
import RealTimeFlights from '@/components/RealTimeFlights';
import DonationBanner from '@/components/DonationBanner';

export default function RealTimeFlightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DonationBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gerçek Zamanlı Uçuş Takibi
          </h1>
          <p className="text-gray-600 mt-2">
            AviationStack API kullanarak canlı uçuş verilerini görüntüleyin, takip edin ve analiz edin
          </p>
        </div>
        
        <RealTimeFlights />
      </div>
    </div>
  );
}