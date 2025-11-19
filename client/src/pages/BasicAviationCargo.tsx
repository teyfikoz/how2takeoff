import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CargoCalculator from "@/components/CargoCalculator";
import { useSEO } from '@/hooks/useSEO';

export default function BasicAviationCargo() {
  useSEO({
    title: 'Basic Aviation Cargo Concepts - How2TakeOff',
    description: 'Understanding fundamental cargo aviation concepts including payload capacity, cargo metrics, weight & balance, and cargo optimization with interactive calculators.',
    keywords: 'aviation cargo, air freight, cargo capacity, payload, weight and balance, cargo optimization, air cargo metrics',
    canonical: 'https://how2takeoff.com/basic-aviation-cargo'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
            Basic Aviation Cargo Concepts
          </h1>
          <p className="mt-2 text-gray-700 text-lg">
            Understanding fundamental cargo aviation concepts, metrics, and calculations
          </p>
        </header>

        {/* Key Cargo Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Cargo Yield</p>
                  <h3 className="text-3xl font-bold text-orange-600 mt-2">$3.80</h3>
                  <p className="text-xs text-gray-500 mt-1">per FTK</p>
                </div>
                <svg className="h-12 w-12 text-orange-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Load Factor</p>
                  <h3 className="text-3xl font-bold text-blue-600 mt-2">68%</h3>
                  <p className="text-xs text-gray-500 mt-1">Industry Average</p>
                </div>
                <svg className="h-12 w-12 text-blue-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fuel Efficiency</p>
                  <h3 className="text-3xl font-bold text-green-600 mt-2">0.75</h3>
                  <p className="text-xs text-gray-500 mt-1">kg/ton-km</p>
                </div>
                <svg className="h-12 w-12 text-green-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Break-Even LF</p>
                  <h3 className="text-3xl font-bold text-purple-600 mt-2">55%</h3>
                  <p className="text-xs text-gray-500 mt-1">Typical Range</p>
                </div>
                <svg className="h-12 w-12 text-purple-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator">Cargo Calculator</TabsTrigger>
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
            <TabsTrigger value="formulas">Formulas & Concepts</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <CargoCalculator />
          </TabsContent>

          <TabsContent value="metrics">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="text-2xl">Key Cargo Metrics & Indicators</CardTitle>
                <p className="text-gray-600 mt-2">Essential performance indicators for cargo operations</p>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                    <h4 className="font-semibold">Payload Capacity</h4>
                    <p className="text-sm mt-2">Maximum weight of cargo and passengers</p>
                    <p className="font-mono text-sm mt-1">Max Payload = MTOW - OEW - Fuel Load</p>
                    <p className="text-sm mt-2 text-gray-600">Critical for flight planning</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-lg border-2 border-green-200 shadow-md hover:shadow-lg transition-shadow">
                    <h4 className="font-semibold">Volume Utilization</h4>
                    <p className="text-sm mt-2">Efficiency of cargo space usage</p>
                    <p className="font-mono text-sm mt-1 bg-white p-2 rounded border border-green-200">Utilization = (Actual Volume / Max Volume) × 100%</p>
                    <p className="text-sm mt-2 text-gray-600">Space optimization metric</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-lg border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
                    <h4 className="font-semibold">Freight Ton Kilometers (FTK)</h4>
                    <p className="text-sm mt-2">Revenue-generating cargo transport work</p>
                    <p className="font-mono text-sm mt-1 bg-white p-2 rounded border border-purple-200">FTK = Cargo Weight (tons) × Distance (km)</p>
                    <p className="text-sm mt-2 text-gray-600">Key performance indicator</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-lg border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
                    <h4 className="font-semibold">Cargo Load Factor</h4>
                    <p className="text-sm mt-2">Cargo capacity utilization rate</p>
                    <p className="font-mono text-sm mt-1">Load Factor = (Actual Weight / Max Capacity) × 100%</p>
                    <p className="text-sm mt-2 text-gray-600">Efficiency measurement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formulas">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
                <CardTitle className="text-2xl">Essential Cargo Calculations</CardTitle>
                <p className="text-gray-600 mt-2">Key formulas for cargo revenue and cost analysis</p>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h3 className="text-xl font-bold text-green-700 mb-4">Revenue Calculations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border-2 border-blue-200 shadow-md">
                      <h4 className="font-semibold">Cargo Yield</h4>
                      <p className="text-sm mt-2">Revenue per freight ton-kilometer</p>
                      <div className="font-mono text-sm mt-1 space-y-1">
                        <p>Yield = Revenue / FTK</p>
                        <p>Example: $600,000 / 150,000 = $4 per FTK</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-lg border-2 border-green-200 shadow-md">
                      <h4 className="font-semibold">Break-Even Load Factor</h4>
                      <p className="text-sm mt-2">Minimum load required for profitability</p>
                      <div className="font-mono text-sm mt-1 space-y-1 bg-white p-3 rounded border border-green-200">
                        <p>BELF = (Operating Cost / Revenue) × 100%</p>
                        <p className="text-green-600">Example: ($500,000 / $600,000) × 100% = 83.3%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-green-700 mb-4">Fuel Efficiency Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-lg border-2 border-purple-200 shadow-md">
                      <h4 className="font-semibold">Fuel Burn per Ton-Kilometer</h4>
                      <div className="font-mono text-sm mt-1 space-y-1 bg-white p-3 rounded border border-purple-200">
                        <p>FBTK = Total Fuel Burn / Total FTK</p>
                        <p className="text-purple-600">Example: 120,000 kg / 150,000 = 0.8 kg/ton-km</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-lg border-2 border-orange-200 shadow-md">
                      <h4 className="font-semibold">Fuel Cost per Ton-Kilometer</h4>
                      <div className="font-mono text-sm mt-1 space-y-1">
                        <p>FCTK = FBTK × Fuel Price</p>
                        <p>Example: 0.8 kg/ton-km × $0.90/kg = $0.72/ton-km</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization">
            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-2xl">Cargo Optimization Strategies</CardTitle>
                <p className="text-gray-600 mt-2">Advanced techniques for maximizing cargo efficiency and profitability</p>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h3 className="text-xl font-bold text-purple-700 mb-4">ULD Optimization</h3>
                  <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border-2 border-blue-200 shadow-md mt-2">
                    <h4 className="font-semibold">ULD Load Factor Calculation</h4>
                    <div className="font-mono text-sm mt-1 space-y-1">
                      <p>ULD Load Factor = (Actual Load / Max ULD Capacity) × 100%</p>
                      <p>Example: (4,000 kg / 5,000 kg) × 100% = 80%</p>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-semibold">Optimization Tips:</h5>
                      <ul className="list-disc pl-4 mt-2 text-sm">
                        <li>Balance weight and volume constraints</li>
                        <li>Consider cargo density and stackability</li>
                        <li>Plan for weight distribution</li>
                        <li>Optimize loading sequence</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-purple-700 mb-4">Dynamic Pricing Strategy</h3>
                  <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-lg border-2 border-green-200 shadow-md mt-2">
                    <h4 className="font-semibold">Dynamic Rate Calculation</h4>
                    <div className="font-mono text-sm mt-1 space-y-1">
                      <p>Final Rate = Base Rate × (1 + Fuel Surcharge) × (1 + Demand Factor)</p>
                      <p>Example: $2.00 × (1 + 10%) × (1 + 15%) = $2.53 per kg</p>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-semibold">Pricing Factors:</h5>
                      <ul className="list-disc pl-4 mt-2 text-sm">
                        <li>Current market demand</li>
                        <li>Fuel price fluctuations</li>
                        <li>Seasonal variations</li>
                        <li>Competitor pricing</li>
                        <li>Route profitability</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}