import React from 'react';
import { PlusCircle, Database } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Veritabanı bağlantısı sorunu nedeniyle mock veriyi kullanıyoruz
  const { data: aircraftData = mockAircraftData } = useQuery({
    queryKey: ['/api/aircraft'],
    initialData: mockAircraftData, // Yedek veri olarak mock veriyi kullan
  });

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
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-500" />
            <CardTitle>Aircraft Database</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
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
            <h3 className="text-lg font-semibold mb-4">Available Aircraft</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Aircraft Name</th>
                    <th className="py-2 text-left">Max. Passengers</th>
                    <th className="py-2 text-left">Cargo Capacity (kg)</th>
                    <th className="py-2 text-left">Range (km)</th>
                    <th className="py-2 text-left">Cruise Speed (knots)</th>
                    <th className="py-2 text-left">Fuel Efficiency</th>
                    <th className="py-2 text-left">CO₂ Factor (kg/L)</th>
                  </tr>
                </thead>
                <tbody>
                  {aircraftData?.map((aircraft: Aircraft) => (
                    <tr key={aircraft.id} className="border-b">
                      <td className="py-2">{aircraft.name}</td>
                      <td className="py-2">{aircraft.maxPassengers}</td>
                      <td className="py-2">{aircraft.cargoCapacity.toLocaleString()}</td>
                      <td className="py-2">{aircraft.maxRange.toLocaleString()}</td>
                      <td className="py-2">{aircraft.cruiseSpeed}</td>
                      <td className="py-2">{(aircraft.fuelEfficiency * 100).toFixed(1)}%</td>
                      <td className="py-2">{aircraft.co2Factor} kg/L</td>
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