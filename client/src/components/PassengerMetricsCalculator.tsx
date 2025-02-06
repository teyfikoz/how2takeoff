import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calculateLoadFactor,
  calculateOverbookingLimit,
  calculateRASM,
  calculateBreakEvenLoadFactor,
  type LoadFactorParams,
  type OverbookingParams,
  type RASMParams,
  type BreakEvenParams
} from '@/lib/passenger-utils';

const PassengerMetricsCalculator = () => {
  // Load Factor State
  const [loadFactorParams, setLoadFactorParams] = useState<LoadFactorParams>({
    passengersBooked: 0,
    availableSeats: 0
  });

  // Overbooking State
  const [overbookingParams, setOverbookingParams] = useState<OverbookingParams>({
    totalSeats: 0,
    historicalNoShowRate: 0,
    desiredLoadFactor: 0
  });

  // RASM State
  const [rasmParams, setRasmParams] = useState<RASMParams>({
    totalRevenue: 0,
    availableSeats: 0,
    distanceInMiles: 0,
    numberOfFlights: 0
  });

  // Break-even State
  const [breakEvenParams, setBreakEvenParams] = useState<BreakEvenParams>({
    fixedCosts: 0,
    averageTicketPrice: 0,
    variableCostPerPassenger: 0,
    totalSeats: 0
  });

  return (
    <Tabs defaultValue="loadFactor" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="loadFactor">Load Factor</TabsTrigger>
        <TabsTrigger value="overbooking">Overbooking</TabsTrigger>
        <TabsTrigger value="rasm">RASM</TabsTrigger>
        <TabsTrigger value="breakEven">Break-even</TabsTrigger>
      </TabsList>

      <TabsContent value="loadFactor">
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Passengers Booked</Label>
                <Input
                  type="number"
                  value={loadFactorParams.passengersBooked}
                  onChange={(e) => setLoadFactorParams({
                    ...loadFactorParams,
                    passengersBooked: Number(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Available Seats</Label>
                <Input
                  type="number"
                  value={loadFactorParams.availableSeats}
                  onChange={(e) => setLoadFactorParams({
                    ...loadFactorParams,
                    availableSeats: Number(e.target.value)
                  })}
                />
              </div>
            </div>
            <div className="pt-4">
              <p className="text-lg font-semibold">
                Load Factor: {loadFactorParams.availableSeats ? 
                  calculateLoadFactor(loadFactorParams).toFixed(2) + '%' : 
                  'Enter values to calculate'}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="overbooking">
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Total Seats</Label>
                <Input
                  type="number"
                  value={overbookingParams.totalSeats}
                  onChange={(e) => setOverbookingParams({
                    ...overbookingParams,
                    totalSeats: Number(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>No-show Rate (%)</Label>
                <Input
                  type="number"
                  value={overbookingParams.historicalNoShowRate * 100}
                  onChange={(e) => setOverbookingParams({
                    ...overbookingParams,
                    historicalNoShowRate: Number(e.target.value) / 100
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Load Factor (%)</Label>
                <Input
                  type="number"
                  value={overbookingParams.desiredLoadFactor * 100}
                  onChange={(e) => setOverbookingParams({
                    ...overbookingParams,
                    desiredLoadFactor: Number(e.target.value) / 100
                  })}
                />
              </div>
            </div>
            <div className="pt-4">
              <p className="text-lg font-semibold">
                Recommended Booking Limit: {overbookingParams.totalSeats ? 
                  calculateOverbookingLimit(overbookingParams) : 
                  'Enter values to calculate'}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rasm">
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Revenue ($)</Label>
                <Input
                  type="number"
                  value={rasmParams.totalRevenue}
                  onChange={(e) => setRasmParams({
                    ...rasmParams,
                    totalRevenue: Number(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Available Seats</Label>
                <Input
                  type="number"
                  value={rasmParams.availableSeats}
                  onChange={(e) => setRasmParams({
                    ...rasmParams,
                    availableSeats: Number(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Distance (miles)</Label>
                <Input
                  type="number"
                  value={rasmParams.distanceInMiles}
                  onChange={(e) => setRasmParams({
                    ...rasmParams,
                    distanceInMiles: Number(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Number of Flights</Label>
                <Input
                  type="number"
                  value={rasmParams.numberOfFlights}
                  onChange={(e) => setRasmParams({
                    ...rasmParams,
                    numberOfFlights: Number(e.target.value)
                  })}
                />
              </div>
            </div>
            <div className="pt-4">
              <p className="text-lg font-semibold">
                RASM: {rasmParams.distanceInMiles && rasmParams.availableSeats ? 
                  '$' + calculateRASM(rasmParams).toFixed(4) + ' per ASM' : 
                  'Enter values to calculate'}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="breakEven">
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fixed Costs ($)</Label>
                <Input
                  type="number"
                  value={breakEvenParams.fixedCosts}
                  onChange={(e) => setBreakEvenParams({
                    ...breakEvenParams,
                    fixedCosts: Number(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Average Ticket Price ($)</Label>
                <Input
                  type="number"
                  value={breakEvenParams.averageTicketPrice}
                  onChange={(e) => setBreakEvenParams({
                    ...breakEvenParams,
                    averageTicketPrice: Number(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Variable Cost per Passenger ($)</Label>
                <Input
                  type="number"
                  value={breakEvenParams.variableCostPerPassenger}
                  onChange={(e) => setBreakEvenParams({
                    ...breakEvenParams,
                    variableCostPerPassenger: Number(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Seats</Label>
                <Input
                  type="number"
                  value={breakEvenParams.totalSeats}
                  onChange={(e) => setBreakEvenParams({
                    ...breakEvenParams,
                    totalSeats: Number(e.target.value)
                  })}
                />
              </div>
            </div>
            <div className="pt-4">
              <p className="text-lg font-semibold">
                Break-even Load Factor: {breakEvenParams.totalSeats ? 
                  calculateBreakEvenLoadFactor(breakEvenParams).toFixed(2) + '%' : 
                  'Enter values to calculate'}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PassengerMetricsCalculator;
