import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  calculateFuelConsumption,
  calculateCO2Emissions,
  calculateCarbonFootprint,
  analyzeRoute,
  type RouteDecision
} from '@/lib/aviation-utils';

export default function RouteOptimization() {
  const [distance, setDistance] = useState<number>(0);
  const [aircraftType, setAircraftType] = useState<string>('narrow-body');
  const [passengers, setPassengers] = useState<number>(0);
  const [demand, setDemand] = useState<number>(0);
  const [competition, setCompetition] = useState<number>(0);
  const [results, setResults] = useState<{
    fuel: number;
    emissions: number;
    decision: RouteDecision;
  } | null>(null);

  const calculateResults = () => {
    const fuel = calculateFuelConsumption(distance, aircraftType, passengers);
    const emissions = calculateCO2Emissions(fuel);
    const decision = analyzeRoute(distance, demand, competition);

    setResults({
      fuel,
      emissions,
      decision
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Route Optimization Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Distance (km)</label>
                <Input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  placeholder="Enter distance"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Aircraft Type</label>
                <Select value={aircraftType} onValueChange={setAircraftType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aircraft type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="narrow-body">Narrow Body</SelectItem>
                    <SelectItem value="wide-body">Wide Body</SelectItem>
                    <SelectItem value="regional">Regional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Passenger Count</label>
                <Input
                  type="number"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  placeholder="Enter passenger count"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Annual Demand</label>
                <Input
                  type="number"
                  value={demand}
                  onChange={(e) => setDemand(Number(e.target.value))}
                  placeholder="Enter annual demand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Competitors</label>
                <Input
                  type="number"
                  value={competition}
                  onChange={(e) => setCompetition(Number(e.target.value))}
                  placeholder="Enter number of competitors"
                />
              </div>

              <Button onClick={calculateResults} className="w-full mt-6">
                Calculate
              </Button>
            </div>
          </div>

          {results && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold">Fuel Consumption</h4>
                  <p className="text-2xl font-bold">{results.fuel.toFixed(2)} kg</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold">CO2 Emissions</h4>
                  <p className="text-2xl font-bold">{results.emissions.toFixed(2)} kg</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold">Route Score</h4>
                  <p className="text-2xl font-bold">{results.decision.score}/100</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold">Recommendation</h4>
                <p className="mt-2">{results.decision.recommendation}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
