import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiAirchina } from "react-icons/si";
import { Users, TrendingUp, Calculator, PieChart, Target, UserCheck, DollarSign, Brain, Sparkles } from "lucide-react";
import CRMCalculator from "@/components/CRMCalculator";

export default function AirlineCRM() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <SiAirchina className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Airline CRM Analytics - Simple Guide ✈️
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            A beginner-friendly guide explaining how airlines manage customer relationships.
          </p>
        </header>

        {/* What is CRM? */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              What is CRM? 🤔
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              CRM (Customer Relationship Management) is a system airlines use to 
              better understand their passengers and provide them with better service.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">What Does It Do? 🎯</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Helps find new passengers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Keeps existing passengers happy
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Prevents passengers from switching to other airlines
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Helps earn more revenue from each passenger
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Example 💡</h3>
                <p>
                  An airline notices that a business traveler often makes last-minute 
                  flight reservations. They offer special last-minute deals, making 
                  both the passenger happy and increasing ticket sales.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Calculations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-500" />
              Important Calculations 🧮
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Customer Acquisition Cost */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  New Customer Cost
                </h3>
                <p className="text-gray-600 mt-2">
                  Money spent to attract one new passenger
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm font-medium">Formula:</p>
                  <div className="mt-2 p-2 bg-white rounded border text-sm">
                    Customer Acquisition Cost = 
                    <div className="border-t mt-1 pt-1">
                      Marketing Costs ÷ Number of New Customers
                    </div>
                  </div>
                  <p className="text-sm mt-2 text-gray-600">
                    Example: $500,000 ÷ 10,000 new passengers = $50/passenger
                  </p>
                </div>
              </div>

              {/* Customer Retention Cost */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Customer Retention Cost
                </h3>
                <p className="text-gray-600 mt-2">
                  Money spent to keep existing passengers happy
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm font-medium">Formula:</p>
                  <div className="mt-2 p-2 bg-white rounded border text-sm">
                    Customer Retention Cost =
                    <div className="border-t mt-1 pt-1">
                      Loyalty Program Costs ÷ Number of Existing Customers
                    </div>
                  </div>
                  <p className="text-sm mt-2 text-gray-600">
                    Example: $200,000 ÷ 50,000 passengers = $4/passenger
                  </p>
                </div>
              </div>

              {/* Customer Lifetime Value */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Customer Lifetime Value
                </h3>
                <p className="text-gray-600 mt-2">
                  Total revenue a passenger brings over time
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm font-medium">Calculation Example:</p>
                  <div className="mt-2 p-2 bg-white rounded border text-sm">
                    <ul className="space-y-1">
                      <li>• Average ticket: $600</li>
                      <li>• Flights per year: 2</li>
                      <li>• Loyalty duration: 5 years</li>
                      <li className="border-t mt-1 pt-1 font-medium">
                        Total = $600 × 2 × 5 = $6,000
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Customer Types 👥
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "New Customers 🆕",
                  description: "First-time passengers",
                  strategy: "Welcome discounts, special first-flight gifts"
                },
                {
                  title: "Loyal Customers ⭐",
                  description: "Passengers who fly with us regularly",
                  strategy: "Miles points, priority check-in, free baggage"
                },
                {
                  title: "Lost Customers 😢",
                  description: "Haven't flown in 12+ months",
                  strategy: "Special return campaigns, personalized offers"
                },
                {
                  title: "At-Risk Customers ⚠️",
                  description: "Flying less frequently than before",
                  strategy: "Early intervention, special offers, surveys"
                }
              ].map((type) => (
                <div key={type.title} className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold">{type.title}</h3>
                  <p className="text-gray-600 mt-2">{type.description}</p>
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <p className="text-sm font-medium">How We Handle Them:</p>
                    <p className="text-sm mt-1">{type.strategy}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Stories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Success Stories 🌟
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  title: "Customer Acquisition with AI",
                  problem: "Generic ads weren't effective enough",
                  solution: [
                    "Used AI to analyze customer behavior",
                    "Created personalized advertisements",
                    "Used marketing budget more intelligently"
                  ],
                  results: [
                    "Customer acquisition cost dropped by 30%",
                    "Ad click rate increased by 18%",
                    "Email open rate tripled"
                  ]
                },
                {
                  title: "Loyalty Program Success",
                  problem: "Passengers flew often but spent little",
                  solution: [
                    "Launched tiered loyalty program",
                    "Offered personalized campaigns",
                    "Implemented dynamic pricing"
                  ],
                  results: [
                    "Customer value increased by 25%",
                    "Top-tier members spent 40% more",
                    "Additional service revenue up by 12%"
                  ]
                }
              ].map((story) => (
                <div key={story.title} className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold">{story.title}</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="font-medium">Problem:</p>
                      <p className="text-gray-600">{story.problem}</p>
                    </div>
                    <div>
                      <p className="font-medium">Solution:</p>
                      <ul className="list-disc pl-5 text-gray-600">
                        {story.solution.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium">Results:</p>
                      <ul className="mt-2 space-y-1">
                        {story.results.map((result, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-green-500">🚀</span>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add CRM Calculator Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-500" />
              Interactive CRM Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Customize your airline's CRM parameters and analyze customer data with this interactive calculator.
              Adjust the thresholds and parameters to match your airline's specific needs.
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