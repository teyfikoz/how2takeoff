import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiAirchina } from "react-icons/si";
import { Users, TrendingUp, BarChart, PieChart, Target, UserCheck, DollarSign, Brain } from "lucide-react";

export default function AirlineCRM() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <SiAirchina className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Airline CRM Analytics Guide
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Comprehensive guide to Customer Relationship Management analytics in the airline industry.
          </p>
        </header>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              What is Airline CRM Analytics?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              Airline Customer Relationship Management (CRM) analytics is a data-driven approach that enables 
              airlines to analyze customer behavior, optimize marketing efforts, and enhance customer loyalty. 
              It leverages big data, machine learning, and predictive analytics to improve passenger experience 
              and increase revenue.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Key Objectives</h3>
                <ul className="space-y-2">
                  {[
                    "Customer segmentation – Identifying high-value vs. low-value customers",
                    "Personalized offers – Targeting customers with relevant promotions",
                    "Churn prediction – Identifying passengers likely to switch airlines",
                    "Optimizing CLV – Increasing the long-term revenue per customer"
                  ].map((objective) => (
                    <li key={objective} className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Areas Covered</h3>
                <ul className="space-y-2">
                  {[
                    "Customer Segmentation - Categorizing passengers based on behavior",
                    "Loyalty Programs - Offering incentives to retain travelers",
                    "Customer Journey Analysis - Tracking passenger interactions",
                    "Churn Analysis - Identifying at-risk customers",
                    "Revenue Optimization - Recommending additional services"
                  ].map((area) => (
                    <li key={area} className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-500" />
              Core CRM Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* CAC Card */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Customer Acquisition Cost (CAC)
                </h3>
                <p className="text-gray-600 mt-2">
                  Total expenses incurred to attract a new customer
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm font-medium">Formula:</p>
                  <p className="text-sm mt-1">
                    Marketing & Sales Expenses / Number of New Customers
                  </p>
                  <p className="text-sm mt-2">Example: $500,000 / 10,000 = $50 per customer</p>
                </div>
              </div>

              {/* CRC Card */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Customer Retention Cost (CRC)
                </h3>
                <p className="text-gray-600 mt-2">
                  Investment needed to maintain existing customers
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm font-medium">Formula:</p>
                  <p className="text-sm mt-1">
                    Loyalty Program Costs / Number of Retained Customers
                  </p>
                  <p className="text-sm mt-2">Example: $200,000 / 50,000 = $4 per customer</p>
                </div>
              </div>

              {/* CLV Card */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Customer Lifetime Value (CLV)
                </h3>
                <p className="text-gray-600 mt-2">
                  Total revenue generated throughout customer relationship
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm font-medium">Example Calculation:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>Average ticket: $600</li>
                    <li>Flights per year: 2</li>
                    <li>Loyalty duration: 5 years</li>
                    <li>CLV = $600 × 2 × 5 = $6,000</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Segmentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Customer Segmentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {[
                  {
                    title: "New Customers",
                    description: "First-time passengers who have never flown with the airline before",
                    strategy: "Welcome promotions, discount offers, first-flight bonuses"
                  },
                  {
                    title: "Retained Customers",
                    description: "Frequent flyers who consistently book with the airline",
                    strategy: "Loyalty programs, exclusive discounts, priority boarding"
                  }
                ].map((segment) => (
                  <div key={segment.title} className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold">{segment.title}</h3>
                    <p className="text-gray-600 mt-2">{segment.description}</p>
                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                      <p className="text-sm font-medium">Strategy:</p>
                      <p className="text-sm mt-1">{segment.strategy}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[
                  {
                    title: "Churned Customers",
                    description: "Passengers who have not flown for a long period (e.g., 12+ months)",
                    strategy: "Win-back campaigns, special promotions, personalized offers"
                  },
                  {
                    title: "High Churn-Risk Customers",
                    description: "Customers whose flight frequency has significantly declined",
                    strategy: "Personalized engagement, targeted promotions, proactive support"
                  }
                ].map((segment) => (
                  <div key={segment.title} className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold">{segment.title}</h3>
                    <p className="text-gray-600 mt-2">{segment.description}</p>
                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                      <p className="text-sm font-medium">Strategy:</p>
                      <p className="text-sm mt-1">{segment.strategy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Case Studies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Real-World Case Studies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  title: "Reducing Customer Acquisition Costs through AI",
                  problem: "High customer acquisition costs due to generic marketing campaigns",
                  solution: [
                    "AI-powered predictive analytics integration",
                    "Personalized marketing campaigns",
                    "Optimized ad spending targeting"
                  ],
                  results: [
                    "CAC reduced by 30%",
                    "Conversion rates increased by 18%",
                    "3x higher email engagement"
                  ]
                },
                {
                  title: "Boosting CLV through Personalized Loyalty",
                  problem: "Stagnant customer spending despite frequent flights",
                  solution: [
                    "Tier-based loyalty program",
                    "Personalized promotions",
                    "Dynamic pricing strategies"
                  ],
                  results: [
                    "CLV increased by 25%",
                    "40% higher spending in top tier",
                    "12% boost in ancillary revenue"
                  ]
                },
                {
                  title: "Predicting and Reducing Churn",
                  problem: "20% of frequent flyers stopped booking after 12 months",
                  solution: [
                    "ML-based churn prediction model",
                    "Automated retention offers",
                    "Engagement level tracking"
                  ],
                  results: [
                    "Churn rate decreased by 18%",
                    "30% at-risk customers rebooked",
                    "3x improvement in retention marketing ROI"
                  ]
                }
              ].map((study) => (
                <div key={study.title} className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold">{study.title}</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="font-medium">Problem:</p>
                      <p className="text-gray-600">{study.problem}</p>
                    </div>
                    <div>
                      <p className="font-medium">Solution:</p>
                      <ul className="list-disc pl-5 text-gray-600">
                        {study.solution.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium">Results:</p>
                      <ul className="mt-2 space-y-1">
                        {study.results.map((result, index) => (
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

        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-6">
          <p>Based on IATA and ICAO CRM analytics guidelines</p>
          <p className="mt-2">© Aviation Performance Analytics</p>
        </footer>
      </div>
    </div>
  );
}
