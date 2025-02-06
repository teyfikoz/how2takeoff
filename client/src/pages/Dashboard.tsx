import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import FilterForm from '@/components/aircraft/FilterForm';
import ComparisonCharts from '@/components/aircraft/ComparisonCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Aircraft } from '@shared/schema';

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

  const filteredAircraft = useMemo(() => {
    if (!filterCriteria || !aircraftData) return [];

    return aircraftData.filter((aircraft: Aircraft) => {
      // Passenger capacity check
      const hasEnoughCapacity =
        aircraft.capacity.min <= filterCriteria.passengers &&
        aircraft.capacity.max >= filterCriteria.passengers;

      // Cargo capacity check
      const hasEnoughCargoCapacity = aircraft.cargoCapacity >= filterCriteria.cargo;

      // Range check (with wind effect)
      const windEffect = Math.cos((filterCriteria.windDirection * Math.PI) / 180) * filterCriteria.windSpeed;
      const effectiveRange = aircraft.maxRange * (1 - (windEffect / aircraft.cruiseSpeed));
      const hasEnoughRange = effectiveRange >= filterCriteria.range;

      // Alternate range check
      const hasEnoughAlternateRange = effectiveRange >= filterCriteria.alternateRange;

      return hasEnoughCapacity && hasEnoughCargoCapacity && hasEnoughRange && hasEnoughAlternateRange;
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
                              <h4 className="font-semibold">Wind Scenarios:</h4>
                              <div className="space-y-2">
                                {generateWindScenarios(filterCriteria.windSpeed, aircraft).map((scenario) => (
                                  <div
                                    key={scenario.label}
                                    className="bg-gray-100 p-2 rounded-md"
                                  >
                                    <div className="grid grid-cols-2 gap-1 text-sm">
                                      <div>
                                        <span className="font-medium">{scenario.label}</span>
                                        <br />
                                        <span className="text-gray-600">
                                          {Math.round(scenario.speed)} knots
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-gray-600">Effective Range</span>
                                        <br />
                                        <span className="font-medium">
                                          {scenario.effectiveRange} km
                                        </span>
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
              <p className="text-center text-gray-500">
                No aircraft found matching the specified criteria. Please update your requirements.
              </p>
            </CardContent>
          </Card>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-6">
          <p>Data based on BADA (Base of Aircraft Data) model</p>
          <p className="mt-2">© 2024 Aviation Performance Analytics</p>
        </footer>
      </div>
    </div>
  );
}