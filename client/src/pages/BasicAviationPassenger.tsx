import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BasicAviationPassenger() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">
            Basic Aviation Passenger Concepts
          </h1>
          <p className="mt-2 text-gray-600">
            Understanding fundamental passenger aviation concepts, metrics, and industry practices
          </p>
        </header>

        <Tabs defaultValue="concepts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="concepts">Key Concepts</TabsTrigger>
            <TabsTrigger value="metrics">Aviation Metrics</TabsTrigger>
            <TabsTrigger value="calculations">Example Calculations</TabsTrigger>
            <TabsTrigger value="case-study">Case Study</TabsTrigger>
          </TabsList>

          <TabsContent value="concepts">
            <Card>
              <CardHeader>
                <CardTitle>Passenger Aviation Fundamentals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Passenger No-Shows and Overbooking</h3>
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
                  <h3 className="text-lg font-semibold">Revenue and Cost Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-100 p-3 rounded-md">
                      <p className="font-semibold">RASK (Revenue per ASK)</p>
                      <p className="font-mono text-sm">Total Revenue ÷ ASK</p>
                      <p className="text-sm mt-1">Measures revenue generation efficiency</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <p className="font-semibold">CASK (Cost per ASK)</p>
                      <p className="font-mono text-sm">Total Cost ÷ ASK</p>
                      <p className="text-sm mt-1">Measures operational cost efficiency</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Profitability Indicators</h3>
                  <div className="bg-gray-100 p-4 rounded-md mt-2">
                    <p className="font-semibold">Operating Margin</p>
                    <p className="text-sm">Operating Income ÷ Total Revenue × 100%</p>
                    <p className="text-sm mt-1">Indicates airline's operational efficiency</p>
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
                      <h4 className="font-semibold mb-2">Revenue Analysis:</h4>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="font-mono">Revenue: $100 × 150 = $15,000</p>
                        <p className="font-mono">RASK: $15,000 ÷ 200,000 = $0.075 per ASK</p>
                        <p className="font-mono">CASK: $15,000 ÷ 200,000 = $0.075 per ASK</p>
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
                <CardTitle>Industry Case Study: Global Hub Carrier (2023)</CardTitle>
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
                  <h3 className="text-lg font-semibold">Strategic Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-100 p-4 rounded-md">
                      <h4 className="font-semibold">Load Factor Optimization</h4>
                      <p className="text-sm text-gray-600">
                        Implementation of dynamic pricing and targeted marketing campaigns to increase passenger numbers
                      </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <h4 className="font-semibold">Revenue Enhancement</h4>
                      <p className="text-sm text-gray-600">
                        Focus on ancillary revenue streams and optimization of high-yield routes
                      </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <h4 className="font-semibold">Cost Management</h4>
                      <p className="text-sm text-gray-600">
                        Investment in fuel-efficient aircraft and streamlined operations
                      </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <h4 className="font-semibold">Financial Strategy</h4>
                      <p className="text-sm text-gray-600">
                        Continued focus on debt reduction to improve financial flexibility
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Future Outlook</h3>
                  <div className="bg-gray-100 p-4 rounded-md mt-2">
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Continued focus on operational efficiency</li>
                      <li>Investment in modern fleet for better fuel efficiency</li>
                      <li>Enhancement of customer experience</li>
                      <li>Expansion of route network</li>
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