import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiAirchina } from "react-icons/si";
import { Plane, GitBranch, Ticket, DollarSign, Network } from "lucide-react";

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

        <div className="grid grid-cols-1 gap-6">
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
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-6">
          <p>Data based on IATA and ICAO guidelines</p>
          <p className="mt-2">© Aviation Performance Analytics</p>
        </footer>
      </div>
    </div>
  );
}