import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiAirchina } from "react-icons/si";
import { Users, TrendingUp, Calculator, Target, UserCheck, DollarSign, Brain, Sparkles, History } from "lucide-react";
import CRMCalculator from "@/components/CRMCalculator";

export default function AirlineCRM() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <SiAirchina className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Airline CRM Analytics Dashboard
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Comprehensive customer relationship management analytics and insights based on IATA standards
          </p>
        </header>

        {/* Key CRM Metrics Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-500" />
              Key CRM Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Customer Acquisition
                </h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium">CAC (Customer Acquisition Cost)</p>
                    <div className="bg-gray-50 p-2 rounded mt-1">
                      <p className="text-sm font-mono">Marketing Costs ÷ New Customers</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">CRC (Customer Retention Cost)</p>
                    <div className="bg-gray-50 p-2 rounded mt-1">
                      <p className="text-sm font-mono">Loyalty Program Costs ÷ Existing Customers</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Churn & Loyalty
                </h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium">Churn Rate (24-month basis)</p>
                    <div className="bg-gray-50 p-2 rounded mt-1">
                      <p className="text-sm font-mono">Lost Customers ÷ Total Customers</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Customer Lifetime Value (CLV)</p>
                    <div className="bg-gray-50 p-2 rounded mt-1">
                      <p className="text-sm font-mono">Avg Revenue × Years × Retention Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Satisfaction Metrics
                </h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium">NPS (Net Promoter Score)</p>
                    <div className="bg-gray-50 p-2 rounded mt-1">
                      <p className="text-sm font-mono">% Promoters - % Detractors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Segmentation Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Customer Segmentation (24-Month Model)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-gray-600">
                Based on IATA standards and airline loyalty program benchmarks, customers are segmented using a 24-month activity window:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="font-semibold text-lg mb-4">Active Segments</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold">New Customers</h4>
                      <p className="text-sm text-gray-600 mt-1">First-time flyers who recently booked</p>
                      <p className="text-sm text-green-600 mt-1">Strategy: Welcome offers and onboarding</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Retained Customers</h4>
                      <p className="text-sm text-gray-600 mt-1">Multiple bookings within 24 months</p>
                      <p className="text-sm text-blue-600 mt-1">Strategy: Loyalty rewards and upgrades</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="font-semibold text-lg mb-4">At-Risk & Churned</h3>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Churn Risk</h4>
                      <p className="text-sm text-gray-600 mt-1">Declining booking frequency</p>
                      <p className="text-sm text-yellow-600 mt-1">Strategy: Early intervention and special offers</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Churned Customers</h4>
                      <p className="text-sm text-gray-600 mt-1">No bookings for over 24 months</p>
                      <p className="text-sm text-red-600 mt-1">Strategy: Reactivation campaigns</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-6">
                <h3 className="font-semibold text-lg mb-4">Why 24 Months?</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold">Industry Standards</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li>• IATA recommended timeframe for customer activity tracking</li>
                      <li>• Matches most frequent flyer program expiry policies</li>
                      <li>• Captures both frequent and seasonal travelers</li>
                      <li>• Allows for business travel patterns</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Advantages</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li>• Balances short and long-term travel patterns</li>
                      <li>• Aligns with industry loyalty programs</li>
                      <li>• Optimal for retention strategies</li>
                      <li>• Supports effective reactivation campaigns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Calculator Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-500" />
              Interactive CRM Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Calculate key CRM metrics and analyze customer data with this interactive calculator.
              Input your airline's data to get instant insights and analytics.
            </p>
            <CRMCalculator />
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