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

export default function AircraftDatabase() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { isAdmin } = useAuth();

  const { data: aircraftData } = useQuery({
    queryKey: ['/api/aircraft'],
  });

  const form = useForm({
    resolver: zodResolver(insertAircraftSchema),
    defaultValues: {
      name: '',
      maxPassengers: 0,
      cargoCapacity: 0,
      maxRange: 0,
      cruiseSpeed: 0,
      fuelEfficiency: 0
    }
  });

  const onSubmit = async (data: any) => {
    if (!isAdmin) {
      toast({
        title: "Yetkisiz İşlem",
        description: "Bu işlemi gerçekleştirmek için admin yetkisine sahip olmalısınız",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest('POST', '/api/aircraft', data);
      queryClient.invalidateQueries({ queryKey: ['/api/aircraft'] });
      toast({
        title: "Başarılı",
        description: "Uçak başarıyla eklendi",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Uçak eklenirken bir hata oluştu",
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
            <CardTitle>Uçak Veritabanı</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isAdmin && (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Uçak Adı</Label>
                  <Input {...form.register('name')} />
                </div>

                <div className="space-y-2">
                  <Label>Maksimum Yolcu Kapasitesi</Label>
                  <Input 
                    type="number" 
                    {...form.register('maxPassengers', { valueAsNumber: true })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Kargo Kapasitesi (kg)</Label>
                  <Input 
                    type="number" 
                    {...form.register('cargoCapacity', { valueAsNumber: true })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Maksimum Menzil (km)</Label>
                  <Input 
                    type="number" 
                    {...form.register('maxRange', { valueAsNumber: true })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Seyir Hızı (knot)</Label>
                  <Input 
                    type="number" 
                    {...form.register('cruiseSpeed', { valueAsNumber: true })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Yakıt Verimliliği</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...form.register('fuelEfficiency', { valueAsNumber: true })} 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                <PlusCircle className="w-4 h-4 mr-2" />
                Uçak Ekle
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => setLocation("/")}
              >
                Panele Dön
              </Button>
            </form>
          )}

          <div className={`${isAdmin ? 'mt-8' : 'mt-4'}`}>
            <h3 className="text-lg font-semibold mb-4">Mevcut Uçaklar</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Uçak Adı</th>
                    <th className="py-2 text-left">Maks. Yolcu</th>
                    <th className="py-2 text-left">Kargo Kapasitesi (kg)</th>
                    <th className="py-2 text-left">Menzil (km)</th>
                    <th className="py-2 text-left">Seyir Hızı (knot)</th>
                    <th className="py-2 text-left">Yakıt Verimliliği</th>
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