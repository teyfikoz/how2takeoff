import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiAirchina } from "react-icons/si";
import { Plane, GitBranch, TrendingUp, DollarSign, Box } from "lucide-react";

export default function CarrierTypes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <SiAirchina className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Carrier Types in the Airline Industry
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Exploring different airline business models, operational strategies, and market focus.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-blue-500" />
                Overview of Airline Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>Airlines operate under different business models, each designed to target specific markets, optimize operations, and maximize profitability.</p>
              </div>
              <div className="grid md:grid-cols-4 gap-4 mt-6">
                {[
                  { name: "Low-Cost Carriers (LCC)", icon: TrendingUp },
                  { name: "Full-Service Carriers (FSC)", icon: Plane },
                  { name: "Regional Carriers (RAC)", icon: GitBranch },
                  { name: "Ultra-Low-Cost Carriers (ULCC)", icon: DollarSign },
                  { name: "Hybrid Airlines", icon: Box },
                  { name: "Charter Airlines", icon: Plane },
                  { name: "Cargo Airlines", icon: Box }
                ].map((carrier) => (
                  <div key={carrier.name} className="bg-white p-4 rounded-lg border flex items-center gap-2">
                    <carrier.icon className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">{carrier.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low-Cost Carriers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Low-Cost Carriers (LCC)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Low-Cost Carriers focus on minimizing operating costs to offer lower ticket prices.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Key Characteristics</h3>
                    <ul className="space-y-2">
                      {[
                        "Point-to-Point Network",
                        "Single Aircraft Type",
                        "No-Frills Service",
                        "High Aircraft Utilization",
                        "Secondary Airports",
                        "Dynamic Pricing"
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Example Pricing Model</h3>
                    <p className="text-sm">Base ticket: $50</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>+ Checked baggage</li>
                      <li>+ Priority boarding</li>
                      <li>+ Seat selection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full-Service Carriers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-blue-500" />
                Full-Service Carriers (FSC)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Full-Service Carriers offer premium services, multiple fare classes, and a hub-and-spoke network.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Key Features</h3>
                    <ul className="space-y-2">
                      {[
                        "Hub-and-Spoke Network",
                        "Multiple Cabin Classes",
                        "Frequent Flyer Programs",
                        "Global Alliances",
                        "Interline Agreements",
                        "Premium Services"
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Included Services</h3>
                    <ul className="text-sm space-y-1">
                      <li>✓ Free checked baggage</li>
                      <li>✓ Meals and drinks</li>
                      <li>✓ Frequent flyer miles</li>
                      <li>✓ Lounge access (premium classes)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regional and ULCC */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-blue-500" />
                  Regional Carriers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Regional Airlines operate short-haul and medium-haul flights, feeding passengers into major airline hubs.
                  </p>
                  <ul className="space-y-2">
                    <li>✓ Short-Haul Flights (under 1,500 km)</li>
                    <li>✓ Smaller Aircraft (ATR-72, Dash 8)</li>
                    <li>✓ Codeshare Agreements</li>
                    <li>✓ Essential Air Services</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  Ultra-Low-Cost Carriers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    ULCCs take the low-cost model further by stripping services to the bare minimum.
                  </p>
                  <ul className="space-y-2">
                    <li>✓ Unbundled Fares</li>
                    <li>✓ High-Density Seating</li>
                    <li>✓ Extremely Low Base Fares ($10-$20)</li>
                    <li>✓ 40%+ Revenue from Extras</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-6">
          <p>Based on IATA and ICAO carrier classification guidelines</p>
          <p className="mt-2">© Aviation Performance Analytics</p>
        </footer>
      </div>
    </div>
  );
}
