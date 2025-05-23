import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  calculateCarbonEmissions,
  calculateOffsetCredits,
  calculateEnvironmentalScore,
  getFlightPhaseInfo,
  AIRCRAFT_EFFICIENCY,
  type CarbonEmissionParams,
  type CarbonOffsetParams
} from '@/lib/carbon-utils';
// Mock veri için gerekli import
import { mockAircraftData } from '@/data/mockAircraftData';

const CarbonCalculator: React.FC = () => {
  const [params, setParams] = useState<CarbonOffsetParams>({
    distance: 0,
    unit: 'kilometers',
    passengers: 1,
    aircraftType: 'Boeing 737-800',
    offsetPricePerTon: 25, // Default carbon credit price per ton
    altitude: 35000 // Default cruise altitude
  });

  const emissions = params.distance ? calculateCarbonEmissions(params) : { co2: 0, nox: 0, h2o: 0 };
  const offsetCost = params.distance ? calculateOffsetCredits(params) : 0;
  const environmentalScore = params.distance ? calculateEnvironmentalScore(params) : 0;
  const aircraftData = AIRCRAFT_EFFICIENCY[params.aircraftType];
  const flightPhases = getFlightPhaseInfo();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Carbon Emission Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Label>Cruise Altitude (feet)</Label>
              <Input
                type="number"
                value={params.altitude}
                onChange={(e) => setParams({
                  ...params,
                  altitude: Math.max(0, Math.min(45000, Number(e.target.value)))
                })}
              />
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

          <Separator className="my-4" />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Emissions Analysis</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>CO₂ Emissions</Label>
                  <p className="text-2xl font-bold">
                    {emissions.co2.toFixed(2)} kg
                  </p>
                  <p className="text-sm text-gray-500">
                    Per passenger: {(emissions.co2 / params.passengers).toFixed(2)} kg
                  </p>
                </div>
                <div>
                  <Label>NOx Emissions</Label>
                  <p className="text-2xl font-bold">
                    {emissions.nox.toFixed(2)} kg
                  </p>
                  <p className="text-sm text-gray-500">
                    Altitude adjusted impact
                  </p>
                </div>
                <div>
                  <Label>H₂O Vapor</Label>
                  <p className="text-2xl font-bold">
                    {emissions.h2o.toFixed(2)} kg
                  </p>
                  <p className="text-sm text-gray-500">
                    Contributes to contrails
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Carbon Offset</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Offset Cost</Label>
                  <p className="text-2xl font-bold text-green-600">
                    ${offsetCost.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Per passenger: ${(offsetCost / params.passengers).toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label>Environmental Impact Score</Label>
                  <Progress value={environmentalScore} className="w-full mt-2" />
                  <p className="text-sm text-gray-500 mt-1">
                    Score: {environmentalScore}/100
                    {environmentalScore > 75 ? " (Excellent)" :
                     environmentalScore > 50 ? " (Good)" :
                     environmentalScore > 25 ? " (Fair)" : " (Poor)"}
                  </p>
                </div>
              </div>
            </div>

            {aircraftData && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Aircraft Efficiency Data</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Fuel Consumption</Label>
                    <p>{aircraftData.fuelBurnPer100kmSeat} L/100km/seat</p>
                  </div>
                  <div>
                    <Label>CO₂ Emission Factor</Label>
                    <p>{aircraftData.co2EmissionFactor} kg/L</p>
                  </div>
                  <div>
                    <Label>Operating Cost</Label>
                    <p>${aircraftData.operatingCostPerHour}/hour</p>
                  </div>
                  <div>
                    <Label>Cruise Speed</Label>
                    <p>{aircraftData.cruiseSpeed} knots</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Flight Phase Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(flightPhases).map(([phase, info]) => (
                  <div key={phase} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">{info.name}</h4>
                    <p className="text-sm text-gray-600">{info.description}</p>
                    <p className="text-sm text-gray-500 mt-1">{info.fuelImpact}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Environmental Impact Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• CO₂ emissions directly contribute to global warming through the greenhouse effect.</p>
                <p>• NOx emissions have a greater impact at high altitudes and contribute to ozone formation.</p>
                <p>• Water vapor emissions form contrails which can affect cloud formation and climate.</p>
                <p>• Carbon offsetting helps fund projects that reduce or capture equivalent CO₂ elsewhere.</p>
                <p>• Modern aircraft designs and operational practices can reduce emissions by 15-25%.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonCalculator;