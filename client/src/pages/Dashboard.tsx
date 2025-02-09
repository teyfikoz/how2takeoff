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

interface FilterCriteria {
  passengers: number;
  cargo: number;
  range: number;
  alternateRange: number;
  windSpeed: number;
  windDirection: number;
}

export default function Dashboard() {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria | null>(null);

  const { data: aircraftData = [] } = useQuery<Aircraft[]>({
    queryKey: ['/api/aircraft'],
  });

  const calculateEffectiveRange = (aircraft: Aircraft, windSpeed: number, windDirection: number) => {
    const windRadians = (windDirection * Math.PI) / 180;
    const windEffect = Math.cos(windRadians) * windSpeed;
    const effectiveSpeed = aircraft.cruiseSpeed - windEffect;
    return aircraft.maxRange * (effectiveSpeed / aircraft.cruiseSpeed);
  };

  const filteredAircraft = useMemo(() => {
    if (!filterCriteria || !aircraftData) return [];

    return aircraftData.filter((aircraft: Aircraft) => {
      const passengerCheck = {
        valid: filterCriteria.passengers <= aircraft.maxPassengers,
        message: `Required passengers (${filterCriteria.passengers}) exceeds maximum capacity (${aircraft.maxPassengers})`
      };

      const cargoCheck = {
        valid: filterCriteria.cargo <= aircraft.cargoCapacity,
        message: `Required cargo (${filterCriteria.cargo}kg) exceeds maximum capacity (${aircraft.cargoCapacity}kg)`
      };

      const effectiveRange = calculateEffectiveRange(
        aircraft,
        filterCriteria.windSpeed,
        filterCriteria.windDirection
      );

      const rangeCheck = {
        valid: filterCriteria.range <= effectiveRange,
        message: `Required range (${filterCriteria.range}km) exceeds effective range (${Math.round(effectiveRange)}km)`
      };

      const alternateRangeCheck = {
        valid: filterCriteria.alternateRange <= effectiveRange,
        message: `Alternate range (${filterCriteria.alternateRange}km) exceeds effective range (${Math.round(effectiveRange)}km)`
      };

      return passengerCheck.valid && 
             cargoCheck.valid && 
             rangeCheck.valid && 
             alternateRangeCheck.valid;
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

        {filteredAircraft.length > 0 ? (
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
                          <p>Maximum Passengers: {aircraft.maxPassengers}</p>
                          <p>Cargo Capacity: {aircraft.cargoCapacity.toLocaleString()} kg</p>
                          <p>Range: {aircraft.maxRange.toLocaleString()} km</p>
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
                <CardTitle>Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ComparisonCharts aircraftData={filteredAircraft} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wind Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredAircraft.map((aircraft: Aircraft) => (
                  <div key={aircraft.id} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{aircraft.name}</h3>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>Base Range: {aircraft.maxRange.toLocaleString()} km</div>
                        <div>Cruise Speed: {aircraft.cruiseSpeed} knots</div>
                      </div>

                      {filterCriteria && (
                        <div>
                          <h4 className="font-medium mb-2">Effective Range with Current Wind:</h4>
                          <div className="bg-gray-50 p-3 rounded">
                            {calculateEffectiveRange(
                              aircraft,
                              filterCriteria.windSpeed,
                              filterCriteria.windDirection
                            ).toLocaleString()} km
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        ) : filterCriteria && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">No Matching Aircraft Found</h3>
                <p className="text-gray-600">The search criteria exceed available aircraft capabilities:</p>
                <div className="mt-4 text-left max-w-md mx-auto">
                  <div className="space-y-2">
                    <div>• Passengers: {filterCriteria.passengers}</div>
                    <div>• Cargo: {filterCriteria.cargo.toLocaleString()} kg</div>
                    <div>• Range: {filterCriteria.range.toLocaleString()} km</div>
                    <div>• Wind Speed: {filterCriteria.windSpeed} knots</div>
                    <div>• Wind Direction: {filterCriteria.windDirection}°</div>
                  </div>
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