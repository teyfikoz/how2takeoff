import React, { useState } from 'react';
import { PlusCircle, Database, Download, FileSpreadsheet, Search, SortAsc, SortDesc } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { insertAircraftSchema } from '@shared/schema';
import { useLocation } from "wouter";
import { useAuth } from '@/hooks/useAuth';
import { Aircraft } from '@shared/schema';
import { useSEO } from '@/hooks/useSEO';
// Mock veriyi içe aktarıyoruz
import { mockAircraftData } from '@/data/mockAircraftData';
import * as XLSX from 'xlsx';

export default function AircraftDatabase() {
  useSEO({
    title: 'Aircraft Database - Complete Aircraft Specifications - How2TakeOff',
    description: 'Comprehensive aircraft database with detailed specifications including passenger capacity, cargo capacity, range, fuel efficiency, and CO2 emissions for major commercial aircraft.',
    keywords: 'aircraft database, aircraft specifications, airplane specs, aircraft performance, commercial aircraft, aircraft comparison',
    canonical: 'https://how2takeoff.com/database'
  });
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Veritabanı bağlantısı sorunu nedeniyle mock veriyi kullanıyoruz
  const { data: aircraftData = mockAircraftData } = useQuery({
    queryKey: ['/api/aircraft'],
    initialData: mockAircraftData, // Yedek veri olarak mock veriyi kullan
  });

  // Excel export fonksiyonu
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredAircraft.map(aircraft => ({
        'Aircraft Name': aircraft.name,
        'Max Passengers': aircraft.maxPassengers,
        'Cargo Capacity (kg)': aircraft.cargoCapacity,
        'Range (km)': aircraft.maxRange,
        'Cruise Speed (knots)': aircraft.cruiseSpeed,
        'Fuel Efficiency (%)': (aircraft.fuelEfficiency * 100).toFixed(1),
        'CO₂ Factor (kg/L)': aircraft.co2Factor,
        'Min Runway (m)': aircraft.minRunway || 'N/A'
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Aircraft Database');

    // Excel dosyasını indir
    XLSX.writeFile(workbook, `Aircraft_Database_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Success!",
      description: `Exported ${filteredAircraft.length} aircraft to Excel`,
    });
  };

  // Filtreleme ve sıralama
  const filteredAircraft = React.useMemo(() => {
    let filtered = aircraftData?.filter((aircraft: Aircraft) =>
      aircraft.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Sıralama
    filtered.sort((a: any, b: any) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [aircraftData, searchTerm, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const form = useForm({
    resolver: zodResolver(insertAircraftSchema),
    defaultValues: {
      name: '',
      maxPassengers: 0,
      cargoCapacity: 0,
      maxRange: 0,
      cruiseSpeed: 0,
      fuelEfficiency: 0,
      co2Factor: 2.5
    }
  });

  const onSubmit = async (data: any) => {
    if (!isAdmin) {
      toast({
        title: "Unauthorized",
        description: "You must be an admin to perform this action",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest('POST', '/api/aircraft', data);
      queryClient.invalidateQueries({ queryKey: ['/api/aircraft'] });
      toast({
        title: "Success",
        description: "Aircraft added successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add aircraft",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <Card className="border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Aircraft Database
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Comprehensive specifications for {aircraftData?.length || 55} commercial aircraft
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 shadow-lg"
              size="lg"
            >
              <FileSpreadsheet className="w-5 h-5 mr-2" />
              Export to Excel
            </Button>
          </div>

          {/* Search and Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search aircraft by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base border-2"
                />
              </div>
            </div>
            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Total Aircraft</div>
                <div className="text-2xl font-bold text-blue-600">{aircraftData?.length || 55}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Showing</div>
                <div className="text-2xl font-bold text-green-600">{filteredAircraft.length}</div>
              </CardContent>
            </Card>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isAdmin && (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Aircraft Name</Label>
                  <Input {...form.register('name')} />
                </div>

                <div className="space-y-2">
                  <Label>Maximum Passenger Capacity</Label>
                  <Input 
                    type="number" 
                    {...form.register('maxPassengers', { valueAsNumber: true })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cargo Capacity (kg)</Label>
                  <Input 
                    type="number" 
                    {...form.register('cargoCapacity', { valueAsNumber: true })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Maximum Range (km)</Label>
                  <Input 
                    type="number" 
                    {...form.register('maxRange', { valueAsNumber: true })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cruise Speed (knots)</Label>
                  <Input 
                    type="number" 
                    {...form.register('cruiseSpeed', { valueAsNumber: true })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fuel Efficiency</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...form.register('fuelEfficiency', { valueAsNumber: true })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>CO₂ Factor (kg/L)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...form.register('co2Factor', { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Minimum Runway Length (m)</Label>
                  <Input
                    type="number"
                    {...form.register('minRunway', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Aircraft
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => setLocation("/")}
              >
                Back to Dashboard
              </Button>
            </form>
          )}

          <div className={`${isAdmin ? 'mt-8' : 'mt-4'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Aircraft Fleet ({filteredAircraft.length})</h3>
              <div className="text-sm text-gray-600">
                Click column headers to sort
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg border-2 border-gray-200 shadow-lg">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <tr>
                    <th
                      className="py-4 px-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Aircraft Name
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="py-4 px-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleSort('maxPassengers')}
                    >
                      <div className="flex items-center gap-2">
                        Max. Passengers
                        {sortField === 'maxPassengers' && (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="py-4 px-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleSort('cargoCapacity')}
                    >
                      <div className="flex items-center gap-2">
                        Cargo Capacity (kg)
                        {sortField === 'cargoCapacity' && (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="py-4 px-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleSort('maxRange')}
                    >
                      <div className="flex items-center gap-2">
                        Range (km)
                        {sortField === 'maxRange' && (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="py-4 px-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleSort('cruiseSpeed')}
                    >
                      <div className="flex items-center gap-2">
                        Cruise Speed (knots)
                        {sortField === 'cruiseSpeed' && (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="py-4 px-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleSort('fuelEfficiency')}
                    >
                      <div className="flex items-center gap-2">
                        Fuel Efficiency
                        {sortField === 'fuelEfficiency' && (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="py-4 px-4 text-left font-semibold">CO₂ Factor (kg/L)</th>
                    <th
                      className="py-4 px-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleSort('minRunway')}
                    >
                      <div className="flex items-center gap-2">
                        Min. Runway (m)
                        {sortField === 'minRunway' && (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredAircraft.map((aircraft: Aircraft, index) => (
                    <tr
                      key={aircraft.id}
                      className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">{aircraft.name}</td>
                      <td className="py-3 px-4 text-gray-700">{aircraft.maxPassengers}</td>
                      <td className="py-3 px-4 text-gray-700">{aircraft.cargoCapacity.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-700">{aircraft.maxRange.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-700">{aircraft.cruiseSpeed}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {(aircraft.fuelEfficiency * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{aircraft.co2Factor} kg/L</td>
                      <td className="py-3 px-4 text-gray-700">{aircraft.minRunway ? aircraft.minRunway.toLocaleString() : 'N/A'} m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}