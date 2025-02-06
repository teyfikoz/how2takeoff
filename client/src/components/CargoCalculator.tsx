import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  calculateMaxPayload,
  calculateVolumeUtilization,
  calculateLoadFactor,
  calculateFTK,
  calculateCargoRevenue,
  calculateBELF,
  calculateULDLoadFactor,
  calculateDynamicPrice,
  type CargoCalculationParams,
  type FreightRevenueParams,
  type ULDParams,
  type DynamicPricingParams
} from '@/lib/cargo-utils';

const CargoCalculator: React.FC = () => {
  const [params, setParams] = useState<CargoCalculationParams>({
    aircraft: {
      maxTakeoffWeight: 80000,
      emptyWeight: 45000,
      fuelCapacity: 20000,
      cargoVolume: 150
    },
    cargo: {
      weight: 10000,
      volume: 100
    },
    distance: 1000,
    fuelLoad: 15000
  });

  const [revenueParams, setRevenueParams] = useState<FreightRevenueParams>({
    cargoWeight: 10,
    distance: 1000,
    revenuePerFTK: 0.5
  });

  const [pricingParams, setPricingParams] = useState<DynamicPricingParams>({
    baseRate: 2.0,
    fuelSurcharge: 10,
    demandFactor: 15
  });

  // Calculate metrics
  const maxPayload = calculateMaxPayload(params);
  const volumeUtilization = calculateVolumeUtilization(
    params.cargo.volume || 0,
    params.aircraft.cargoVolume || 1
  );
  const loadFactor = calculateLoadFactor(params.cargo.weight, maxPayload);
  const ftk = calculateFTK(revenueParams);
  const revenue = calculateCargoRevenue(revenueParams);
  const belf = calculateBELF(revenueParams.revenuePerFTK * 0.8 * ftk, revenue); // Assuming 80% of revenue is operating cost
  const dynamicPrice = calculateDynamicPrice(pricingParams);

  const uldMetrics = calculateULDLoadFactor({
    uldCapacity: 5000,
    cargoWeight: params.cargo.weight,
    cargoVolume: params.cargo.volume || 0,
    maxVolume: params.aircraft.cargoVolume || 1
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cargo Operations Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Aircraft & Cargo Parameters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Takeoff Weight (kg)</Label>
                <Input
                  type="number"
                  value={params.aircraft.maxTakeoffWeight}
                  onChange={(e) => setParams({
                    ...params,
                    aircraft: {
                      ...params.aircraft,
                      maxTakeoffWeight: Number(e.target.value)
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Empty Weight (kg)</Label>
                <Input
                  type="number"
                  value={params.aircraft.emptyWeight}
                  onChange={(e) => setParams({
                    ...params,
                    aircraft: {
                      ...params.aircraft,
                      emptyWeight: Number(e.target.value)
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo Weight (kg)</Label>
                <Input
                  type="number"
                  value={params.cargo.weight}
                  onChange={(e) => setParams({
                    ...params,
                    cargo: {
                      ...params.cargo,
                      weight: Number(e.target.value)
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Distance (km)</Label>
                <Input
                  type="number"
                  value={params.distance}
                  onChange={(e) => setParams({
                    ...params,
                    distance: Number(e.target.value)
                  })}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Cargo Metrics</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Maximum Payload</Label>
                <p className="text-2xl font-bold">{maxPayload.toFixed(0)} kg</p>
                <p className="text-sm text-gray-500">Available cargo capacity</p>
              </div>
              <div>
                <Label>Load Factor</Label>
                <Progress value={loadFactor} className="mt-2" />
                <p className="text-sm text-gray-500 mt-1">{loadFactor.toFixed(1)}% utilized</p>
              </div>
              <div>
                <Label>Freight Ton Kilometers</Label>
                <p className="text-2xl font-bold">{ftk.toFixed(0)} FTK</p>
                <p className="text-sm text-gray-500">Total cargo transport work</p>
              </div>
              <div>
                <Label>Break-even Load Factor</Label>
                <p className="text-2xl font-bold">{belf.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Minimum for profitability</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Revenue & Pricing</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Estimated Revenue</Label>
                <p className="text-2xl font-bold text-green-600">${revenue.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Based on current FTK rate</p>
              </div>
              <div>
                <Label>Dynamic Price per kg</Label>
                <p className="text-2xl font-bold">${dynamicPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Including surcharges</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Cargo Operations Guide</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Load factor should be optimized while considering weight and volume constraints</p>
              <p>• Break-even load factor indicates minimum capacity utilization for profitability</p>
              <p>• Dynamic pricing adjusts based on fuel costs and market demand</p>
              <p>• FTK (Freight Ton Kilometer) measures cargo transport productivity</p>
              <p>• Balance between payload and fuel load is crucial for optimal range</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CargoCalculator;
