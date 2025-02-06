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
        label: `${(variation >= 0 ? '+' : '')}${variation * 100}% rüzgar`,
        speed: modifiedSpeed,
        effectiveRange: Math.round(effectiveRange)
      });
    });

    return scenarios;
  };

  const filteredAircraft = useMemo(() => {
    if (!filterCriteria || !aircraftData) return [];

    return aircraftData.filter((aircraft: Aircraft) => {
      // Yolcu kapasitesi kontrolü
      const hasEnoughCapacity =
        aircraft.capacity.min <= filterCriteria.passengers &&
        aircraft.capacity.max >= filterCriteria.passengers;

      // Kargo kapasitesi kontrolü
      const hasEnoughCargoCapacity = aircraft.cargoCapacity >= filterCriteria.cargo;

      // Menzil kontrolü (rüzgar etkisi hesaplanarak)
      const windEffect = Math.cos((filterCriteria.windDirection * Math.PI) / 180) * filterCriteria.windSpeed;
      const effectiveRange = aircraft.maxRange * (1 - (windEffect / aircraft.cruiseSpeed));
      const hasEnoughRange = effectiveRange >= filterCriteria.range;

      // Alternatif menzil kontrolü
      const hasEnoughAlternateRange = effectiveRange >= filterCriteria.alternateRange;

      return hasEnoughCapacity && hasEnoughCargoCapacity && hasEnoughRange && hasEnoughAlternateRange;
    });
  }, [aircraftData, filterCriteria]);

  const handleFilter = (criteria: FilterCriteria) => {
    setFilterCriteria(criteria);
  };

  const renderWindAnalysis = (aircraft: Aircraft) => {
    if (!filterCriteria) return null;

    const scenarios = generateWindScenarios(filterCriteria.windSpeed, aircraft);

    return (
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Rüzgar Senaryoları Analizi</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scenarios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis
                label={{ value: 'Efektif Menzil (km)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="effectiveRange"
                stroke="#8884d8"
                name="Efektif Menzil"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.label}
              className="bg-gray-100 p-3 rounded-md"
            >
              <p className="font-semibold">{scenario.label}</p>
              <p>Rüzgar Hızı: {Math.round(scenario.speed)} knot</p>
              <p>Efektif Menzil: {scenario.effectiveRange} km</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Havacılık Analiz Paneli
          </h1>
          <p className="text-gray-600 mt-2">
            Uçuş gereksinimlerinize göre en uygun uçak tiplerini bulun ve detaylı analizleri inceleyin.
          </p>
        </header>

        <FilterForm onFilter={handleFilter} />

        {filteredAircraft.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uygun Uçak Tipleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {filteredAircraft.map((aircraft: Aircraft) => (
                  <div key={aircraft.id} className="border-b pb-8 last:border-b-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>{aircraft.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p>Yolcu Kapasitesi: {aircraft.capacity.min}-{aircraft.capacity.max}</p>
                          <p>Kargo Kapasitesi: {aircraft.cargoCapacity} kg</p>
                          <p>Menzil: {aircraft.maxRange} km</p>
                          <p>Yakıt Verimliliği: {(aircraft.fuelEfficiency * 100).toFixed(1)}%</p>
                        </div>
                        {renderWindAnalysis(aircraft)}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredAircraft.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Karşılaştırmalı Analiz</CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonCharts aircraftData={filteredAircraft} />
            </CardContent>
          </Card>
        )}

        {filterCriteria && filteredAircraft.length === 0 && (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">
                Belirtilen kriterlere uygun uçak bulunamadı. Lütfen kriterleri güncelleyin.
              </p>
            </CardContent>
          </Card>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-6">
          <p>Veriler BADA (Base of Aircraft Data) modeline dayanmaktadır</p>
          <p className="mt-2">© 2024 Havacılık Performans Analitiği</p>
        </footer>
      </div>
    </div>
  );
}