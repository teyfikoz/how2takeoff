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

export default function Dashboard() {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria | null>(null);

  const { data: aircraftData } = useQuery({
    queryKey: ['/api/aircraft'],
  });

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAircraft.map((aircraft: Aircraft) => (
                  <Card key={aircraft.id}>
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
                    </CardContent>
                  </Card>
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