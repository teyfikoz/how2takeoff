import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CargoCalculator from "@/components/CargoCalculator";
import { useSEO } from "@/hooks/useSEO";
import { 
  Package, Calculator, Scale, DollarSign, Plane, Users, 
  TrendingUp, AlertTriangle, CheckCircle, Info, Briefcase
} from "lucide-react";
import {
  calculateChargeableWeight,
  calculateFreightPrice,
  calculateDynamicPrice,
  BASE_RATES,
  CATEGORY_MULTIPLIERS,
  SEASON_MULTIPLIERS,
  type RouteType,
  type CargoCategory,
  type SeasonType,
} from "@/lib/freight-pricing-utils";
import {
  EASA_PASSENGER_WEIGHTS,
  EASA_BAGGAGE_WEIGHTS,
  FLIGHT_CATEGORY_WEIGHTS,
  SERVICE_LOAD_PER_PAX,
  calculatePassengerWeight,
  calculateBaggageWeight,
  calculateCrewWeight,
  calculateServiceLoad,
  estimateFlightWeight,
  type FlightCategory,
  type PassengerManifest,
} from "@/lib/weight-utils";

export default function BasicAviationCargo() {
  useSEO({
    title: "Aviation Cargo & Weight Management - How2TakeOff",
    description: "Comprehensive aviation cargo concepts including EASA weight standards, chargeable weight calculations, air freight pricing models, and cargo optimization strategies.",
    keywords: "aviation cargo, EASA weight standards, chargeable weight, volumetric weight, air freight pricing, cargo optimization, weight and balance, air cargo metrics",
    canonical: "https://how2takeoff.com/basic-aviation-cargo"
  });

  // Chargeable Weight Calculator State
  const [cargoLength, setCargoLength] = useState<number>(100);
  const [cargoWidth, setCargoWidth] = useState<number>(80);
  const [cargoHeight, setCargoHeight] = useState<number>(60);
  const [grossWeight, setGrossWeight] = useState<number>(50);
  
  // Freight Pricing State
  const [chargeableWeight, setChargeableWeight] = useState<number>(100);
  const [routeType, setRouteType] = useState<RouteType>("mediumHaul");
  const [cargoCategory, setCargoCategory] = useState<CargoCategory>("general");
  const [season, setSeason] = useState<SeasonType>("shoulder");
  const [fuelSurcharge, setFuelSurcharge] = useState<number>(25);
  
  // Dynamic Pricing State
  const [capacityUtil, setCapacityUtil] = useState<number>(65);
  const [daysUntilDep, setDaysUntilDep] = useState<number>(14);
  const [historicalDemand, setHistoricalDemand] = useState<number>(70);

  // Weight Calculator State
  const [passengerCount, setPassengerCount] = useState<number>(150);
  const [flightCat, setFlightCat] = useState<FlightCategory>("mediumHaul");
  const [checkedBagRatio, setCheckedBagRatio] = useState<number>(1.0);

  // Calculate results
  const chargeableResult = calculateChargeableWeight({
    length: cargoLength,
    width: cargoWidth,
    height: cargoHeight,
    grossWeight
  });

  const freightResult = calculateFreightPrice({
    chargeableWeight,
    routeType,
    cargoCategory,
    season,
    fuelSurchargePercent: fuelSurcharge,
    securitySurcharge: 0.05,
    handlingFee: 25,
  });

  const dynamicResult = calculateDynamicPrice(
    BASE_RATES[routeType].typical,
    {
      capacityUtilization: capacityUtil,
      daysUntilDeparture: daysUntilDep,
      competitorPriceIndex: 1.0,
      historicalDemand,
    }
  );

  const weightEstimate = estimateFlightWeight(
    passengerCount,
    flightCat,
    checkedBagRatio
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3 flex items-center gap-3">
            <Package className="h-10 w-10 text-orange-600" />
            Aviation Cargo & Weight Management
          </h1>
          <p className="mt-2 text-gray-700 text-lg">
            EASA weight standards, cargo pricing, and comprehensive weight calculations
          </p>
        </header>

        {/* Key Cargo Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Cargo Yield</p>
                  <h3 className="text-3xl font-bold text-orange-600 mt-2">$3.80</h3>
                  <p className="text-xs text-gray-500 mt-1">per FTK</p>
                </div>
                <DollarSign className="h-12 w-12 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">EASA Pax Weight</p>
                  <h3 className="text-3xl font-bold text-blue-600 mt-2">84 kg</h3>
                  <p className="text-xs text-gray-500 mt-1">Standard Adult</p>
                </div>
                <Users className="h-12 w-12 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vol. Divisor</p>
                  <h3 className="text-3xl font-bold text-green-600 mt-2">6000</h3>
                  <p className="text-xs text-gray-500 mt-1">IATA Standard</p>
                </div>
                <Scale className="h-12 w-12 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Break-Even LF</p>
                  <h3 className="text-3xl font-bold text-purple-600 mt-2">55%</h3>
                  <p className="text-xs text-gray-500 mt-1">Typical Range</p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="weight-standards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="weight-standards" className="text-xs sm:text-sm py-2">
              <Scale className="h-4 w-4 mr-1 hidden sm:inline" />
              EASA Weights
            </TabsTrigger>
            <TabsTrigger value="chargeable" className="text-xs sm:text-sm py-2">
              <Package className="h-4 w-4 mr-1 hidden sm:inline" />
              Chargeable Wt
            </TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs sm:text-sm py-2">
              <DollarSign className="h-4 w-4 mr-1 hidden sm:inline" />
              Freight Pricing
            </TabsTrigger>
            <TabsTrigger value="calculator" className="text-xs sm:text-sm py-2">
              <Calculator className="h-4 w-4 mr-1 hidden sm:inline" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="formulas" className="text-xs sm:text-sm py-2">
              <Info className="h-4 w-4 mr-1 hidden sm:inline" />
              Formulas
            </TabsTrigger>
            <TabsTrigger value="optimization" className="text-xs sm:text-sm py-2">
              <TrendingUp className="h-4 w-4 mr-1 hidden sm:inline" />
              Optimization
            </TabsTrigger>
          </TabsList>

          {/* EASA Weight Standards Tab */}
          <TabsContent value="weight-standards">
            <div className="space-y-6">
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    EASA Passenger & Baggage Weight Standards
                  </CardTitle>
                  <p className="text-blue-100 mt-2">Based on EASA Survey on Standard Weights of Passengers and Baggage</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Passenger Weights */}
                  <div>
                    <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Standard Passenger Weights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
                        <CardContent className="p-5">
                          <h4 className="font-semibold text-blue-800">Adult Male</h4>
                          <p className="text-3xl font-bold text-blue-600 mt-2">{EASA_PASSENGER_WEIGHTS.adult.male} kg</p>
                          <p className="text-sm text-gray-600 mt-1">EASA Average</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-200">
                        <CardContent className="p-5">
                          <h4 className="font-semibold text-pink-800">Adult Female</h4>
                          <p className="text-3xl font-bold text-pink-600 mt-2">{EASA_PASSENGER_WEIGHTS.adult.female} kg</p>
                          <p className="text-sm text-gray-600 mt-1">EASA Average</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
                        <CardContent className="p-5">
                          <h4 className="font-semibold text-purple-800">Weighted Average</h4>
                          <p className="text-3xl font-bold text-purple-600 mt-2">{EASA_PASSENGER_WEIGHTS.adult.average} kg</p>
                          <p className="text-sm text-gray-600 mt-1">All Adults</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
                        <CardContent className="p-5">
                          <h4 className="font-semibold text-green-800">Child (2-12 years)</h4>
                          <p className="text-3xl font-bold text-green-600 mt-2">{EASA_PASSENGER_WEIGHTS.child} kg</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
                        <CardContent className="p-5">
                          <h4 className="font-semibold text-orange-800">Infant (under 2)</h4>
                          <p className="text-3xl font-bold text-orange-600 mt-2">{EASA_PASSENGER_WEIGHTS.infant} kg</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Baggage Weights */}
                  <div>
                    <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Standard Baggage Weights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
                        <CardContent className="p-5">
                          <h4 className="font-semibold text-amber-800">Checked Bag</h4>
                          <p className="text-3xl font-bold text-amber-600 mt-2">{EASA_BAGGAGE_WEIGHTS.checkedBag} kg</p>
                          <p className="text-sm text-gray-600 mt-1">Per bag average</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-teal-50 to-white border-teal-200">
                        <CardContent className="p-5">
                          <h4 className="font-semibold text-teal-800">Cabin Bag</h4>
                          <p className="text-3xl font-bold text-teal-600 mt-2">{EASA_BAGGAGE_WEIGHTS.cabinBag} kg</p>
                          <p className="text-sm text-gray-600 mt-1">Hand luggage</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-200">
                        <CardContent className="p-5">
                          <h4 className="font-semibold text-indigo-800">Personal Item</h4>
                          <p className="text-3xl font-bold text-indigo-600 mt-2">{EASA_BAGGAGE_WEIGHTS.personalItem} kg</p>
                          <p className="text-sm text-gray-600 mt-1">Laptop, purse etc.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Flight Category Weights */}
                  <div>
                    <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                      <Plane className="h-5 w-5" />
                      Flight Category Standard Weights
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-r from-purple-100 to-pink-100">
                            <th className="p-3 text-left font-semibold border-b-2 border-purple-200">Flight Category</th>
                            <th className="p-3 text-center font-semibold border-b-2 border-purple-200">Pax Weight (kg)</th>
                            <th className="p-3 text-center font-semibold border-b-2 border-purple-200">Total Baggage (kg)</th>
                            <th className="p-3 text-center font-semibold border-b-2 border-purple-200">Service Load (kg)</th>
                            <th className="p-3 text-center font-semibold border-b-2 border-purple-200">Total/Pax (kg)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Object.keys(FLIGHT_CATEGORY_WEIGHTS) as FlightCategory[]).map((cat, idx) => (
                            <tr key={cat} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="p-3 border-b border-gray-200 font-medium capitalize">{cat.replace(/([A-Z])/g, " $1")}</td>
                              <td className="p-3 border-b border-gray-200 text-center">{FLIGHT_CATEGORY_WEIGHTS[cat].passenger}</td>
                              <td className="p-3 border-b border-gray-200 text-center">{FLIGHT_CATEGORY_WEIGHTS[cat].totalBaggage}</td>
                              <td className="p-3 border-b border-gray-200 text-center">{SERVICE_LOAD_PER_PAX[cat]}</td>
                              <td className="p-3 border-b border-gray-200 text-center font-bold text-purple-600">
                                {FLIGHT_CATEGORY_WEIGHTS[cat].passenger + FLIGHT_CATEGORY_WEIGHTS[cat].totalBaggage + SERVICE_LOAD_PER_PAX[cat]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Weight Calculator */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-blue-200">
                    <h3 className="text-xl font-bold text-blue-700 mb-4">Quick Payload Estimator</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <Label htmlFor="pax-count">Passenger Count</Label>
                        <Input
                          id="pax-count"
                          type="number"
                          value={passengerCount}
                          onChange={(e) => setPassengerCount(Number(e.target.value))}
                          min={0}
                          max={853}
                        />
                      </div>
                      <div>
                        <Label htmlFor="flight-cat">Flight Category</Label>
                        <Select value={flightCat} onValueChange={(v) => setFlightCat(v as FlightCategory)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="domestic">Domestic</SelectItem>
                            <SelectItem value="shortHaul">Short Haul</SelectItem>
                            <SelectItem value="mediumHaul">Medium Haul</SelectItem>
                            <SelectItem value="longHaul">Long Haul</SelectItem>
                            <SelectItem value="charter">Charter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="bag-ratio">Checked Bags per Pax</Label>
                        <Input
                          id="bag-ratio"
                          type="number"
                          value={checkedBagRatio}
                          onChange={(e) => setCheckedBagRatio(Number(e.target.value))}
                          min={0}
                          max={3}
                          step={0.1}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <Card className="bg-white">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-600">Passengers</p>
                          <p className="text-2xl font-bold text-blue-600">{weightEstimate.passengerWeight.toLocaleString()} kg</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-600">Baggage</p>
                          <p className="text-2xl font-bold text-green-600">{weightEstimate.baggageWeight.toLocaleString()} kg</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-600">Crew</p>
                          <p className="text-2xl font-bold text-purple-600">{weightEstimate.crewWeight.toLocaleString()} kg</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-600">Service</p>
                          <p className="text-2xl font-bold text-orange-600">{weightEstimate.serviceWeight.toLocaleString()} kg</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-blue-100">Total Payload</p>
                          <p className="text-2xl font-bold">{weightEstimate.totalPayloadWeight.toLocaleString()} kg</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chargeable Weight Tab */}
          <TabsContent value="chargeable">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Scale className="h-6 w-6" />
                  Chargeable Weight Calculator
                </CardTitle>
                <p className="text-green-100 mt-2">
                  Calculate volumetric vs gross weight to determine billable weight
                </p>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Formula Explanation */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border-2 border-green-200">
                  <h3 className="text-lg font-bold text-green-800 mb-3">IATA Volumetric Weight Formula</h3>
                  <div className="font-mono text-lg bg-white p-4 rounded-lg border border-green-200 text-center">
                    <span className="text-green-600">Volumetric Weight (kg)</span> = 
                    <span className="text-blue-600"> (L × W × H)</span> / 
                    <span className="text-purple-600">6000</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Where L, W, H are in centimeters. The divisor 6000 is the IATA standard (equivalent to 167 kg/m³).
                  </p>
                </div>

                {/* Calculator */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800">Enter Cargo Dimensions</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="length">Length (cm)</Label>
                        <Input
                          id="length"
                          type="number"
                          value={cargoLength}
                          onChange={(e) => setCargoLength(Number(e.target.value))}
                          min={1}
                        />
                      </div>
                      <div>
                        <Label htmlFor="width">Width (cm)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={cargoWidth}
                          onChange={(e) => setCargoWidth(Number(e.target.value))}
                          min={1}
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={cargoHeight}
                          onChange={(e) => setCargoHeight(Number(e.target.value))}
                          min={1}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="gross-weight">Gross Weight (kg)</Label>
                      <Input
                        id="gross-weight"
                        type="number"
                        value={grossWeight}
                        onChange={(e) => setGrossWeight(Number(e.target.value))}
                        min={0.1}
                        step={0.1}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800">Results</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">Volumetric Weight</p>
                          <p className="text-2xl font-bold text-blue-600">{chargeableResult.volumetricWeight} kg</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">Gross Weight</p>
                          <p className="text-2xl font-bold text-orange-600">{chargeableResult.grossWeight} kg</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Card className={`border-2 ${chargeableResult.chargeType === 'volumetric' ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-400' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400'}`}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Chargeable Weight</p>
                            <p className="text-3xl font-bold mt-1">{chargeableResult.chargeableWeight} kg</p>
                            <p className={`text-sm mt-1 ${chargeableResult.chargeType === 'volumetric' ? 'text-amber-600' : 'text-green-600'}`}>
                              Based on {chargeableResult.chargeType === 'volumetric' ? 'VOLUMETRIC' : 'GROSS'} weight
                            </p>
                          </div>
                          {chargeableResult.chargeType === 'volumetric' ? (
                            <AlertTriangle className="h-10 w-10 text-amber-500" />
                          ) : (
                            <CheckCircle className="h-10 w-10 text-green-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-white">
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">Actual Volume</p>
                          <p className="text-xl font-bold text-purple-600">{chargeableResult.actualVolume} m³</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white">
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">Volume Factor</p>
                          <p className="text-xl font-bold text-teal-600">{chargeableResult.volumeFactor}x</p>
                          <p className="text-xs text-gray-500">Vol/Gross ratio</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Industry Standards Reference */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Industry Volumetric Divisors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="font-semibold text-blue-600">IATA</p>
                      <p className="text-2xl font-bold">6000</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="font-semibold text-yellow-600">DHL</p>
                      <p className="text-2xl font-bold">5000</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="font-semibold text-purple-600">FedEx</p>
                      <p className="text-2xl font-bold">5000</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="font-semibold text-amber-600">UPS</p>
                      <p className="text-2xl font-bold">5000</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="font-semibold text-cyan-600">Sea</p>
                      <p className="text-2xl font-bold">1000</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Freight Pricing Tab */}
          <TabsContent value="pricing">
            <div className="space-y-6">
              <Card className="border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <DollarSign className="h-6 w-6" />
                    Air Freight Pricing Calculator
                  </CardTitle>
                  <p className="text-purple-100 mt-2">
                    Calculate freight rates with industry-standard pricing models
                  </p>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-800">Pricing Parameters</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="chargeable-wt">Chargeable Weight (kg)</Label>
                          <Input
                            id="chargeable-wt"
                            type="number"
                            value={chargeableWeight}
                            onChange={(e) => setChargeableWeight(Number(e.target.value))}
                            min={1}
                          />
                        </div>
                        <div>
                          <Label htmlFor="fuel-surcharge">Fuel Surcharge (%)</Label>
                          <Input
                            id="fuel-surcharge"
                            type="number"
                            value={fuelSurcharge}
                            onChange={(e) => setFuelSurcharge(Number(e.target.value))}
                            min={0}
                            max={100}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="route-type">Route Type</Label>
                        <Select value={routeType} onValueChange={(v) => setRouteType(v as RouteType)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="domestic">Domestic ($0.30-1.50/kg)</SelectItem>
                            <SelectItem value="shortHaul">Short Haul ($0.50-2.50/kg)</SelectItem>
                            <SelectItem value="mediumHaul">Medium Haul ($1.00-3.50/kg)</SelectItem>
                            <SelectItem value="longHaul">Long Haul ($1.50-4.50/kg)</SelectItem>
                            <SelectItem value="intercontinental">Intercontinental ($2.00-5.50/kg)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cargo-cat">Cargo Category</Label>
                          <Select value={cargoCategory} onValueChange={(v) => setCargoCategory(v as CargoCategory)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="economy">Economy (0.85x)</SelectItem>
                              <SelectItem value="general">General (1.00x)</SelectItem>
                              <SelectItem value="perishable">Perishable (1.25x)</SelectItem>
                              <SelectItem value="dangerous">Dangerous (1.50x)</SelectItem>
                              <SelectItem value="valuable">Valuable (1.75x)</SelectItem>
                              <SelectItem value="express">Express (2.00x)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="season">Season</Label>
                          <Select value={season} onValueChange={(v) => setSeason(v as SeasonType)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low Season (0.85x)</SelectItem>
                              <SelectItem value="shoulder">Shoulder (1.00x)</SelectItem>
                              <SelectItem value="peak">Peak Season (1.30x)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-800">Price Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Base Rate:</span>
                          <span className="font-bold">${freightResult.breakdown.baseRate.toFixed(2)}/kg</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Category Multiplier:</span>
                          <span className="font-bold">{freightResult.breakdown.categoryMultiplier}x</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Season Multiplier:</span>
                          <span className="font-bold">{freightResult.breakdown.seasonMultiplier}x</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-blue-700 font-medium">Adjusted Rate:</span>
                          <span className="font-bold text-blue-600">${freightResult.ratePerKg}/kg</span>
                        </div>
                      </div>
                      <div className="border-t-2 pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Base Charge ({chargeableWeight} kg × ${freightResult.ratePerKg}):</span>
                          <span className="font-semibold">${freightResult.baseCharge.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>+ Fuel Surcharge ({fuelSurcharge}%):</span>
                          <span>${freightResult.fuelSurcharge.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>+ Security Surcharge:</span>
                          <span>${freightResult.securityCharge.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>+ Handling Fee:</span>
                          <span>${freightResult.handlingFee.toLocaleString()}</span>
                        </div>
                      </div>
                      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <CardContent className="p-5">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-purple-100">Total Freight Charge</p>
                              <p className="text-3xl font-bold">${freightResult.totalCharge.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-purple-100">Effective Rate</p>
                              <p className="text-xl font-bold">${freightResult.effectiveRatePerKg}/kg</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dynamic Pricing Section */}
              <Card className="border-orange-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Dynamic Pricing Model
                  </CardTitle>
                  <p className="text-orange-100 mt-2">
                    Demand-based pricing optimization
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-800">Market Factors</h3>
                      <div>
                        <Label>Capacity Utilization: {capacityUtil}%</Label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={capacityUtil}
                          onChange={(e) => setCapacityUtil(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <Label>Days Until Departure: {daysUntilDep}</Label>
                        <input
                          type="range"
                          min={1}
                          max={60}
                          value={daysUntilDep}
                          onChange={(e) => setDaysUntilDep(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <Label>Historical Demand: {historicalDemand}%</Label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={historicalDemand}
                          onChange={(e) => setHistoricalDemand(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-800">Pricing Recommendation</h3>
                      <Card className={`border-2 ${
                        dynamicResult.recommendation === 'surge' ? 'bg-red-50 border-red-400' :
                        dynamicResult.recommendation === 'premium' ? 'bg-orange-50 border-orange-400' :
                        dynamicResult.recommendation === 'discount' ? 'bg-green-50 border-green-400' :
                        'bg-blue-50 border-blue-400'
                      }`}>
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                              dynamicResult.recommendation === 'surge' ? 'bg-red-200 text-red-800' :
                              dynamicResult.recommendation === 'premium' ? 'bg-orange-200 text-orange-800' :
                              dynamicResult.recommendation === 'discount' ? 'bg-green-200 text-green-800' :
                              'bg-blue-200 text-blue-800'
                            }`}>
                              {dynamicResult.recommendation}
                            </span>
                            <span className="text-2xl font-bold">{dynamicResult.priceMultiplier}x</span>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Recommended Rate</p>
                            <p className="text-3xl font-bold">${dynamicResult.recommendedRate}/kg</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="text-center p-2 bg-white rounded">
                              <p className="text-xs text-gray-500">Demand Score</p>
                              <p className="font-bold">{dynamicResult.demandScore}%</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded">
                              <p className="text-xs text-gray-500">Urgency Score</p>
                              <p className="font-bold">{dynamicResult.urgencyScore}%</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cargo Calculator Tab */}
          <TabsContent value="calculator">
            <CargoCalculator />
          </TabsContent>

          {/* Formulas Tab */}
          <TabsContent value="formulas">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
                <CardTitle className="text-2xl">Essential Cargo Calculations</CardTitle>
                <p className="text-gray-600 mt-2">Key formulas for cargo revenue and cost analysis</p>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h3 className="text-xl font-bold text-green-700 mb-4">Take-Off Weight Formula</h3>
                  <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border-2 border-blue-200 shadow-md">
                    <h4 className="font-semibold">Total Take-Off Weight (TOW)</h4>
                    <div className="font-mono text-lg mt-2 bg-white p-4 rounded border border-blue-200">
                      TOW = BEW + Payload + Fuel Weight
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <p><strong>BEW</strong> = Basic Empty Weight (aircraft structure, engines, systems)</p>
                      <p><strong>Payload</strong> = Passengers + Baggage + Cargo + Service Load</p>
                      <p><strong>Fuel Weight</strong> = Block Fuel (trip + reserve + contingency)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-green-700 mb-4">Revenue Calculations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border-2 border-blue-200 shadow-md">
                      <h4 className="font-semibold">Cargo Yield</h4>
                      <p className="text-sm mt-2">Revenue per freight ton-kilometer</p>
                      <div className="font-mono text-sm mt-1 space-y-1">
                        <p>Yield = Revenue / FTK</p>
                        <p>Example: $600,000 / 150,000 = $4 per FTK</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-lg border-2 border-green-200 shadow-md">
                      <h4 className="font-semibold">Break-Even Load Factor</h4>
                      <p className="text-sm mt-2">Minimum load required for profitability</p>
                      <div className="font-mono text-sm mt-1 space-y-1 bg-white p-3 rounded border border-green-200">
                        <p>BELF = (Operating Cost / Revenue) × 100%</p>
                        <p className="text-green-600">Example: ($500,000 / $600,000) × 100% = 83.3%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-green-700 mb-4">Fuel Efficiency Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-lg border-2 border-purple-200 shadow-md">
                      <h4 className="font-semibold">Fuel Burn per Ton-Kilometer</h4>
                      <div className="font-mono text-sm mt-1 space-y-1 bg-white p-3 rounded border border-purple-200">
                        <p>FBTK = Total Fuel Burn / Total FTK</p>
                        <p className="text-purple-600">Example: 120,000 kg / 150,000 = 0.8 kg/ton-km</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-lg border-2 border-orange-200 shadow-md">
                      <h4 className="font-semibold">Fuel Cost per Ton-Kilometer</h4>
                      <div className="font-mono text-sm mt-1 space-y-1">
                        <p>FCTK = FBTK × Fuel Price</p>
                        <p>Example: 0.8 kg/ton-km × $0.90/kg = $0.72/ton-km</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization">
            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-2xl">Cargo Optimization Strategies</CardTitle>
                <p className="text-gray-600 mt-2">Advanced techniques for maximizing cargo efficiency and profitability</p>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h3 className="text-xl font-bold text-purple-700 mb-4">ULD Optimization</h3>
                  <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border-2 border-blue-200 shadow-md mt-2">
                    <h4 className="font-semibold">ULD Load Factor Calculation</h4>
                    <div className="font-mono text-sm mt-1 space-y-1">
                      <p>ULD Load Factor = (Actual Load / Max ULD Capacity) × 100%</p>
                      <p>Example: (4,000 kg / 5,000 kg) × 100% = 80%</p>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-semibold">Optimization Tips:</h5>
                      <ul className="list-disc pl-4 mt-2 text-sm">
                        <li>Balance weight and volume constraints</li>
                        <li>Consider cargo density and stackability</li>
                        <li>Plan for weight distribution</li>
                        <li>Optimize loading sequence</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-purple-700 mb-4">Dynamic Pricing Strategy</h3>
                  <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-lg border-2 border-green-200 shadow-md mt-2">
                    <h4 className="font-semibold">Dynamic Rate Calculation</h4>
                    <div className="font-mono text-sm mt-1 space-y-1">
                      <p>Final Rate = Base Rate × (1 + Fuel Surcharge) × (1 + Demand Factor)</p>
                      <p>Example: $2.00 × (1 + 10%) × (1 + 15%) = $2.53 per kg</p>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-semibold">Pricing Factors:</h5>
                      <ul className="list-disc pl-4 mt-2 text-sm">
                        <li>Current market demand</li>
                        <li>Fuel price fluctuations</li>
                        <li>Seasonal variations</li>
                        <li>Competitor pricing</li>
                        <li>Route profitability</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-purple-700 mb-4">Cost-Plus vs Demand Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border-2 border-blue-200 shadow-md">
                      <h4 className="font-semibold text-blue-800">Cost-Plus Pricing</h4>
                      <p className="text-sm mt-2 text-gray-600">Add margin to operating costs</p>
                      <div className="font-mono text-xs mt-2 bg-white p-2 rounded">
                        Price = (Fuel + Handling + Security + Depreciation) × (1 + Margin%)
                      </div>
                      <ul className="list-disc pl-4 mt-3 text-sm text-gray-700">
                        <li>Predictable profitability</li>
                        <li>Simple to calculate</li>
                        <li>May miss market opportunities</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-lg border-2 border-orange-200 shadow-md">
                      <h4 className="font-semibold text-orange-800">Demand-Based Pricing</h4>
                      <p className="text-sm mt-2 text-gray-600">Adjust based on market conditions</p>
                      <div className="font-mono text-xs mt-2 bg-white p-2 rounded">
                        Price = Base × Capacity Factor × Urgency × Demand
                      </div>
                      <ul className="list-disc pl-4 mt-3 text-sm text-gray-700">
                        <li>Maximizes revenue</li>
                        <li>Responds to market</li>
                        <li>Requires sophisticated systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
