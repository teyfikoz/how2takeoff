import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  calculateCarbonEmissions,
  calculateOffsetCredits,
  calculateEnvironmentalScore,
  AIRCRAFT_EFFICIENCY,
  type CarbonEmissionParams,
  type CarbonOffsetParams
} from '@/lib/carbon-utils';

const CarbonCalculator: React.FC = () => {
  const [params, setParams] = useState<CarbonOffsetParams>({
    distance: 0,
    unit: 'kilometers',
    passengers: 1,
    aircraftType: 'Boeing 737-800',
    offsetPricePerTon: 25 // Default carbon credit price per ton
  });

  const emissions = params.distance ? calculateCarbonEmissions(params) : 0;
  const offsetCost = params.distance ? calculateOffsetCredits(params) : 0;
  const environmentalScore = params.distance ? calculateEnvironmentalScore(params) : 0;
  const aircraftData = AIRCRAFT_EFFICIENCY[params.aircraftType];

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Distance</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={params.distance}
                onChange={(e) => setParams({
                  ...params,
                  distance: Number(e.target.value)
                })}
              />
              <Select
                value={params.unit}
                onValueChange={(value: 'miles' | 'kilometers') => setParams({
                  ...params,
                  unit: value
                })}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="miles">Miles</SelectItem>
                  <SelectItem value="kilometers">Kilometers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Number of Passengers</Label>
            <Input
              type="number"
              value={params.passengers}
              onChange={(e) => setParams({
                ...params,
                passengers: Math.max(1, Number(e.target.value))
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Aircraft Type</Label>
            <Select
              value={params.aircraftType}
              onValueChange={(value) => setParams({
                ...params,
                aircraftType: value
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select aircraft" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(AIRCRAFT_EFFICIENCY).map((aircraft) => (
                  <SelectItem key={aircraft} value={aircraft}>
                    {aircraft}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Carbon Offset Price (USD/ton)</Label>
            <Input
              type="number"
              value={params.offsetPricePerTon}
              onChange={(e) => setParams({
                ...params,
                offsetPricePerTon: Number(e.target.value)
              })}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div>
            <Label>Carbon Emissions per Trip</Label>
            <p className="text-2xl font-bold">
              {emissions.toFixed(2)} kg CO₂
            </p>
            <p className="text-sm text-gray-500">
              Per passenger: {(emissions / params.passengers).toFixed(2)} kg CO₂
            </p>
          </div>

          <div>
            <Label>Carbon Offset Cost</Label>
            <p className="text-2xl font-bold text-green-600">
              ${offsetCost.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Per passenger: ${(offsetCost / params.passengers).toFixed(2)}
            </p>
          </div>

          {aircraftData && (
            <div>
              <Label>Aircraft Efficiency Data</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <p>Fuel Burn per 100km/seat: {aircraftData.fuelBurnPer100kmSeat}L</p>
                <p>CO₂ Emission Factor: {aircraftData.co2EmissionFactor} kg/L</p>
                <p>Operating Cost/Hour: ${aircraftData.operatingCostPerHour}</p>
                <p>Turnaround Time: {aircraftData.turnaroundTime} min</p>
              </div>
            </div>
          )}

          <div>
            <Label>Environmental Impact Score</Label>
            <div className="space-y-2">
              <Progress value={environmentalScore} className="w-full" />
              <p className="text-sm text-gray-500">
                Score: {environmentalScore.toFixed(0)}/100
                {environmentalScore > 75 ? " (Excellent)" :
                 environmentalScore > 50 ? " (Good)" :
                 environmentalScore > 25 ? " (Fair)" : " (Poor)"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarbonCalculator;