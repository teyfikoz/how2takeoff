import React, { useState, useMemo } from "react";
import {
  LineChart, Line, ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import FilterForm from "@/components/aircraft/FilterForm";
import ComparisonCharts from "@/components/aircraft/ComparisonCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Aircraft } from "@shared/schema";
import { ArrowRight, Wind, ArrowUpRight, ArrowRight as ArrowRightIcon, Plane, TrendingUp, Scale, Users, Fuel, CheckCircle, AlertTriangle } from "lucide-react";
import WindImpactChart from "@/components/aircraft/WindImpactChart";
import DonationBanner from "@/components/DonationBanner";
import { InContentAd, FooterAd, SidebarAd } from "@/components/AdSense";
import { useSEO } from "@/hooks/useSEO";
import { mockAircraftData } from "@/data/mockAircraftData";
import {
  estimateFlightWeight,
  type FlightCategory,
} from "@/lib/weight-utils";

interface FilterCriteria {
  passengers: number;
  cargo: number;
  range: number;
  alternateRange: number;
  windSpeed: number;
  windDirection: number;
}

// Sample aircraft weight data for demonstration
const AIRCRAFT_WEIGHT_DATA: Record<string, { bew: number; mtow: number; mzfw: number; mlw: number; fuelCapacity: number }> = {
  "Airbus A320-200": { bew: 42600, mtow: 78000, mzfw: 64300, mlw: 67400, fuelCapacity: 24210 },
  "Airbus A321-200": { bew: 48500, mtow: 93500, mzfw: 75600, mlw: 77800, fuelCapacity: 24050 },
  "Airbus A330-300": { bew: 124500, mtow: 242000, mzfw: 178000, mlw: 187000, fuelCapacity: 97530 },
  "Airbus A350-900": { bew: 115700, mtow: 280000, mzfw: 192000, mlw: 207000, fuelCapacity: 141000 },
  "Boeing 737-800": { bew: 41413, mtow: 79016, mzfw: 61689, mlw: 66361, fuelCapacity: 26025 },
  "Boeing 737 MAX 8": { bew: 45070, mtow: 82191, mzfw: 66044, mlw: 69309, fuelCapacity: 25816 },
  "Boeing 777-300ER": { bew: 167829, mtow: 351534, mzfw: 238000, mlw: 251290, fuelCapacity: 181283 },
  "Boeing 787-9": { bew: 128850, mtow: 254011, mzfw: 181000, mlw: 192777, fuelCapacity: 126372 },
  "Embraer E195": { bew: 28970, mtow: 52290, mzfw: 45200, mlw: 48790, fuelCapacity: 13986 },
};

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

export default function Dashboard() {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria | null>(null);
  
  // Weight Calculator State
  const [selectedAircraft, setSelectedAircraft] = useState<string>("Airbus A320-200");
  const [passengerCount, setPassengerCount] = useState<number>(150);
  const [flightCategory, setFlightCategory] = useState<FlightCategory>("mediumHaul");
  const [cargoWeight, setCargoWeight] = useState<number>(2000);
  const [fuelLoad, setFuelLoad] = useState<number>(15000);

  useSEO({
    title: "Aviation Analysis Dashboard - How2TakeOff",
    description: "Find the most suitable aircraft types based on your flight requirements and analyze detailed comparisons. Advanced wind impact analysis, weight modelling, and performance metrics.",
    keywords: "aviation dashboard, aircraft comparison, flight planning, wind impact analysis, aviation analytics, weight and balance, take-off weight",
    canonical: "https://how2takeoff.com/"
  });

  const { data: aircraftData = mockAircraftData } = useQuery<typeof mockAircraftData>({
    queryKey: ["/api/aircraft"],
    initialData: mockAircraftData,
  });

  const calculateEffectiveRange = (aircraft: Aircraft, windSpeed: number, windDirection: number) => {
    const windRadians = (windDirection * Math.PI) / 180;
    const windEffect = Math.cos(windRadians) * windSpeed;
    const effectiveSpeed = aircraft.cruiseSpeed - windEffect;
    return aircraft.maxRange * (effectiveSpeed / aircraft.cruiseSpeed);
  };

  const filteredAircraft = useMemo(() => {
    if (!filterCriteria || !aircraftData) return [];

    return aircraftData.filter((aircraft: Aircraft) => {
      const passengerCheck = filterCriteria.passengers <= aircraft.maxPassengers;
      const cargoCheck = filterCriteria.cargo <= aircraft.cargoCapacity;

      const effectiveRange = calculateEffectiveRange(
        aircraft,
        filterCriteria.windSpeed,
        filterCriteria.windDirection
      );

      const maxRequiredRange = Math.max(filterCriteria.range, filterCriteria.alternateRange);
      const rangeCheck = maxRequiredRange <= effectiveRange;

      return passengerCheck && cargoCheck && rangeCheck;
    });
  }, [aircraftData, filterCriteria]);

  const handleFilter = (criteria: FilterCriteria) => {
    setFilterCriteria(criteria);
  };

  // Calculate weight breakdown
  const aircraftWeights = AIRCRAFT_WEIGHT_DATA[selectedAircraft] || AIRCRAFT_WEIGHT_DATA["Airbus A320-200"];
  const payloadEstimate = estimateFlightWeight(passengerCount, flightCategory, 1.0);
  
  const zeroFuelWeight = aircraftWeights.bew + payloadEstimate.totalPayloadWeight + cargoWeight;
  const takeOffWeight = zeroFuelWeight + fuelLoad;
  
  const withinMTOW = takeOffWeight <= aircraftWeights.mtow;
  const withinMZFW = zeroFuelWeight <= aircraftWeights.mzfw;
  const mtowMargin = aircraftWeights.mtow - takeOffWeight;
  const mzfwMargin = aircraftWeights.mzfw - zeroFuelWeight;

  const weightBreakdownData = [
    { name: "Basic Empty", value: aircraftWeights.bew, color: "#3B82F6" },
    { name: "Passengers", value: payloadEstimate.passengerWeight, color: "#10B981" },
    { name: "Baggage", value: payloadEstimate.baggageWeight, color: "#8B5CF6" },
    { name: "Cargo", value: cargoWeight, color: "#F59E0B" },
    { name: "Fuel", value: fuelLoad, color: "#EF4444" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 flex items-center justify-center lg:justify-start gap-3">
            <Plane className="h-10 w-10 text-blue-600" />
            Aviation Analysis Dashboard
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Find the most suitable aircraft types based on your flight requirements and analyze detailed comparisons.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <FilterForm onFilter={handleFilter} />

            {/* Weight Modelling Section */}
            <Card className="border-2 border-orange-200 shadow-xl bg-gradient-to-br from-white to-orange-50">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Scale className="h-6 w-6" />
                  Take-Off Weight Modelling
                </CardTitle>
                <p className="text-orange-100 mt-1 text-sm">EASA standard weights for flight planning</p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input Section */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="aircraft-select">Aircraft Type</Label>
                      <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(AIRCRAFT_WEIGHT_DATA).map(name => (
                            <SelectItem key={name} value={name}>{name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pax-count">Passengers</Label>
                        <Input
                          id="pax-count"
                          type="number"
                          value={passengerCount}
                          onChange={(e) => setPassengerCount(Number(e.target.value))}
                          min={0}
                          max={500}
                        />
                      </div>
                      <div>
                        <Label htmlFor="flight-cat">Flight Category</Label>
                        <Select value={flightCategory} onValueChange={(v) => setFlightCategory(v as FlightCategory)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="domestic">Domestic</SelectItem>
                            <SelectItem value="shortHaul">Short Haul</SelectItem>
                            <SelectItem value="mediumHaul">Medium Haul</SelectItem>
                            <SelectItem value="longHaul">Long Haul</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cargo-wt">Additional Cargo (kg)</Label>
                        <Input
                          id="cargo-wt"
                          type="number"
                          value={cargoWeight}
                          onChange={(e) => setCargoWeight(Number(e.target.value))}
                          min={0}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fuel-load">Fuel Load (kg)</Label>
                        <Input
                          id="fuel-load"
                          type="number"
                          value={fuelLoad}
                          onChange={(e) => setFuelLoad(Number(e.target.value))}
                          min={0}
                          max={aircraftWeights.fuelCapacity}
                        />
                      </div>
                    </div>

                    {/* Weight Breakdown Cards */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-3 text-center">
                          <p className="text-xs text-gray-600">BEW</p>
                          <p className="text-lg font-bold text-blue-600">{aircraftWeights.bew.toLocaleString()} kg</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-3 text-center">
                          <p className="text-xs text-gray-600">Pax + Bag</p>
                          <p className="text-lg font-bold text-green-600">{(payloadEstimate.passengerWeight + payloadEstimate.baggageWeight).toLocaleString()} kg</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="p-3 text-center">
                          <p className="text-xs text-gray-600">Cargo</p>
                          <p className="text-lg font-bold text-purple-600">{cargoWeight.toLocaleString()} kg</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-3 text-center">
                          <p className="text-xs text-gray-600">Fuel</p>
                          <p className="text-lg font-bold text-red-600">{fuelLoad.toLocaleString()} kg</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="space-y-4">
                    {/* Weight Chart */}
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={weightBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {weightBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            formatter={(value: number) => [`${value.toLocaleString()} kg`, ""]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Results Cards */}
                    <Card className={`border-2 ${withinMZFW ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Zero Fuel Weight (ZFW)</p>
                            <p className="text-2xl font-bold">{zeroFuelWeight.toLocaleString()} kg</p>
                            <p className="text-xs text-gray-500">MZFW: {aircraftWeights.mzfw.toLocaleString()} kg</p>
                          </div>
                          {withinMZFW ? (
                            <div className="text-green-600 text-right">
                              <CheckCircle className="h-8 w-8" />
                              <p className="text-sm font-medium">+{mzfwMargin.toLocaleString()} kg</p>
                            </div>
                          ) : (
                            <div className="text-red-600 text-right">
                              <AlertTriangle className="h-8 w-8" />
                              <p className="text-sm font-medium">{mzfwMargin.toLocaleString()} kg</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={`border-2 ${withinMTOW ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Take-Off Weight (TOW)</p>
                            <p className="text-2xl font-bold">{takeOffWeight.toLocaleString()} kg</p>
                            <p className="text-xs text-gray-500">MTOW: {aircraftWeights.mtow.toLocaleString()} kg</p>
                          </div>
                          {withinMTOW ? (
                            <div className="text-green-600 text-right">
                              <CheckCircle className="h-8 w-8" />
                              <p className="text-sm font-medium">+{mtowMargin.toLocaleString()} kg</p>
                            </div>
                          ) : (
                            <div className="text-red-600 text-right">
                              <AlertTriangle className="h-8 w-8" />
                              <p className="text-sm font-medium">{mtowMargin.toLocaleString()} kg</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {filteredAircraft.length > 0 ? (
              <>
                <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      Suitable Aircraft Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredAircraft.map((aircraft: Aircraft) => (
                        <Card 
                          key={aircraft.id} 
                          className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50"
                        >
                          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white pb-4">
                            <CardTitle className="text-xl font-bold">{aircraft.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Max Passengers:</span>
                                <span className="font-bold text-blue-700">{aircraft.maxPassengers}</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Cargo Capacity:</span>
                                <span className="font-bold text-green-700">{aircraft.cargoCapacity.toLocaleString()} kg</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Range:</span>
                                <span className="font-bold text-purple-700">{aircraft.maxRange.toLocaleString()} km</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Fuel Efficiency:</span>
                                <span className="font-bold text-orange-700">{(aircraft.fuelEfficiency * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <WindImpactChart aircraftData={filteredAircraft} />

                <Card className="border-2 border-purple-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl">Performance Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <ComparisonCharts aircraftData={filteredAircraft} />
                  </CardContent>
                </Card>

                <InContentAd />
              </>
            ) : filterCriteria ? (
              <Card className="border-2 border-red-200 shadow-xl bg-gradient-to-br from-white to-red-50">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">✈️</div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">No Matching Aircraft Found</h3>
                    <p className="text-gray-600 text-lg mb-6">
                      The search criteria exceed available aircraft capabilities:
                    </p>
                    <div className="mt-6 text-left max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border-2 border-gray-200">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                          <span className="font-medium">Passengers:</span>
                          <span className="font-bold text-blue-700">{filterCriteria.passengers}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                          <span className="font-medium">Cargo:</span>
                          <span className="font-bold text-green-700">{filterCriteria.cargo.toLocaleString()} kg</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                          <span className="font-medium">Range:</span>
                          <span className="font-bold text-purple-700">{filterCriteria.range.toLocaleString()} km</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                          <span className="font-medium">Wind Speed:</span>
                          <span className="font-bold text-orange-700">{filterCriteria.windSpeed} knots</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-pink-50 rounded-lg">
                          <span className="font-medium">Wind Direction:</span>
                          <span className="font-bold text-pink-700">{filterCriteria.windDirection}°</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-80 space-y-6">
            <SidebarAd />
            <Card className="border-2 border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <CardTitle className="text-lg">💡 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700 font-medium">
                    Use alternateRange for safety margin
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-gray-700 font-medium">
                    Consider wind impact on fuel consumption
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <p className="text-gray-700 font-medium">
                    Compare multiple aircraft for best efficiency
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <p className="text-gray-700 font-medium">
                    EASA weights include 84kg per adult passenger
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Weight Reference Card */}
            <Card className="border-2 border-orange-200 shadow-lg bg-gradient-to-br from-white to-orange-50">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  EASA Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Adult (avg):</span>
                  <span className="font-bold">84 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Child (2-12):</span>
                  <span className="font-bold">35 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Checked Bag:</span>
                  <span className="font-bold">15 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cabin Bag:</span>
                  <span className="font-bold">6 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vol Divisor:</span>
                  <span className="font-bold">6000</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <FooterAd />

        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-6">
          <p className="text-base font-medium">Data based on BADA (Base of Aircraft Data) model & EASA Standards</p>
          <p className="mt-2">© Aviation Performance Analytics</p>
          
          <DonationBanner />
        </footer>
      </div>
    </div>
  );
}
