import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import FilterForm from '@/components/aircraft/FilterForm';
import ComparisonCharts from '@/components/aircraft/ComparisonCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Aircraft } from '@shared/schema';
import { ArrowRight, Wind, ArrowUpRight, ArrowRight as ArrowRightIcon, Plane, TrendingUp } from 'lucide-react';
import WindImpactChart from '@/components/aircraft/WindImpactChart';
import DonationBanner from '@/components/DonationBanner';
import { InContentAd, FooterAd, SidebarAd } from '@/components/AdSense';
import { useSEO } from '@/hooks/useSEO';
import { mockAircraftData } from '@/data/mockAircraftData';
import AIRecommendation from '@/components/AIRecommendation';

interface FilterCriteria {
  passengers: number;
  cargo: number;
  range: number;
  alternateRange: number;
  windSpeed: number;
  windDirection: number;
}

export default function Dashboard() {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria | null>(null);

  useSEO({
    title: 'Aviation Analysis Dashboard - How2TakeOff',
    description: 'Find the most suitable aircraft types based on your flight requirements and analyze detailed comparisons. Advanced wind impact analysis and performance metrics.',
    keywords: 'aviation dashboard, aircraft comparison, flight planning, wind impact analysis, aviation analytics',
    canonical: 'https://how2takeoff.com/'
  });

  const { data: aircraftData = mockAircraftData } = useQuery<typeof mockAircraftData>({
    queryKey: ['/api/aircraft'],
    initialData: mockAircraftData,
  });

  const calculateEffectiveRange = (aircraft: Aircraft, windSpeed: number, windDirection: number) => {
    const windRadians = (windDirection * Math.PI) / 180;
    const windEffect = Math.cos(windRadians) * windSpeed;
    const effectiveSpeed = aircraft.cruiseSpeed - windEffect;
    return aircraft.maxRange * (effectiveSpeed / aircraft.cruiseSpeed);
  };

  const filteredAircraft = useMemo(() => {
    if (!filterCriteria || !aircraftData) return [];

    return aircraftData.filter((aircraft: Aircraft) => {
      const passengerCheck = filterCriteria.passengers <= aircraft.maxPassengers;
      const cargoCheck = filterCriteria.cargo <= aircraft.cargoCapacity;

      const effectiveRange = calculateEffectiveRange(
        aircraft,
        filterCriteria.windSpeed,
        filterCriteria.windDirection
      );

      const maxRequiredRange = Math.max(filterCriteria.range, filterCriteria.alternateRange);
      const rangeCheck = maxRequiredRange <= effectiveRange;

      return passengerCheck && cargoCheck && rangeCheck;
    });
  }, [aircraftData, filterCriteria]);

  const handleFilter = (criteria: FilterCriteria) => {
    setFilterCriteria(criteria);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 flex items-center justify-center lg:justify-start gap-3">
            <Plane className="h-10 w-10 text-blue-600" />
            Aviation Analysis Dashboard
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Find the most suitable aircraft types based on your flight requirements and analyze detailed comparisons.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <FilterForm onFilter={handleFilter} />

            <AIRecommendation />

            {filteredAircraft.length > 0 ? (
              <>
                <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      Suitable Aircraft Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredAircraft.map((aircraft: Aircraft) => (
                        <Card 
                          key={aircraft.id} 
                          className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50"
                        >
                          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white pb-4">
                            <CardTitle className="text-xl font-bold">{aircraft.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Max Passengers:</span>
                                <span className="font-bold text-blue-700">{aircraft.maxPassengers}</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Cargo Capacity:</span>
                                <span className="font-bold text-green-700">{aircraft.cargoCapacity.toLocaleString()} kg</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Range:</span>
                                <span className="font-bold text-purple-700">{aircraft.maxRange.toLocaleString()} km</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Fuel Efficiency:</span>
                                <span className="font-bold text-orange-700">{(aircraft.fuelEfficiency * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <WindImpactChart aircraftData={filteredAircraft} />

                <Card className="border-2 border-purple-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl">Performance Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <ComparisonCharts aircraftData={filteredAircraft} />
                  </CardContent>
                </Card>

                <InContentAd />
              </>
            ) : filterCriteria ? (
              <Card className="border-2 border-red-200 shadow-xl bg-gradient-to-br from-white to-red-50">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">✈️</div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">No Matching Aircraft Found</h3>
                    <p className="text-gray-600 text-lg mb-6">
                      The search criteria exceed available aircraft capabilities:
                    </p>
                    <div className="mt-6 text-left max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border-2 border-gray-200">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                          <span className="font-medium">Passengers:</span>
                          <span className="font-bold text-blue-700">{filterCriteria.passengers}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                          <span className="font-medium">Cargo:</span>
                          <span className="font-bold text-green-700">{filterCriteria.cargo.toLocaleString()} kg</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                          <span className="font-medium">Range:</span>
                          <span className="font-bold text-purple-700">{filterCriteria.range.toLocaleString()} km</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                          <span className="font-medium">Wind Speed:</span>
                          <span className="font-bold text-orange-700">{filterCriteria.windSpeed} knots</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-pink-50 rounded-lg">
                          <span className="font-medium">Wind Direction:</span>
                          <span className="font-bold text-pink-700">{filterCriteria.windDirection}°</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-80 space-y-6">
            <SidebarAd />
            <Card className="border-2 border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <CardTitle className="text-lg">💡 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700 font-medium">
                    Use alternateRange for safety margin
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-gray-700 font-medium">
                    Consider wind impact on fuel consumption
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <p className="text-gray-700 font-medium">
                    Compare multiple aircraft for best efficiency
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <FooterAd />

        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-6">
          <p className="text-base font-medium">Data based on BADA (Base of Aircraft Data) model</p>
          <p className="mt-2">© Aviation Performance Analytics</p>
          
          <DonationBanner />
        </footer>
      </div>
    </div>
  );
}
