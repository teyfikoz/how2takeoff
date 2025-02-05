import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  aircraft: any[];
  selectedAircraft: any;
  onSelect: (aircraft: any) => void;
}

export default function AircraftSelector({ aircraft, selectedAircraft, onSelect }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aircraft Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedAircraft?.id} onValueChange={(value) => {
          const selected = aircraft.find(a => a.id === parseInt(value));
          onSelect(selected);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select aircraft" />
          </SelectTrigger>
          <SelectContent>
            {aircraft.map((a) => (
              <SelectItem key={a.id} value={a.id.toString()}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedAircraft && (
          <div className="mt-4 space-y-2 text-sm">
            <div>Max Takeoff Weight: {selectedAircraft.maxTakeoffWeight} kg</div>
            <div>Fuel Capacity: {selectedAircraft.fuelCapacity} kg</div>
            <div>Max Range: {selectedAircraft.maxRange} nm</div>
            <div>Service Ceiling: {selectedAircraft.maxAltitude} ft</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
