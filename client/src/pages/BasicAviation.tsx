import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BasicAviation() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">
            Basic Aviation Concepts
          </h1>
          <p className="mt-2 text-gray-600">
            Understanding fundamental aviation concepts, metrics, and industry practices
          </p>
        </header>

        <Tabs defaultValue="concepts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="concepts">Key Concepts</TabsTrigger>
            <TabsTrigger value="metrics">Aviation Metrics</TabsTrigger>
            <TabsTrigger value="calculations">Example Calculations</TabsTrigger>
            <TabsTrigger value="case-study">Case Study</TabsTrigger>
            <TabsTrigger value="cargo">Cargo Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="concepts">
            <Card>
              <CardHeader>
                <CardTitle>Why Do Airlines Overbook Flights?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Passenger No-Shows</h3>
                  <p className="text-gray-600">Many passengers miss their flights due to:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Last-minute changes in plans</li>
                    <li>Flight delays affecting connections</li>
                    <li>Booking multiple flights and choosing one (corporate travelers)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Maximizing Revenue and Load Factor</h3>
                  <p className="text-gray-600">
                    Airlines operate on thin profit margins, meaning they need to fill as many seats as possible to be profitable.
                    If they don't sell extra tickets, empty seats lead to lost revenue.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">The Compensation System</h3>
                  <p className="text-gray-600">If too many passengers show up, airlines compensate some to take a later flight by offering:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Cash or travel vouchers</li>
                    <li>Free hotel accommodations</li>
                    <li>Meal allowances</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>Key Aviation Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Available Seat Kilometers (ASK)</h3>
                  <p className="text-gray-600">Total seating capacity offered over distance</p>
                  <div className="bg-gray-100 p-3 rounded-md mt-2">
                    <p className="font-mono">ASK = Number of Seats × Distance Flown</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Revenue Passenger Kilometers (RPK)</h3>
                  <p className="text-gray-600">Actual passenger traffic measurement</p>
                  <div className="bg-gray-100 p-3 rounded-md mt-2">
                    <p className="font-mono">RPK = Number of Paying Passengers × Distance Flown</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Load Factor (LF)</h3>
                  <p className="text-gray-600">Efficiency of filling seats</p>
                  <div className="bg-gray-100 p-3 rounded-md mt-2">
                    <p className="font-mono">Load Factor = (RPK ÷ ASK) × 100%</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Other Important Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-100 p-3 rounded-md">
                      <p className="font-semibold">RASK (Revenue per ASK)</p>
                      <p className="font-mono text-sm">Total Revenue ÷ ASK</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <p className="font-semibold">CASK (Cost per ASK)</p>
                      <p className="font-mono text-sm">Total Cost ÷ ASK</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculations">
            <Card>
              <CardHeader>
                <CardTitle>Example Calculations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Sample Flight Scenario:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Aircraft with 200 seats</li>
                      <li>Route distance: 1,000 km</li>
                      <li>150 passengers booked</li>
                      <li>Ticket price: $100</li>
                      <li>Operating cost: $15,000</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">ASK Calculation:</h4>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="font-mono">200 seats × 1,000 km = 200,000 ASK</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">RPK Calculation:</h4>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="font-mono">150 passengers × 1,000 km = 150,000 RPK</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Load Factor:</h4>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="font-mono">(150,000 ÷ 200,000) × 100 = 75%</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Revenue Yield:</h4>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="font-mono">$100 × 150 = $15,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="case-study">
            <Card>
              <CardHeader>
                <CardTitle>Real-World Case Study: American Airlines (2023)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Key Performance Highlights:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Total Revenue: $53 billion (record high)</li>
                    <li>Operating Margin: 5.0%</li>
                    <li>Debt Reduction: $3.2 billion in 2023</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Strategic Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-100 p-4 rounded-md">
                      <h4 className="font-semibold">Load Factor Optimization</h4>
                      <p className="text-sm text-gray-600">Implement dynamic pricing and targeted marketing campaigns</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <h4 className="font-semibold">Revenue Enhancement</h4>
                      <p className="text-sm text-gray-600">Focus on ancillary revenue streams and high-yield routes</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <h4 className="font-semibold">Cost Management</h4>
                      <p className="text-sm text-gray-600">Invest in fuel-efficient aircraft and streamline operations</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <h4 className="font-semibold">Financial Health</h4>
                      <p className="text-sm text-gray-600">Continue debt reduction to improve financial flexibility</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cargo">
            <div className="space-y-6">
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
                    <h3 className="text-lg font-semibold">Key Cargo Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
                  </div>
                </CardContent>
              </Card>

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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}