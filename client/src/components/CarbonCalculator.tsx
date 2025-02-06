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
    fuelEfficiency: AIRCRAFT_EFFICIENCY['Boeing 737-800'],
    offsetPricePerTon: 25 // Default carbon credit price per ton
  });

  const emissions = params.distance ? calculateCarbonEmissions(params) : 0;
  const offsetCost = params.distance ? calculateOffsetCredits(params) : 0;
  const environmentalScore = params.distance ? calculateEnvironmentalScore(params) : 0;

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
              value={String(params.fuelEfficiency)}
              onValueChange={(value) => setParams({
                ...params,
                fuelEfficiency: Number(value)
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select aircraft" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AIRCRAFT_EFFICIENCY).map(([aircraft, efficiency]) => (
                  <SelectItem key={aircraft} value={String(efficiency)}>
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
            <Label>Carbon Emissions per Passenger</Label>
            <p className="text-2xl font-bold">
              {emissions.toFixed(2)} kg CO₂
            </p>
          </div>

          <div>
            <Label>Carbon Offset Cost</Label>
            <p className="text-2xl font-bold text-green-600">
              ${offsetCost.toFixed(2)}
            </p>
          </div>

          <div>
            <Label>Environmental Impact Score</Label>
            <div className="space-y-2">
              <Progress value={environmentalScore} className="w-full" />
              <p className="text-sm text-gray-500">
                Score: {environmentalScore.toFixed(0)}/100
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarbonCalculator;