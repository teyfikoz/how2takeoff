import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  aircraft: any[];
  selectedAircraft: any;
  onSelect: (aircraft: any) => void;
}

export default function AircraftSelector({ aircraft, selectedAircraft, onSelect }: Props) {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Aircraft Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Select 
          value={selectedAircraft?.id?.toString()} 
          onValueChange={(value) => {
            const selected = aircraft.find(a => a.id === parseInt(value));
            onSelect(selected);
          }}
        >
          <SelectTrigger className="w-full h-12 text-lg">
            <SelectValue placeholder="Select an aircraft type" />
          </SelectTrigger>
          <SelectContent>
            {aircraft.map((a) => (
              <SelectItem 
                key={a.id} 
                value={a.id.toString()}
                className="text-lg py-3"
              >
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedAircraft && (
          <>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="text-xl font-semibold text-blue-600">
                {selectedAircraft.name}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Max Takeoff Weight</div>
                  <div className="text-lg font-medium">{selectedAircraft.maxTakeoffWeight.toLocaleString()} kg</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fuel Capacity</div>
                  <div className="text-lg font-medium">{selectedAircraft.fuelCapacity.toLocaleString()} kg</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Max Range</div>
                  <div className="text-lg font-medium">{selectedAircraft.maxRange.toLocaleString()} nm</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Service Ceiling</div>
                  <div className="text-lg font-medium">{selectedAircraft.maxAltitude.toLocaleString()} ft</div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}