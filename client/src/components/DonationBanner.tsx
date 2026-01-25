import React from 'react';
import { Brain, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function DonationBanner() {
  return (
    <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-white">
          <Brain className="h-6 w-6" />
          <div>
            <h3 className="text-sm font-semibold">Explore AI-Powered Cargo Pricing</h3>
            <p className="text-xs text-blue-100">See how demand forecasting connects to dynamic pricing</p>
          </div>
        </div>
        <Link
          href="/basic-aviation-cargo"
          className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          Learn More
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
