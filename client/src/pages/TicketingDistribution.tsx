import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiAirchina } from "react-icons/si";
import { Plane, GitBranch, Ticket, DollarSign, Network, Building2, Globe } from "lucide-react";

export default function TicketingDistribution() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <SiAirchina className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Airline Ticketing & Distribution Strategies
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Comprehensive overview of airline ticketing systems, distribution channels, and sales strategies.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {/* Sales Channels Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-500" />
                Sales Channels Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Direct Sales",
                    description: "Airline websites, mobile apps, call centers",
                    pros: "Lower costs, direct customer management",
                    cons: "Requires digital infrastructure investment"
                  },
                  {
                    title: "GDS",
                    description: "Global Distribution Systems for travel agencies",
                    pros: "Worldwide distribution reach",
                    cons: "GDS usage fees consideration"
                  },
                  {
                    title: "OTA",
                    description: "Online Travel Agencies",
                    pros: "Wide user base, online accessibility",
                    cons: "High price competition"
                  },
                  {
                    title: "TMC",
                    description: "Travel Management Companies",
                    pros: "Corporate travel management",
                    cons: "Limited flexibility due to corporate agreements"
                  }
                ].map((channel) => (
                  <div key={channel.title} className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-2">{channel.title}</h3>
                    <p className="text-sm text-gray-600">{channel.description}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-green-600">✓ {channel.pros}</p>
                      <p className="text-xs text-red-600">⚠ {channel.cons}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* GDS Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Global Distribution Systems (GDS)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-gray-600">
                  GDS platforms are central reservation systems that enable travel agencies and corporate clients
                  to access airline inventory, pricing, and booking capabilities.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Working Mechanism</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">1.</span>
                        Airlines upload flight inventory to GDS
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">2.</span>
                        GDS manages ticketing process
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">3.</span>
                        Records all transactions
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Key Benefits</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        Global market reach
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        Corporate booking management
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">⚠</span>
                        Integration costs consideration
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Corporate Sales & TMC */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Corporate Sales & Travel Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Corporate Sales</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Special pricing and advantages for corporate customers with direct airline agreements.
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Custom corporate rates</li>
                      <li>• Volume-based discounts</li>
                      <li>• Travel policy compliance</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">TMC Services</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Professional firms managing corporate travel expenses and bookings.
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Expense management</li>
                      <li>• Policy enforcement</li>
                      <li>• Consolidated booking process</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* OTA and Metasearch */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                OTA & Metasearch Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Online Travel Agencies</h3>
                  <p className="text-gray-600 mb-4">
                    Internet-based platforms offering ticket sales and price comparisons across airlines.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Popular OTAs:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Expedia</li>
                      <li>• Skyscanner</li>
                      <li>• Kayak</li>
                    </ul>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Metasearch Engines</h3>
                  <p className="text-gray-600 mb-4">
                    Price comparison platforms directing users to airline or OTA websites.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Popular Platforms:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Google Flights</li>
                      <li>• Momondo</li>
                      <li>• KAYAK</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-6">
          <p>Based on IATA and ICAO distribution guidelines</p>
          <p className="mt-2">© Aviation Performance Analytics</p>
        </footer>
      </div>
    </div>
  );
}
