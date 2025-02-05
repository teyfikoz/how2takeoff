import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { calculateHighFidelity, FlightParams } from '@/lib/calculations';

interface Props {
  aircraft: any;
  onCalculate: (results: any) => void;
}

export default function HighFidelityCalculator({ aircraft, onCalculate }: Props) {
  const { register, handleSubmit } = useForm<FlightParams>();

  const onSubmit = (data: FlightParams) => {
    const results = calculateHighFidelity(aircraft, data);
    onCalculate(results);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>High-Fidelity FEAT Model</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Distance (nm)</Label>
            <Input type="number" {...register('distance')} />
          </div>
          
          <div>
            <Label>Cruise Altitude (ft)</Label>
            <Input type="number" {...register('altitude')} />
          </div>
          
          <div>
            <Label>Payload (kg)</Label>
            <Input type="number" {...register('payload')} />
          </div>
          
          <div>
            <Label>Temperature (°C)</Label>
            <Input type="number" {...register('temperature')} />
          </div>
          
          <div>
            <Label>Wind Speed (kt)</Label>
            <Input type="number" {...register('windSpeed')} />
          </div>

          <Button type="submit">Calculate</Button>
        </form>
      </CardContent>
    </Card>
  );
}
