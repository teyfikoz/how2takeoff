import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  calculateCLV,
  calculateChurnProbability,
  categorizeCustomer,
  type CustomerSegmentConfig,
  type CLVConfig
} from '@/lib/crm-utils';

export default function CRMCalculator() {
  // Customer Segment Configuration
  const [segmentConfig, setSegmentConfig] = useState<CustomerSegmentConfig>({
    newCustomerPeriod: 3, // 3 months
    churnThreshold: 12, // 12 months
    atRiskFlightReduction: 30, // 30% reduction
    loyalMinFlights: 4 // 4 flights per year
  });

  // CLV Configuration
  const [clvConfig, setClvConfig] = useState<CLVConfig>({
    averageTicketPrice: 300,
    flightsPerYear: 4,
    projectionYears: 5,
    annualGrowthRate: 2, // 2%
    discountRate: 5 // 5%
  });

  // Customer Analysis Inputs
  const [customerData, setCustomerData] = useState({
    lastFlightMonths: 2,
    flightsLastYear: 6,
    previousYearFlights: 4
  });

  // Results
  const [results, setResults] = useState<{
    clv: number;
    category: string;
    details: string;
    churnProbability: number;
  } | null>(null);

  const calculateResults = () => {
    const clv = calculateCLV(clvConfig);
    const categorization = categorizeCustomer(
      customerData.lastFlightMonths,
      customerData.flightsLastYear,
      customerData.previousYearFlights,
      segmentConfig
    );
    const churnProb = calculateChurnProbability(
      customerData.lastFlightMonths,
      customerData.flightsLastYear,
      segmentConfig
    );

    setResults({
      clv,
      category: categorization.category,
      details: categorization.details,
      churnProbability: churnProb
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Segmentation Configuration */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Customer Segment Definitions</h3>
            <div className="space-y-4">
              <div>
                <Label>New Customer Period (months)</Label>
                <Input
                  type="number"
                  value={segmentConfig.newCustomerPeriod}
                  onChange={(e) => setSegmentConfig({
                    ...segmentConfig,
                    newCustomerPeriod: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label>Churn Threshold (months)</Label>
                <Input
                  type="number"
                  value={segmentConfig.churnThreshold}
                  onChange={(e) => setSegmentConfig({
                    ...segmentConfig,
                    churnThreshold: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label>At-Risk Flight Reduction (%)</Label>
                <Input
                  type="number"
                  value={segmentConfig.atRiskFlightReduction}
                  onChange={(e) => setSegmentConfig({
                    ...segmentConfig,
                    atRiskFlightReduction: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label>Loyal Customer Min. Flights/Year</Label>
                <Input
                  type="number"
                  value={segmentConfig.loyalMinFlights}
                  onChange={(e) => setSegmentConfig({
                    ...segmentConfig,
                    loyalMinFlights: Number(e.target.value)
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CLV Configuration */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Customer Lifetime Value Parameters</h3>
            <div className="space-y-4">
              <div>
                <Label>Average Ticket Price ($)</Label>
                <Input
                  type="number"
                  value={clvConfig.averageTicketPrice}
                  onChange={(e) => setClvConfig({
                    ...clvConfig,
                    averageTicketPrice: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label>Flights per Year</Label>
                <Input
                  type="number"
                  value={clvConfig.flightsPerYear}
                  onChange={(e) => setClvConfig({
                    ...clvConfig,
                    flightsPerYear: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label>Projection Years</Label>
                <Input
                  type="number"
                  value={clvConfig.projectionYears}
                  onChange={(e) => setClvConfig({
                    ...clvConfig,
                    projectionYears: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label>Annual Growth Rate (%)</Label>
                <Input
                  type="number"
                  value={clvConfig.annualGrowthRate}
                  onChange={(e) => setClvConfig({
                    ...clvConfig,
                    annualGrowthRate: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label>Discount Rate (%)</Label>
                <Input
                  type="number"
                  value={clvConfig.discountRate}
                  onChange={(e) => setClvConfig({
                    ...clvConfig,
                    discountRate: Number(e.target.value)
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Analysis Input */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Customer Analysis</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Months Since Last Flight</Label>
              <Input
                type="number"
                value={customerData.lastFlightMonths}
                onChange={(e) => setCustomerData({
                  ...customerData,
                  lastFlightMonths: Number(e.target.value)
                })}
              />
            </div>
            <div>
              <Label>Flights Last Year</Label>
              <Input
                type="number"
                value={customerData.flightsLastYear}
                onChange={(e) => setCustomerData({
                  ...customerData,
                  flightsLastYear: Number(e.target.value)
                })}
              />
            </div>
            <div>
              <Label>Flights Previous Year</Label>
              <Input
                type="number"
                value={customerData.previousYearFlights}
                onChange={(e) => setCustomerData({
                  ...customerData,
                  previousYearFlights: Number(e.target.value)
                })}
              />
            </div>
          </div>
          <Button onClick={calculateResults} className="mt-4">
            Calculate
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold">Customer Lifetime Value</h4>
                <p className="text-2xl font-bold">${results.clv.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold">Customer Category</h4>
                <p className="text-2xl font-bold capitalize">{results.category}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold">Category Details</h4>
                <p className="text-sm mt-1">{results.details}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold">Churn Probability</h4>
                <p className="text-2xl font-bold">
                  {(results.churnProbability * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
