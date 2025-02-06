import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiAirchina } from "react-icons/si";
import { Plane, GitBranch, Ticket, DollarSign, Network, Globe, TrendingUp } from "lucide-react";
import RouteOptimization from "@/components/RouteOptimization";
import { Calculator } from "lucide-react";


export default function RevenueManagement() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <SiAirchina className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Revenue Management & Route Optimization
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Comprehensive guide to airline revenue management techniques, route optimization strategies, and network planning.
          </p>
        </header>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              Introduction to Revenue Management
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              Revenue management in airlines is the science of selling the right seat, to the right passenger,
              at the right price, at the right time. Airlines apply advanced forecasting, optimization models,
              and dynamic pricing strategies to maximize revenue.
            </p>
          </CardContent>
        </Card>

        {/* Key Components */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-500" />
              Key Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dynamic Pricing</h3>
                <p className="text-gray-600">
                  Airlines continuously adjust fares based on demand, remaining seat availability,
                  competition, and booking lead time.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">
                    Example: A passenger booking three months in advance may find a ticket for $200,
                    whereas booking a week before departure may cost $400 due to increased demand.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Overbooking Strategy</h3>
                <p className="text-gray-600">
                  Airlines overbook flights to compensate for passenger no-shows, ensuring maximum seat utilization.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">
                    Example: For a 100-seat flight with 5% historical no-show rate,
                    the airline may sell 105 tickets to optimize capacity.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Models */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-blue-500" />
              Airline Network Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Hub and Spoke Model</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    High seat occupancy
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Efficient fleet utilization
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    Increased connection times
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Point to Point Model</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Shorter travel times
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Lower operating costs
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    Less flexibility in disruptions
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Route Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-blue-500" />
              Market Route Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  type: "One-Way (OW)",
                  description: "City A → City B",
                  example: "London to Paris"
                },
                {
                  type: "Round Trip (RT)",
                  description: "City A → City B → City A",
                  example: "London-Paris-London"
                },
                {
                  type: "Open Jaw (OJ)",
                  description: "City A → City B, then City C → City A",
                  example: "London-Paris, Rome-London"
                },
                {
                  type: "Double Open Jaw (DOJ)",
                  description: "City A → City B, then City C → City D",
                  example: "London-Paris, Rome-Madrid"
                },
                {
                  type: "Circle Trip (CT)",
                  description: "City A → City B → City C → City A",
                  example: "London-Paris-Rome-London"
                }
              ].map((route) => (
                <div key={route.type} className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold">{route.type}</h3>
                  <p className="text-sm text-gray-600 mt-2">{route.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Example: {route.example}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ticketing Concepts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-blue-500" />
              Ticketing Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ticket vs. Coupon</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Ticket:</span> A document that includes all flight segments for a journey.
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Coupon:</span> Each individual flight segment within a ticket.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">
                    Example: A traveler flying City A → City C via City B has one ticket with two coupons.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Direct vs. Connecting Flights</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Direct flights are typically more expensive due to higher demand and convenience.
                  </p>
                  <p className="text-gray-600">
                    Connecting flights offer more competitive pricing due to:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Lower demand</li>
                    <li>Hub-based optimization</li>
                    <li>Route competition</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Real World Case Study */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Real-World Revenue Management Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Full-Service Carrier Example: London (LHR) → New York (JFK)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Passenger Types:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Business Travelers - Last-minute bookings, premium fares</li>
                      <li>Leisure Travelers - Early bookings, price-sensitive</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Results:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Business fares: $1,200 per ticket</li>
                      <li>Leisure fares: $450 per ticket</li>
                      <li>18% revenue increase vs fixed pricing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Low-Cost Carrier Example: Los Angeles (LAX) → Las Vegas (LAS)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Revenue Strategy:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Base fare: $39</li>
                      <li>Baggage fees: $40 per bag</li>
                      <li>Priority services: $15 per person</li>
                      <li>In-flight services: $10 average</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Revenue Breakdown:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Base revenue: $39</li>
                      <li>Ancillary revenue: $65</li>
                      <li>Total per passenger: $104</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Optimization Case Studies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-500" />
              Route Optimization Case Studies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Global Hub Carrier: Network Optimization</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Route Adjustments:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>JFK-HND: Increased to 7 weekly flights</li>
                      <li>JFK-KIX: Reduced to 2 weekly flights</li>
                      <li>Aircraft optimization for routes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Performance Metrics:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Seat occupancy: 78% → 86%</li>
                      <li>RASK growth: +12%</li>
                      <li>Fuel efficiency: +5%</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">New Route Development: Dubai (DXB) → Mexico City (MEX)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Market Analysis:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>High indirect traffic via Madrid</li>
                      <li>Premium market opportunity</li>
                      <li>4+ hour time savings potential</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">First 6 Month Results:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>85% load factor achieved</li>
                      <li>40% market share captured</li>
                      <li>Enhanced Latin America presence</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* O&D and Transit Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-blue-500" />
              O&D and Transit Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Case Study: Paris (CDG) → Istanbul (IST) → Bangkok (BKK)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Revenue Management Strategy:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Lower CDG-IST fares for transit</li>
                      <li>Premium services for through passengers</li>
                      <li>Optimized connection times</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Results:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Transit share up by 25%</li>
                      <li>Overall revenue increase: 18%</li>
                      <li>Improved network efficiency</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Transit Passenger Types</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      type: "Domestic-to-Domestic",
                      example: "ORD → DFW → MIA",
                      description: "Internal connections within country"
                    },
                    {
                      type: "Domestic-to-International",
                      example: "LAX → JFK → LHR",
                      description: "Outbound international connections"
                    },
                    {
                      type: "International-to-Domestic",
                      example: "FRA → ATL → MCO",
                      description: "Inbound international connections"
                    },
                    {
                      type: "International-to-International",
                      example: "NRT → IST → EZE",
                      description: "International transit connections"
                    }
                  ].map((transit) => (
                    <div key={transit.type} className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold">{transit.type}</h4>
                      <p className="text-sm text-gray-600 mt-2">{transit.example}</p>
                      <p className="text-xs text-gray-500 mt-1">{transit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Takeaways */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Key Revenue Management Takeaways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Dynamic pricing ensures optimal revenue capture across customer segments
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Low-cost carriers generate significant revenue through ancillary services
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Route optimization requires continuous monitoring and adjustment
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  O&D analysis crucial for network planning and pricing strategies
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Transit passengers key to hub airport success and profitability
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Added Route Optimization Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-500" />
              Route Optimization & Emissions Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RouteOptimization />
          </CardContent>
        </Card>

        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-6">
          <p>Based on IATA and ICAO standards</p>
          <p className="mt-2">© Aviation Performance Analytics</p>
        </footer>
      </div>
    </div>
  );
}