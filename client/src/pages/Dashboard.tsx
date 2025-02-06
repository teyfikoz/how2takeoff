import React, { useState } from 'react';
import {
  LineChart, Line, ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import AircraftSelector from '@/components/aircraft/AircraftSelector';
import HighFidelityCalculator from '@/components/fuel/HighFidelityCalculator';
import SimplifiedCalculator from '@/components/fuel/SimplifiedCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const [selectedAircraft, setSelectedAircraft] = useState<any>(null);
  const [results, setResults] = useState<any>(null);

  const { data: aircraftData } = useQuery({
    queryKey: ['/api/aircraft'],
  });

  const handleCalculationResults = (newResults: any) => {
    setResults(newResults);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Aviation Fuel Analysis Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <AircraftSelector
              aircraft={aircraftData || []}
              selectedAircraft={selectedAircraft}
              onSelect={setSelectedAircraft}
            />
          </div>

          {selectedAircraft && (
            <>
              <div>
                <HighFidelityCalculator
                  aircraft={selectedAircraft}
                  onCalculate={handleCalculationResults}
                />
              </div>

              <div>
                <SimplifiedCalculator
                  aircraft={selectedAircraft}
                  onCalculate={handleCalculationResults}
                />
              </div>
            </>
          )}
        </div>

        {results && selectedAircraft && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fuel Consumption Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={[
                      { name: 'Takeoff', fuel: results.segments?.takeoff || 0 },
                      { name: 'Climb', fuel: results.segments?.climb || 0 },
                      { name: 'Cruise', fuel: results.segments?.cruise || 0 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="fuel" fill="#8884d8" stroke="#8884d8" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Total Fuel Required</div>
                    <div className="text-2xl font-bold">{Math.round(results.fuelRequired)} kg</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">CO2 Emissions</div>
                    <div className="text-2xl font-bold">{Math.round(results.co2Emissions)} kg</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: 'Optimal', efficiency: 100 },
                      { name: 'Current', efficiency: (results.fuelRequired / selectedAircraft.baseFuelFlow) * 100 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="efficiency" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}