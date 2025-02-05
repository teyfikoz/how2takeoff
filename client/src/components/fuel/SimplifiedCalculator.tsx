import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { calculateSimplified } from '@/lib/calculations';

interface Props {
  aircraft: any;
  onCalculate: (results: any) => void;
}

export default function SimplifiedCalculator({ aircraft, onCalculate }: Props) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: { distance: number }) => {
    const results = calculateSimplified(aircraft, data.distance);
    onCalculate(results);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simplified FEAT Model</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Distance (nm)</Label>
            <Input type="number" {...register('distance')} />
          </div>

          <Button type="submit">Quick Calculate</Button>
        </form>
      </CardContent>
    </Card>
  );
}
