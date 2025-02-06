import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BasicAviationCargo() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">
            Basic Aviation Cargo Concepts
          </h1>
          <p className="mt-2 text-gray-600">
            Understanding fundamental cargo aviation concepts, metrics, and industry practices
          </p>
        </header>

        <Tabs defaultValue="basics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Cargo Basics</TabsTrigger>
            <TabsTrigger value="metrics">Cargo Metrics</TabsTrigger>
            <TabsTrigger value="comparison">Operations Comparison</TabsTrigger>
            <TabsTrigger value="strategy">Optimization Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <Card>
              <CardHeader>
                <CardTitle>Air Cargo Transportation Basics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Types of Cargo Operations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-100 p-4 rounded-md">
                      <h4 className="font-semibold">Belly Cargo</h4>
                      <ul className="list-disc pl-4 mt-2 text-sm">
                        <li>Uses cargo hold of passenger aircraft</li>
                        <li>Additional revenue without extra flights</li>
                        <li>Ideal for mail and small packages</li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <h4 className="font-semibold">Dedicated Freighters</h4>
                      <ul className="list-disc pl-4 mt-2 text-sm">
                        <li>Cargo-only aircraft operations</li>
                        <li>Used by express carriers (DHL, FedEx)</li>
                        <li>Handles bulk freight and heavy cargo</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mt-6">Why Air Cargo?</h3>
                  <div className="bg-gray-100 p-4 rounded-md mt-2">
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Speed of delivery for time-sensitive goods</li>
                      <li>Ideal for high-value, perishable items</li>
                      <li>Global reach and accessibility</li>
                      <li>Integration with global supply chains</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>Key Cargo Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-md">
                    <h4 className="font-semibold">AFTK (Available Freight Tonne Kilometers)</h4>
                    <p className="text-sm mt-2">Total capacity available for cargo transport</p>
                    <p className="font-mono text-sm mt-1">AFTK = Available Cargo Space × Distance</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <h4 className="font-semibold">RFTK (Revenue Freight Tonne Kilometers)</h4>
                    <p className="text-sm mt-2">Actual volume of paying cargo transported</p>
                    <p className="font-mono text-sm mt-1">RFTK = Actual Cargo × Distance</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <h4 className="font-semibold">Freight Load Factor (FLF)</h4>
                    <p className="text-sm mt-2">Efficiency of cargo space utilization</p>
                    <p className="font-mono text-sm mt-1">FLF = (RFTK ÷ AFTK) × 100%</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <h4 className="font-semibold">Cargo Yield</h4>
                    <p className="text-sm mt-2">Revenue per tonne-kilometer of cargo</p>
                    <p className="font-mono text-sm mt-1">Yield = Revenue ÷ RFTK</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Passenger vs Cargo Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Emirates</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="font-semibold">Network</p>
                        <p className="text-sm">Serves 150+ cities in 80 countries</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="font-semibold">Fleet</p>
                        <p className="text-sm">Large fleet of A380s and 777s</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="font-semibold">Cargo Volume (2023/24)</p>
                        <p className="text-sm">2.18 million metric tons</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Delta Air Lines</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="font-semibold">Network</p>
                        <p className="text-sm">325 destinations in 52 countries</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="font-semibold">Fleet</p>
                        <p className="text-sm">Mixed fleet for varied operations</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="font-semibold">Strategy</p>
                        <p className="text-sm">Focus on belly cargo integration</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-100 p-4 rounded-md">
                    <h4 className="font-semibold">Dynamic Fleet Usage</h4>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                      <li>Convert passenger aircraft for cargo</li>
                      <li>Flexible capacity management</li>
                      <li>Seasonal demand adjustment</li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <h4 className="font-semibold">Revenue Management</h4>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                      <li>Dynamic pricing for cargo space</li>
                      <li>Priority cargo services</li>
                      <li>Seasonal pricing strategies</li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <h4 className="font-semibold">Strategic Partnerships</h4>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                      <li>E-commerce integration</li>
                      <li>Logistics company alliances</li>
                      <li>Express delivery services</li>
                    </ul>
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
