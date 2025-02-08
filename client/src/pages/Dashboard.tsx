import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import FilterForm from '@/components/aircraft/FilterForm';
import ComparisonCharts from '@/components/aircraft/ComparisonCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Aircraft } from '@shared/schema';
import { ArrowRight, Wind } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FilterCriteria {
  passengers: number;
  cargo: number;
  range: number;
  alternateRange: number;
  windSpeed: number;
  windDirection: number;
}

interface WindScenario {
  label: string;
  speed: number;
  effectiveRange: number;
}

export default function Dashboard() {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria | null>(null);

  const { data: aircraftData } = useQuery({
    queryKey: ['/api/aircraft'],
  });

  const generateWindScenarios = (baseSpeed: number, aircraft: Aircraft) => {
    const scenarios: WindScenario[] = [];
    const variations = [-0.4, -0.2, 0, 0.2, 0.4]; // -40%, -20%, 0%, +20%, +40%

    variations.forEach(variation => {
      const modifiedSpeed = baseSpeed * (1 + variation);
      const windEffect = Math.cos((filterCriteria!.windDirection * Math.PI) / 180) * modifiedSpeed;
      const effectiveRange = aircraft.maxRange * (1 - (windEffect / aircraft.cruiseSpeed));

      scenarios.push({
        label: `${(variation >= 0 ? '+' : '')}${variation * 100}% wind`,
        speed: modifiedSpeed,
        effectiveRange: Math.round(effectiveRange)
      });
    });

    return scenarios;
  };

  // Filtreleme mantığını güncelle
  const filteredAircraft = useMemo(() => {
    if (!filterCriteria || !aircraftData) return [];

    return aircraftData.filter((aircraft: Aircraft) => {
      // 1. Yolcu kapasitesi kontrolü (±5% tolerans)
      const minAllowed = filterCriteria.passengers * 0.95; // -5%
      const maxAllowed = filterCriteria.passengers * 1.05; // +5%
      const hasValidCapacity =
        aircraft.capacity.min >= minAllowed &&
        aircraft.capacity.max <= maxAllowed;

      // 2. Kargo kapasitesi kontrolü (minimum değer)
      const hasValidCargo = aircraft.cargoCapacity >= filterCriteria.cargo;

      // 3. Menzil kontrolü (rüzgar etkisi dahil)
      const windRadians = (filterCriteria.windDirection * Math.PI) / 180;
      const windEffect = Math.cos(windRadians) * filterCriteria.windSpeed;
      const effectiveRange = aircraft.maxRange * (1 - (windEffect / aircraft.cruiseSpeed));
      const hasValidRange = effectiveRange >= filterCriteria.range;

      // 4. Alternatif menzil kontrolü
      const hasValidAlternateRange = effectiveRange >= filterCriteria.alternateRange;

      // Debug bilgilerini logla
      console.log(`Aircraft ${aircraft.name} validation:`, {
        capacity: {
          valid: hasValidCapacity,
          required: `${minAllowed.toFixed(0)}-${maxAllowed.toFixed(0)}`,
          actual: `${aircraft.capacity.min}-${aircraft.capacity.max}`,
          check: `${aircraft.capacity.min} >= ${minAllowed.toFixed(0)} && ${aircraft.capacity.max} <= ${maxAllowed.toFixed(0)}`
        },
        cargo: {
          valid: hasValidCargo,
          required: filterCriteria.cargo,
          actual: aircraft.cargoCapacity
        },
        range: {
          valid: hasValidRange,
          required: filterCriteria.range,
          effective: effectiveRange.toFixed(0),
          wind: {
            effect: windEffect.toFixed(2),
            direction: filterCriteria.windDirection,
            speed: filterCriteria.windSpeed
          }
        },
        alternate: {
          valid: hasValidAlternateRange,
          required: filterCriteria.alternateRange
        }
      });

      return hasValidCapacity && hasValidCargo && hasValidRange && hasValidAlternateRange;
    });
  }, [aircraftData, filterCriteria]);

  const handleFilter = (criteria: FilterCriteria) => {
    setFilterCriteria(criteria);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Aviation Analysis Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Find the most suitable aircraft types based on your flight requirements and analyze detailed comparisons.
          </p>
        </header>

        <FilterForm onFilter={handleFilter} />

        {filteredAircraft.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Suitable Aircraft Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAircraft.map((aircraft: Aircraft) => (
                    <Card key={aircraft.id} className="shadow-md">
                      <CardHeader>
                        <CardTitle className="text-lg">{aircraft.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p>Passenger Capacity: {aircraft.capacity.min}-{aircraft.capacity.max}</p>
                          <p>Cargo Capacity: {aircraft.cargoCapacity} kg</p>
                          <p>Range: {aircraft.maxRange} km</p>
                          <p>Fuel Efficiency: {(aircraft.fuelEfficiency * 100).toFixed(1)}%</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wind Scenario Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAircraft.map((aircraft) => (
                    <Card key={aircraft.id} className="shadow-md">
                      <CardHeader>
                        <CardTitle className="text-lg">{aircraft.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Range: {aircraft.maxRange} km</div>
                            <div>Cruise Speed: {aircraft.cruiseSpeed} knots</div>
                          </div>

                          {filterCriteria && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">Wind Scenarios:</h4>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Wind className="h-4 w-4 text-gray-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Shows how different wind speeds affect the effective range</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <div className="space-y-2">
                                {generateWindScenarios(filterCriteria.windSpeed, aircraft).map((scenario) => (
                                  <div
                                    key={scenario.label}
                                    className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors"
                                  >
                                    <div className="grid grid-cols-3 gap-2">
                                      <div>
                                        <span className="font-medium text-sm">{scenario.label}</span>
                                        <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                                          <Wind className="h-4 w-4" />
                                          {Math.round(scenario.speed)} kt
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-center">
                                        <div
                                          className="flex items-center text-gray-500"
                                          style={{
                                            transform: `rotate(${filterCriteria.windDirection}deg)`
                                          }}
                                        >
                                          <ArrowRight className="h-5 w-5" />
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-gray-600 text-sm">Effective Range</span>
                                        <div className="font-medium">
                                          {new Intl.NumberFormat('en-US').format(scenario.effectiveRange)} km
                                          <span className="text-sm text-gray-500 ml-1">
                                            ({Math.round((scenario.effectiveRange / aircraft.maxRange) * 100)}%)
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparative Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ComparisonCharts aircraftData={filteredAircraft} />
              </CardContent>
            </Card>
          </>
        )}

        {filterCriteria && filteredAircraft.length === 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <p>Belirtilen kriterlere uygun uçak bulunamadı. Lütfen şu kriterleri gözden geçirin:</p>
                <div className="mt-4 text-left">
                  <ul className="list-disc pl-6">
                    <li>Yolcu Sayısı: {filterCriteria.passengers} (±%5 tolerans)</li>
                    <li>Kargo Kapasitesi: {filterCriteria.cargo} kg (minimum)</li>
                    <li>Menzil: {filterCriteria.range} km</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-6">
          <p>Data based on BADA (Base of Aircraft Data) model</p>
          <p className="mt-2">© Aviation Performance Analytics</p>
        </footer>
      </div>
    </div>
  );
}