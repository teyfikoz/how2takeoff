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

// Admin token - gerçek uygulamada bu daha güvenli bir şekilde saklanmalı
const ADMIN_TOKEN = 'admin-secret-token';

export default function AircraftDatabase() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { data: aircraftData } = useQuery({
    queryKey: ['/api/aircraft'],
  });

  const form = useForm({
    resolver: zodResolver(insertAircraftSchema),
    defaultValues: {
      name: '',
      emptyWeight: 0,
      maxTakeoffWeight: 0,
      maxPayload: 0,
      fuelCapacity: 0,
      baseFuelFlow: 0,
      cruiseSpeed: 0,
      maxAltitude: 0,
      maxRange: 0,
      fuelEfficiency: 0,
      capacity: { min: 0, max: 0 },
      cargoCapacity: 0,
      speed: 0
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await apiRequest('POST', '/api/admin/aircraft', data, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        }
      });
      queryClient.invalidateQueries({ queryKey: ['/api/aircraft'] });
      toast({
        title: "Success",
        description: "Aircraft added successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add aircraft - Admin access required",
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
            <CardTitle>Admin - Aircraft Database</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Aircraft Name</Label>
                <Input {...form.register('name')} />
              </div>

              <div className="space-y-2">
                <Label>Empty Weight (kg)</Label>
                <Input type="number" {...form.register('emptyWeight', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Max Takeoff Weight (kg)</Label>
                <Input type="number" {...form.register('maxTakeoffWeight', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Max Payload (kg)</Label>
                <Input type="number" {...form.register('maxPayload', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Fuel Capacity (kg)</Label>
                <Input type="number" {...form.register('fuelCapacity', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Base Fuel Flow (kg/hr)</Label>
                <Input type="number" {...form.register('baseFuelFlow', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Cruise Speed (kt)</Label>
                <Input type="number" {...form.register('cruiseSpeed', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Max Altitude (ft)</Label>
                <Input type="number" {...form.register('maxAltitude', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Max Range (nm)</Label>
                <Input type="number" {...form.register('maxRange', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Fuel Efficiency</Label>
                <Input type="number" step="0.01" {...form.register('fuelEfficiency', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Min Capacity</Label>
                <Input 
                  type="number" 
                  {...form.register('capacity.min', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Capacity</Label>
                <Input 
                  type="number" 
                  {...form.register('capacity.max', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label>Cargo Capacity (kg)</Label>
                <Input type="number" {...form.register('cargoCapacity', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Speed (km/h)</Label>
                <Input type="number" {...form.register('speed', { valueAsNumber: true })} />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Aircraft (Admin Only)
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

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Existing Aircraft</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Capacity</th>
                    <th className="py-2 text-left">Range (nm)</th>
                    <th className="py-2 text-left">Speed (km/h)</th>
                    <th className="py-2 text-left">Cargo Capacity (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {aircraftData?.map((aircraft: any) => (
                    <tr key={aircraft.id} className="border-b">
                      <td className="py-2">{aircraft.name}</td>
                      <td className="py-2">{aircraft.capacity.min}-{aircraft.capacity.max}</td>
                      <td className="py-2">{aircraft.maxRange}</td>
                      <td className="py-2">{aircraft.speed}</td>
                      <td className="py-2">{aircraft.cargoCapacity}</td>
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