import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import {
  Plane, TrendingUp, Calculator, PlaneTakeoff, PlaneLanding,
  Banknote, Users, Activity, Percent, MoveHorizontal, CalendarClock,
  Info, Globe, Building2, ArrowUpFromLine, Map, Ticket, DollarSign
} from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSEO } from '@/hooks/useSEO';
import { HeaderAd, InContentAd } from '@/components/AdSense';
// Mock veri kullanımı için import
import { mockAircraftData } from '@/data/mockAircraftData';
// Import comprehensive airport database
import { AIRPORTS, Airport as AirportType } from '@/data/airports-db';

// Define a comprehensive aircraft database - All data is real from manufacturer specifications
const AIRCRAFT_DATA = {
  // Boeing Narrow-body
  "Boeing 737-700": { range_km: 6390, fuel_burn_km: 2.2, min_runway: 1830, seats: 149, cruise_speed: 842, category: "Narrow-body" },
  "Boeing 737-800": { range_km: 5665, fuel_burn_km: 2.3, min_runway: 1800, seats: 189, cruise_speed: 842, category: "Narrow-body" },
  "Boeing 737-900ER": { range_km: 5925, fuel_burn_km: 2.4, min_runway: 2200, seats: 220, cruise_speed: 842, category: "Narrow-body" },
  "Boeing 737 MAX 8": { range_km: 6570, fuel_burn_km: 2.0, min_runway: 2200, seats: 210, cruise_speed: 839, category: "Narrow-body" },
  "Boeing 737 MAX 9": { range_km: 6570, fuel_burn_km: 2.1, min_runway: 2300, seats: 220, cruise_speed: 839, category: "Narrow-body" },
  "Boeing 737 MAX 10": { range_km: 6110, fuel_burn_km: 2.2, min_runway: 2500, seats: 230, cruise_speed: 839, category: "Narrow-body" },
  "Boeing 757-200": { range_km: 7222, fuel_burn_km: 3.1, min_runway: 1920, seats: 239, cruise_speed: 850, category: "Narrow-body" },

  // Boeing Wide-body
  "Boeing 767-300ER": { range_km: 11070, fuel_burn_km: 5.2, min_runway: 2900, seats: 269, cruise_speed: 851, category: "Wide-body" },
  "Boeing 777-200ER": { range_km: 14800, fuel_burn_km: 7.8, min_runway: 2440, seats: 396, cruise_speed: 905, category: "Wide-body" },
  "Boeing 777-300ER": { range_km: 13649, fuel_burn_km: 8.5, min_runway: 3050, seats: 451, cruise_speed: 905, category: "Wide-body" },
  "Boeing 777-9": { range_km: 13500, fuel_burn_km: 7.9, min_runway: 3050, seats: 426, cruise_speed: 905, category: "Wide-body" },
  "Boeing 787-8": { range_km: 13530, fuel_burn_km: 5.6, min_runway: 2600, seats: 290, cruise_speed: 910, category: "Wide-body" },
  "Boeing 787-9": { range_km: 14140, fuel_burn_km: 5.9, min_runway: 2800, seats: 330, cruise_speed: 910, category: "Wide-body" },
  "Boeing 787-10": { range_km: 11730, fuel_burn_km: 6.2, min_runway: 2800, seats: 370, cruise_speed: 910, category: "Wide-body" },
  "Boeing 747-8": { range_km: 14320, fuel_burn_km: 12.6, min_runway: 3050, seats: 524, cruise_speed: 910, category: "Wide-body" },

  // Airbus Narrow-body
  "Airbus A319": { range_km: 6950, fuel_burn_km: 2.3, min_runway: 1950, seats: 160, cruise_speed: 840, category: "Narrow-body" },
  "Airbus A320": { range_km: 6300, fuel_burn_km: 2.5, min_runway: 2000, seats: 180, cruise_speed: 840, category: "Narrow-body" },
  "Airbus A320neo": { range_km: 6500, fuel_burn_km: 2.2, min_runway: 2000, seats: 180, cruise_speed: 840, category: "Narrow-body" },
  "Airbus A321": { range_km: 7400, fuel_burn_km: 2.6, min_runway: 2100, seats: 220, cruise_speed: 840, category: "Narrow-body" },
  "Airbus A321neo": { range_km: 7400, fuel_burn_km: 2.3, min_runway: 2100, seats: 220, cruise_speed: 840, category: "Narrow-body" },
  "Airbus A321LR": { range_km: 7400, fuel_burn_km: 2.4, min_runway: 2150, seats: 206, cruise_speed: 840, category: "Narrow-body" },
  "Airbus A321XLR": { range_km: 8700, fuel_burn_km: 2.5, min_runway: 2180, seats: 206, cruise_speed: 840, category: "Narrow-body" },

  // Airbus Wide-body
  "Airbus A330-300": { range_km: 11750, fuel_burn_km: 6.8, min_runway: 2770, seats: 335, cruise_speed: 871, category: "Wide-body" },
  "Airbus A330-900neo": { range_km: 13334, fuel_burn_km: 5.8, min_runway: 2770, seats: 310, cruise_speed: 912, category: "Wide-body" },
  "Airbus A350-900": { range_km: 16100, fuel_burn_km: 6.4, min_runway: 2500, seats: 350, cruise_speed: 910, category: "Wide-body" },
  "Airbus A350-1000": { range_km: 15600, fuel_burn_km: 7.2, min_runway: 2750, seats: 410, cruise_speed: 910, category: "Wide-body" },
  "Airbus A380": { range_km: 15200, fuel_burn_km: 14.5, min_runway: 2900, seats: 853, cruise_speed: 903, category: "Wide-body" },

  // Regional Jets
  "Embraer E170": { range_km: 4600, fuel_burn_km: 1.8, min_runway: 1650, seats: 78, cruise_speed: 780, category: "Regional" },
  "Embraer E175": { range_km: 3889, fuel_burn_km: 1.9, min_runway: 1644, seats: 88, cruise_speed: 830, category: "Regional" },
  "Embraer E190": { range_km: 4537, fuel_burn_km: 2.1, min_runway: 1760, seats: 114, cruise_speed: 830, category: "Regional" },
};

// Airport database is now imported from airports-db.ts
// Includes 484 major international and domestic airports worldwide
// Covering all continents with IATA codes and scheduled service

// Function to calculate distance using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Function to check aircraft suitability
function checkAircraftSuitability(distance: number, runway: number, aircraftType: string): boolean {
  const aircraft = AIRCRAFT_DATA[aircraftType as keyof typeof AIRCRAFT_DATA];
  return aircraft.range_km >= distance && aircraft.min_runway <= runway;
}

// Function to calculate exact break-even load factor
function calculateBreakEven(distance: number, aircraftType: string, rask: number, cask: number, fuelPrice: number): number {
  const aircraft = AIRCRAFT_DATA[aircraftType as keyof typeof AIRCRAFT_DATA];
  const ASK = distance * aircraft.seats;
  const fuelCost = aircraft.fuel_burn_km * fuelPrice * distance;
  const operatingCost = cask * ASK;
  const totalFixedCost = operatingCost + fuelCost;

  // Break-even when Revenue = Cost
  // Revenue = RASK × RPK = RASK × (ASK × loadFactor)
  // totalFixedCost = RASK × ASK × loadFactor
  // loadFactor = totalFixedCost / (RASK × ASK)
  const breakEvenLoadFactor = totalFixedCost / (rask * ASK);

  return Math.min(1.0, Math.max(0, breakEvenLoadFactor));
}

// Function to analyze profitability and environmental impact
function analyzeProfit(distance: number, aircraftType: string, loadFactor: number, rask: number, cask: number, fuelPrice: number) {
  const aircraft = AIRCRAFT_DATA[aircraftType as keyof typeof AIRCRAFT_DATA];
  const ASK = distance * aircraft.seats;
  const RPK = ASK * loadFactor;
  const revenue = rask * RPK;
  const fuelCost = aircraft.fuel_burn_km * fuelPrice * distance;
  const operatingCost = cask * ASK;
  const cost = operatingCost + fuelCost;

  // Calculate emissions (simplified model: ~3.16kg CO2 per kg fuel, fuel density ~0.8kg/L)
  const fuelConsumptionLiters = aircraft.fuel_burn_km * distance;
  const fuelConsumptionKg = fuelConsumptionLiters * 0.8;
  const totalCO2 = fuelConsumptionKg * 3.16;

  // Calculate per passenger emissions
  const passengerCount = aircraft.seats * loadFactor;
  const co2PerPassenger = totalCO2 / passengerCount;

  // Calculate environmental score (0-100, 100 is best)
  // Based on typical efficiency metrics (about 75-150g CO2/passenger-km is good)
  const co2PerPassengerKm = co2PerPassenger / distance;
  let environmentalScore = 100 - Math.min(100, co2PerPassengerKm * 100 / 15);
  environmentalScore = Math.max(0, Math.round(environmentalScore));

  // Carbon offset cost calculation
  // Average carbon credit price: $25 per tonne CO2
  const carbonPricePerTonne = 25;
  const totalCO2Tonnes = totalCO2 / 1000;
  const carbonOffsetCost = totalCO2Tonnes * carbonPricePerTonne;
  const carbonOffsetPerPassenger = carbonOffsetCost / passengerCount;

  // Calculate exact break-even load factor
  const breakEvenLoadFactor = calculateBreakEven(distance, aircraftType, rask, cask, fuelPrice);

  return {
    revenue,
    cost,
    fuelCost,
    operatingCost,
    profit: revenue - cost,
    breakEvenLoadFactor,
    emissions: {
      totalCO2,
      co2PerPassenger,
      co2PerPassengerKm,
      environmentalScore,
      carbonOffsetCost,
      carbonOffsetPerPassenger
    }
  };
}

// Function to predict passenger type
function predictPassengerType(day: string, season: string, timeOfDay: string, bookingType: string): string {
  const businessDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const businessTimes = ['morning', 'evening'];
  const businessSeasons = ['spring', 'fall', 'winter'];
  const leisureSeasons = ['summer', 'holiday'];
  
  let businessScore = 0;
  let leisureScore = 0;
  
  // Day scoring
  if (businessDays.includes(day)) {
    businessScore += 2;
  } else {
    leisureScore += 2;
  }
  
  // Time scoring
  if (businessTimes.includes(timeOfDay)) {
    businessScore += 1;
  } else {
    leisureScore += 1;
  }
  
  // Season scoring
  if (businessSeasons.includes(season)) {
    businessScore += 1;
  }
  if (leisureSeasons.includes(season)) {
    leisureScore += 2;
  }
  
  // Booking type
  if (bookingType === 'last_minute') {
    businessScore += 2;
  } else if (bookingType === 'early') {
    leisureScore += 2;
  }
  
  if (businessScore > leisureScore) {
    return "Business";
  } else if (leisureScore > businessScore) {
    return "Leisure";
  } else {
    return "Mixed";
  }
}

export default function FlightEstimator() {
  useSEO({
    title: 'Flight Estimator - Route Profitability & Feasibility Analysis - How2TakeOff',
    description: 'Comprehensive flight estimator tool for analyzing route profitability, aircraft feasibility, passenger demand, and environmental impact. Calculate revenue, costs, and emissions for any route.',
    keywords: 'flight estimator, route profitability, flight feasibility, aircraft analysis, aviation calculator, flight planning tool, aviation revenue management',
    canonical: 'https://how2takeoff.com/flight-estimator'
  });

  // State for basic inputs
  const [originIATA, setOriginIATA] = useState('JFK');
  const [destIATA, setDestIATA] = useState('LHR');
  const [aircraft, setAircraft] = useState('Airbus A320');
  const [runwayLength, setRunwayLength] = useState(3000);

  // State for airport search
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');

  // Filtered airports based on search
  const filteredOriginAirports = originSearch.length > 0
    ? AIRPORTS.filter(a =>
        a.iata.toLowerCase().includes(originSearch.toLowerCase()) ||
        a.city.toLowerCase().includes(originSearch.toLowerCase()) ||
        a.name.toLowerCase().includes(originSearch.toLowerCase()) ||
        a.country.toLowerCase().includes(originSearch.toLowerCase())
      ).slice(0, 100)
    : AIRPORTS;

  const filteredDestAirports = destSearch.length > 0
    ? AIRPORTS.filter(a =>
        a.iata.toLowerCase().includes(destSearch.toLowerCase()) ||
        a.city.toLowerCase().includes(destSearch.toLowerCase()) ||
        a.name.toLowerCase().includes(destSearch.toLowerCase()) ||
        a.country.toLowerCase().includes(destSearch.toLowerCase())
      ).slice(0, 100)
    : AIRPORTS;
  
  // State for economic inputs
  const [loadFactor, setLoadFactor] = useState(0.75);
  const [rask, setRASK] = useState(0.10);
  const [cask, setCASK] = useState(0.08);
  const [fuelPrice, setFuelPrice] = useState(1.2);
  
  // State for passenger prediction
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [seasonType, setSeasonType] = useState('summer');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [bookingType, setBookingType] = useState('early');
  const [routeType, setRouteType] = useState('mixed');
  const [priceSensitivity, setPriceSensitivity] = useState('medium');

  // Analysis results
  const [distance, setDistance] = useState(0);
  const [flightTime, setFlightTime] = useState(0);
  const [suitable, setSuitable] = useState(false);
  const [profitAnalysis, setProfitAnalysis] = useState({
    revenue: 0,
    cost: 0,
    fuelCost: 0,
    operatingCost: 0,
    profit: 0,
    breakEvenLoadFactor: 0,
    emissions: {
      totalCO2: 0,
      co2PerPassenger: 0,
      co2PerPassengerKm: 0,
      environmentalScore: 0,
      carbonOffsetCost: 0,
      carbonOffsetPerPassenger: 0
    }
  });
  const [passengerType, setPassengerType] = useState('');
  
  // Profitability data for different load factors
  const [profitData, setProfitData] = useState<Array<{loadFactor: number, profit: number, revenue: number, cost: number}>>([]);
  const [aircraftComparisonData, setAircraftComparisonData] = useState<Array<{
    type: string,
    profit: number,
    seats: number,
    fuelEfficiency: number,
    costPerSeat: number,
    revenuePerSeat: number,
    category: string
  }>>([]);
  
  // Dropdown options
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const seasons = ['spring', 'summer', 'fall', 'winter', 'holiday'];
  const timesOfDay = ['morning', 'afternoon', 'evening', 'night'];
  const bookingTypes = ['early', 'regular', 'last_minute'];
  const routeTypes = ['business', 'leisure', 'mixed'];
  const priceSensitivityLevels = ['low', 'medium', 'high'];

  // Auto-populate runway length when aircraft is selected
  useEffect(() => {
    if (aircraft) {
      const selectedAircraft = AIRCRAFT_DATA[aircraft as keyof typeof AIRCRAFT_DATA];
      if (selectedAircraft && selectedAircraft.min_runway) {
        setRunwayLength(selectedAircraft.min_runway);
      }
    }
  }, [aircraft]);

  // Effect to run analysis when inputs change
  useEffect(() => {
    performAnalysis();
  }, [
    originIATA, destIATA, aircraft, runwayLength,
    loadFactor, rask, cask, fuelPrice,
    dayOfWeek, seasonType, timeOfDay, bookingType
  ]);
  
  // Main analysis function
  const performAnalysis = () => {
    const origin = AIRPORTS.find(a => a.iata === originIATA);
    const destination = AIRPORTS.find(a => a.iata === destIATA);
    
    if (origin && destination) {
      // Calculate distance
      const dist = calculateDistance(origin.lat, origin.lon, destination.lat, destination.lon);
      setDistance(Math.round(dist));
      
      // Calculate flight time
      const selectedAircraft = AIRCRAFT_DATA[aircraft as keyof typeof AIRCRAFT_DATA];
      const timeHrs = dist / selectedAircraft.cruise_speed;
      setFlightTime(timeHrs);
      
      // Check if aircraft is suitable
      const isSuitable = checkAircraftSuitability(dist, runwayLength, aircraft);
      setSuitable(isSuitable);
      
      // Analyze profitability
      const profit = analyzeProfit(dist, aircraft, loadFactor, rask, cask, fuelPrice);
      setProfitAnalysis(profit);
      
      // Predict passenger type
      const paxType = predictPassengerType(dayOfWeek, seasonType, timeOfDay, bookingType);
      setPassengerType(paxType);
      
      // Generate profitability data for different load factors
      const profitabilityData: Array<{loadFactor: number, profit: number, revenue: number, cost: number}> = [];
      for (let lf = 0.3; lf <= 1.0; lf += 0.05) {
        const profitAtLF = analyzeProfit(dist, aircraft, lf, rask, cask, fuelPrice);
        profitabilityData.push({
          loadFactor: Math.round(lf * 100),
          profit: profitAtLF.profit,
          revenue: profitAtLF.revenue,
          cost: profitAtLF.cost
        });
      }
      setProfitData(profitabilityData);
      
      // Generate aircraft comparison data with enhanced metrics
      const aircraftData: Array<{
        type: string,
        profit: number,
        seats: number,
        fuelEfficiency: number,
        costPerSeat: number,
        revenuePerSeat: number,
        category: string
      }> = [];
      Object.keys(AIRCRAFT_DATA).forEach(craftType => {
        if (checkAircraftSuitability(dist, runwayLength, craftType)) {
          const profitForType = analyzeProfit(dist, craftType, loadFactor, rask, cask, fuelPrice);
          const aircraftInfo = AIRCRAFT_DATA[craftType as keyof typeof AIRCRAFT_DATA];
          aircraftData.push({
            type: craftType,
            profit: Math.round(profitForType.profit),
            seats: aircraftInfo.seats,
            fuelEfficiency: profitForType.emissions.co2PerPassengerKm,
            costPerSeat: profitForType.cost / aircraftInfo.seats,
            revenuePerSeat: profitForType.revenue / aircraftInfo.seats,
            category: aircraftInfo.category
          });
        }
      });
      setAircraftComparisonData(aircraftData);
    }
  };
  
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Flight Feasibility, Profitability & Passenger Type Estimator
          </h1>
          <p className="text-lg text-gray-600">
            Analyze route profitability, aircraft suitability, and predict passenger demographics
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Input Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <PlaneTakeoff className="h-6 w-6 text-blue-500" />
                  Flight Details
                </CardTitle>
                <CardDescription className="text-base mt-2">Enter route details and aircraft information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="origin" className="text-sm font-medium">Origin</Label>
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-blue-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="w-80 p-4 bg-white text-gray-800 border border-gray-200">
                            <h5 className="font-medium text-sm mb-1">Airport Information</h5>
                            <p className="text-xs mb-2">Showing enhanced airport data including ICAO codes and regional information.</p>
                            {originIATA && (
                              <div className="text-xs space-y-1 bg-blue-50 p-2 rounded">
                                <div className="flex items-center gap-1">
                                  <Plane className="h-3.5 w-3.5" />
                                  <span className="font-medium">{AIRPORTS.find(a => a.iata === originIATA)?.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3.5 w-3.5" />
                                  <span>ICAO: {AIRPORTS.find(a => a.iata === originIATA)?.icao}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-3.5 w-3.5" />
                                  <span>Country: {AIRPORTS.find(a => a.iata === originIATA)?.country}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ArrowUpFromLine className="h-3.5 w-3.5" />
                                  <span>Elevation: {AIRPORTS.find(a => a.iata === originIATA)?.elevation_ft} ft</span>
                                </div>
                              </div>
                            )}
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </div>
                    <Select value={originIATA} onValueChange={setOriginIATA}>
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue placeholder="Select origin" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="sticky top-0 bg-white p-2 border-b">
                          <Input
                            placeholder="Search airports..."
                            value={originSearch}
                            onChange={(e) => setOriginSearch(e.target.value)}
                            className="h-9 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {filteredOriginAirports.map(airport => (
                            <SelectItem key={airport.iata} value={airport.iata}>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{airport.iata}</span>
                                <span className="text-gray-500 text-xs">({airport.icao || 'N/A'})</span>
                                <span className="ml-1">-</span>
                                <span className="truncate max-w-[200px]">{airport.city}</span>
                                <span className="text-xs text-gray-400 ml-auto">{airport.country}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="destination" className="text-sm font-medium">Destination</Label>
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-blue-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="w-80 p-4 bg-white text-gray-800 border border-gray-200">
                            <h5 className="font-medium text-sm mb-1">Airport Information</h5>
                            <p className="text-xs mb-2">Showing enhanced airport data including ICAO codes and regional information.</p>
                            {destIATA && (
                              <div className="text-xs space-y-1 bg-blue-50 p-2 rounded">
                                <div className="flex items-center gap-1">
                                  <Plane className="h-3.5 w-3.5" />
                                  <span className="font-medium">{AIRPORTS.find(a => a.iata === destIATA)?.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3.5 w-3.5" />
                                  <span>ICAO: {AIRPORTS.find(a => a.iata === destIATA)?.icao}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-3.5 w-3.5" />
                                  <span>Country: {AIRPORTS.find(a => a.iata === destIATA)?.country}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ArrowUpFromLine className="h-3.5 w-3.5" />
                                  <span>Elevation: {AIRPORTS.find(a => a.iata === destIATA)?.elevation_ft} ft</span>
                                </div>
                              </div>
                            )}
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </div>
                    <Select value={destIATA} onValueChange={setDestIATA}>
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="sticky top-0 bg-white p-2 border-b">
                          <Input
                            placeholder="Search airports..."
                            value={destSearch}
                            onChange={(e) => setDestSearch(e.target.value)}
                            className="h-9 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {filteredDestAirports.map(airport => (
                            <SelectItem key={airport.iata} value={airport.iata}>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{airport.iata}</span>
                                <span className="text-gray-500 text-xs">({airport.icao || 'N/A'})</span>
                                <span className="ml-1">-</span>
                                <span className="truncate max-w-[200px]">{airport.city}</span>
                                <span className="text-xs text-gray-400 ml-auto">{airport.country}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aircraft" className="text-sm font-medium">Aircraft Type</Label>
                  <Select value={aircraft} onValueChange={setAircraft}>
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue placeholder="Select aircraft" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(AIRCRAFT_DATA).map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="runway" className="text-sm font-medium">Minimum Runway Length (m)</Label>
                  <Input
                    id="runway"
                    type="number"
                    value={runwayLength}
                    readOnly
                    className="h-11 text-base bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 italic">Auto-populated based on selected aircraft</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Banknote className="h-6 w-6 text-green-500" />
                  Economic Parameters
                </CardTitle>
                <CardDescription className="text-base mt-2">Set economic and operational parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="loadFactor" className="text-sm font-medium">Load Factor ({Math.round(loadFactor * 100)}%)</Label>
                  </div>
                  <Slider
                    id="loadFactor"
                    min={0.3}
                    max={1}
                    step={0.01}
                    value={[loadFactor]}
                    onValueChange={(value) => setLoadFactor(value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rask" className="text-sm font-medium">RASK (Revenue per Available Seat-Kilometer)</Label>
                  <Input
                    id="rask"
                    type="number"
                    value={rask}
                    onChange={e => setRASK(Number(e.target.value))}
                    min={0.01}
                    max={0.5}
                    step={0.01}
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cask" className="text-sm font-medium">CASK (Cost per Available Seat-Kilometer)</Label>
                  <Input
                    id="cask"
                    type="number"
                    value={cask}
                    onChange={e => setCASK(Number(e.target.value))}
                    min={0.01}
                    max={0.5}
                    step={0.01}
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelPrice" className="text-sm font-medium">Fuel Price ($ per liter)</Label>
                  <Input
                    id="fuelPrice"
                    type="number"
                    value={fuelPrice}
                    onChange={e => setFuelPrice(Number(e.target.value))}
                    min={0.5}
                    max={5}
                    step={0.1}
                    className="h-11 text-base"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Results Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Flight Analysis Results</CardTitle>
                <CardDescription className="text-base mt-2">
                  Analysis for {originIATA} ({AIRPORTS.find(a => a.iata === originIATA)?.icao}) to {destIATA} ({AIRPORTS.find(a => a.iata === destIATA)?.icao}) route using {aircraft}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                  <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Distance</h3>
                        <p className="text-3xl font-bold text-gray-900">{distance.toLocaleString()} km</p>
                      </div>
                      <MoveHorizontal className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600">Flight Time: ~{Math.floor(flightTime)} hr {Math.round((flightTime - Math.floor(flightTime)) * 60)} min</p>
                  </div>
                  
                  <div className={`bg-gradient-to-br ${suitable ? 'from-green-50' : 'from-red-50'} to-white p-5 rounded-xl border ${suitable ? 'border-green-100' : 'border-red-100'} shadow-sm`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Aircraft Suitability</h3>
                        <p className={`text-3xl font-bold ${suitable ? 'text-green-600' : 'text-red-600'}`}>{suitable ? "Suitable" : "Not Suitable"}</p>
                      </div>
                      <Plane className={`h-6 w-6 ${suitable ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                    <p className="text-sm text-gray-600">
                      {suitable 
                        ? `${aircraft} can operate this route` 
                        : `${aircraft} cannot operate this route`}
                    </p>
                  </div>
                  
                  <div className={`bg-gradient-to-br ${profitAnalysis.profit > 0 ? 'from-green-50' : 'from-red-50'} to-white p-5 rounded-xl border ${profitAnalysis.profit > 0 ? 'border-green-100' : 'border-red-100'} shadow-sm`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Profit Estimation</h3>
                        <p className={`text-3xl font-bold ${profitAnalysis.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(profitAnalysis.profit)}
                        </p>
                      </div>
                      <TrendingUp className={`h-6 w-6 ${profitAnalysis.profit > 0 ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                    <p className="text-sm text-gray-600">
                      Rev: {formatCurrency(profitAnalysis.revenue)}, Cost: {formatCurrency(profitAnalysis.cost)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-teal-50 to-white p-5 rounded-xl border border-teal-100 shadow-sm">
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-start cursor-help">
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-gray-600 mb-2">Environmental Impact</h3>
                              <div className="w-full bg-gray-200 rounded-full h-7 mt-2">
                                <div 
                                  className={`h-7 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                                    profitAnalysis.emissions.environmentalScore > 70 ? 'bg-green-500' : 
                                    profitAnalysis.emissions.environmentalScore > 50 ? 'bg-yellow-500' : 
                                    profitAnalysis.emissions.environmentalScore > 30 ? 'bg-orange-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${profitAnalysis.emissions.environmentalScore}%` }}
                                >
                                  {profitAnalysis.emissions.environmentalScore}
                                </div>
                              </div>
                            </div>
                            <Activity className="h-6 w-6 text-teal-500 ml-2" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="w-96 p-4 bg-white text-gray-800 border border-gray-200">
                          <h5 className="font-medium text-sm mb-1">Environmental Impact Details</h5>
                          <p className="text-xs mb-2">Carbon emissions and efficiency metrics for this flight.</p>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span>Total CO2 Emissions:</span>
                              <span className="font-semibold">{Math.round(profitAnalysis.emissions.totalCO2).toLocaleString()} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span>CO2 per Passenger:</span>
                              <span className="font-semibold">{Math.round(profitAnalysis.emissions.co2PerPassenger).toLocaleString()} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span>CO2 per Passenger-km:</span>
                              <span className="font-semibold">{(profitAnalysis.emissions.co2PerPassengerKm).toFixed(2)} kg</span>
                            </div>
                            <div className="mt-3 pt-2 border-t border-gray-200">
                              <span className="block font-medium mb-1">Environmental Score: {profitAnalysis.emissions.environmentalScore}/100</span>
                              <span className={`text-xs ${
                                profitAnalysis.emissions.environmentalScore > 70 ? 'text-green-600' :
                                profitAnalysis.emissions.environmentalScore > 50 ? 'text-yellow-600' :
                                profitAnalysis.emissions.environmentalScore > 30 ? 'text-orange-600' : 'text-red-600'
                              }`}>
                                {profitAnalysis.emissions.environmentalScore > 70 ? 'Excellent' :
                                profitAnalysis.emissions.environmentalScore > 50 ? 'Good' :
                                profitAnalysis.emissions.environmentalScore > 30 ? 'Fair' : 'Poor'} efficiency
                              </span>
                            </div>
                            <div className="mt-3 pt-2 border-t border-gray-200 bg-blue-50 p-2 rounded">
                              <span className="block font-medium mb-1 text-blue-900">💰 Carbon Offset Cost</span>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-blue-800">Total Offset:</span>
                                  <span className="font-semibold text-blue-900">${profitAnalysis.emissions.carbonOffsetCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-blue-800">Per Passenger:</span>
                                  <span className="font-semibold text-blue-900">${profitAnalysis.emissions.carbonOffsetPerPassenger.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-blue-700 mt-1 italic">
                                  At $25 per tonne CO2 (industry average)
                                </p>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                    <p className="text-sm text-gray-600 mt-2">
                      {(profitAnalysis.emissions.co2PerPassenger / 1000).toFixed(1)} tonnes CO2 per passenger
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-100 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Passenger Type</h3>
                        <p className="text-3xl font-bold text-purple-600">{passengerType}</p>
                      </div>
                      <Users className="h-6 w-6 text-purple-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on seasonality and booking patterns
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="profitability">
              <TabsList className="grid grid-cols-3 mb-6 h-12">
                <TabsTrigger value="profitability" className="flex items-center gap-2 text-base">
                  <Banknote className="h-5 w-5" />
                  <span>Load Factor Impact</span>
                </TabsTrigger>
                <TabsTrigger value="aircraft" className="flex items-center gap-2 text-base">
                  <Plane className="h-5 w-5" />
                  <span>Aircraft Comparison</span>
                </TabsTrigger>
                <TabsTrigger value="passenger" className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5" />
                  <span>Passenger Analysis</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profitability">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      Load Factor Impact on Profitability
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <div className="space-y-2 text-xs">
                              <p><strong>Revenue</strong> = RASK × RPK (Revenue per Available Seat-Kilometer × Revenue Passenger-Kilometers)</p>
                              <p><strong>Cost</strong> = Operating Cost + Fuel Cost</p>
                              <p><strong>Profit</strong> = Revenue - Cost</p>
                            </div>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <CardDescription>
                      See how profit changes as load factor increases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={profitData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="loadFactor" 
                            label={{ value: 'Load Factor (%)', position: 'insideBottom', offset: -10, style: { fontSize: 14, fontWeight: 600 } }}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${value}%`}
                          />
                          <YAxis 
                            label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 14, fontWeight: 600 } }}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                              const absValue = Math.abs(value);
                              if (absValue >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                              if (absValue >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                              return `$${value}`;
                            }}
                            width={80}
                          />
                          <Tooltip 
                            formatter={(value) => formatCurrency(Number(value))}
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                          />
                          <Legend 
                            wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
                            iconType="line"
                          />
                          <Line type="monotone" dataKey="revenue" stroke="#4ade80" name="Revenue" strokeWidth={2.5} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="cost" stroke="#f87171" name="Cost" strokeWidth={2.5} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="profit" stroke="#60a5fa" name="Profit" strokeWidth={2.5} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h3 className="text-sm font-medium text-green-600">Revenue at {Math.round(loadFactor * 100)}% Load Factor</h3>
                        <p className="text-2xl font-bold text-green-700">{formatCurrency(profitAnalysis.revenue)}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h3 className="text-sm font-medium text-red-600">Cost</h3>
                        <p className="text-2xl font-bold text-red-700">{formatCurrency(profitAnalysis.cost)}</p>
                      </div>
                      <div className={`${profitAnalysis.profit > 0 ? 'bg-blue-50' : 'bg-red-50'} p-3 rounded-lg`}>
                        <h3 className={`text-sm font-medium ${profitAnalysis.profit > 0 ? 'text-blue-600' : 'text-red-600'}`}>Profit/Loss</h3>
                        <p className={`text-2xl font-bold ${profitAnalysis.profit > 0 ? 'text-blue-700' : 'text-red-700'}`}>
                          {formatCurrency(profitAnalysis.profit)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Break-even Analysis</h3>
                      <div className="text-sm text-gray-600">
                        {profitAnalysis.breakEvenLoadFactor <= 1.0 ? (
                          <div>
                            <p className="mb-2">
                              <strong>Exact break-even load factor:</strong>{' '}
                              <strong className="text-blue-600 text-lg">
                                {(profitAnalysis.breakEvenLoadFactor * 100).toFixed(2)}%
                              </strong>
                            </p>
                            <p className="text-xs text-gray-500">
                              To break even, the flight needs at least{' '}
                              {Math.ceil(profitAnalysis.breakEvenLoadFactor * AIRCRAFT_DATA[aircraft as keyof typeof AIRCRAFT_DATA].seats)}{' '}
                              passengers out of {AIRCRAFT_DATA[aircraft as keyof typeof AIRCRAFT_DATA].seats} seats.
                            </p>
                            {loadFactor >= profitAnalysis.breakEvenLoadFactor ? (
                              <p className="mt-2 text-green-600 text-xs flex items-center gap-1">
                                ✓ Current load factor ({(loadFactor * 100).toFixed(0)}%) is above break-even
                              </p>
                            ) : (
                              <p className="mt-2 text-red-600 text-xs flex items-center gap-1">
                                ✗ Current load factor ({(loadFactor * 100).toFixed(0)}%) is below break-even
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-red-600">
                            This route cannot break even even at 100% load factor.
                            Consider adjusting RASK/CASK or aircraft type.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="aircraft">
                <Card>
                  <CardHeader>
                    <CardTitle>Aircraft Comparison</CardTitle>
                    <CardDescription>
                      Compare suitable aircraft profitability for this route
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={aircraftComparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis 
                            yAxisId="left"
                            label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft', offset: -5 }} 
                          />
                          <YAxis 
                            yAxisId="right"
                            orientation="right"
                            label={{ value: 'Seats', angle: 90, position: 'insideRight', offset: 5 }} 
                          />
                          <Tooltip 
                            formatter={(value, name, props) => {
                              if (name === 'profit') return formatCurrency(Number(value));
                              return value;
                            }} 
                          />
                          <Legend />
                          <Bar yAxisId="left" dataKey="profit" fill="#60a5fa" name="Profit" />
                          <Bar yAxisId="right" dataKey="seats" fill="#f97316" name="Seat Capacity" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Aircraft Recommendation</h3>
                        <div className="text-sm text-gray-600">
                          {aircraftComparisonData.length > 0 ? (
                            <>
                              <p className="mb-2">
                                <strong className="text-blue-600">
                                  {aircraftComparisonData.sort((a, b) => b.profit - a.profit)[0].type}
                                </strong>{' '}
                                is the most profitable aircraft for this route with an estimated profit of{' '}
                                <strong>{formatCurrency(aircraftComparisonData.sort((a, b) => b.profit - a.profit)[0].profit)}</strong>.
                              </p>
                              <p>
                                {aircraftComparisonData.length} aircraft types can operate this {distance.toLocaleString()} km route.
                              </p>
                            </>
                          ) : (
                            <p className="text-red-600">
                              No suitable aircraft found for this route. Try increasing runway length or selecting a different route.
                            </p>
                          )}
                        </div>
                      </div>

                      {aircraftComparisonData.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-3">Detailed Aircraft Metrics</h3>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-xs border-collapse">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border p-2 text-left">Aircraft</th>
                                  <th className="border p-2 text-right">Category</th>
                                  <th className="border p-2 text-right">Profit</th>
                                  <th className="border p-2 text-right">Revenue/Seat</th>
                                  <th className="border p-2 text-right">Cost/Seat</th>
                                  <th className="border p-2 text-right">Fuel Eff.</th>
                                </tr>
                              </thead>
                              <tbody>
                                {aircraftComparisonData
                                  .sort((a, b) => b.profit - a.profit)
                                  .slice(0, 10)
                                  .map((ac, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      <td className="border p-2 font-medium">{ac.type}</td>
                                      <td className="border p-2 text-right text-gray-600">{ac.category}</td>
                                      <td className={`border p-2 text-right font-semibold ${ac.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(ac.profit)}
                                      </td>
                                      <td className="border p-2 text-right">${ac.revenuePerSeat.toFixed(2)}</td>
                                      <td className="border p-2 text-right">${ac.costPerSeat.toFixed(2)}</td>
                                      <td className="border p-2 text-right">{(ac.fuelEfficiency * 1000).toFixed(1)}g/km</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 italic">
                            * Fuel Efficiency = CO2 per passenger-km (lower is better)
                            <br />* Showing top 10 most profitable aircraft
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="passenger">
                <Card>
                  <CardHeader>
                    <CardTitle>Passenger Demographics Analysis</CardTitle>
                    <CardDescription>
                      Predicted passenger type and strategic implications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Passenger Mix Visualization */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          Predicted Passenger Mix
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-gray-100 rounded-full h-10 overflow-hidden shadow-inner">
                            <div className="flex h-full">
                              <div 
                                style={{ width: `${passengerType === 'Business' ? 70 : passengerType === 'Mixed' ? 40 : 20}%` }}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold transition-all duration-300"
                              >
                                {passengerType === 'Business' ? 70 : passengerType === 'Mixed' ? 40 : 20}%
                              </div>
                              <div 
                                style={{ width: `${passengerType === 'Leisure' ? 70 : passengerType === 'Mixed' ? 40 : 20}%` }}
                                className="bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-semibold transition-all duration-300"
                              >
                                {passengerType === 'Leisure' ? 70 : passengerType === 'Mixed' ? 40 : 20}%
                              </div>
                              <div 
                                style={{ width: '10%' }}
                                className="bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-semibold"
                              >
                                10%
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-4 h-4 bg-blue-500 rounded-full" />
                              <span className="text-xs font-medium">Business</span>
                              <span className="text-xs text-gray-500">{passengerType === 'Business' ? 70 : passengerType === 'Mixed' ? 40 : 20}%</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-4 h-4 bg-green-500 rounded-full" />
                              <span className="text-xs font-medium">Leisure</span>
                              <span className="text-xs text-gray-500">{passengerType === 'Leisure' ? 70 : passengerType === 'Mixed' ? 40 : 20}%</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-4 h-4 bg-gray-400 rounded-full" />
                              <span className="text-xs font-medium">Other</span>
                              <span className="text-xs text-gray-500">10%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Business Implications */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          Strategic Business Implications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-3">
                              <DollarSign className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-sm mb-1.5 text-blue-900">Pricing Strategy</h4>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                  {passengerType === 'Business' 
                                    ? 'Focus on premium pricing, flexible tickets, and business class seats.' 
                                    : passengerType === 'Leisure' 
                                    ? 'Competitive economy pricing, advance purchase discounts, and promotional fares.'
                                    : 'Balanced pricing across cabins with moderate flexibility options.'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-200">
                            <div className="flex items-start gap-3">
                              <CalendarClock className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-sm mb-1.5 text-purple-900">Scheduling</h4>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                  {passengerType === 'Business' 
                                    ? 'Early morning and evening departures, high frequency, consistent schedule.' 
                                    : passengerType === 'Leisure' 
                                    ? 'Mid-day and weekend departures, adjusted for seasonal demand.'
                                    : 'Mixed schedule with both business and leisure-friendly departure times.'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-200">
                            <div className="flex items-start gap-3">
                              <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-sm mb-1.5 text-green-900">Revenue Optimization</h4>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                  {passengerType === 'Business' 
                                    ? 'Focus on business class and premium economy upgrades, corporate agreements.' 
                                    : passengerType === 'Leisure' 
                                    ? 'Ancillary revenue (bags, seats, onboard sales), package deals with hotels.'
                                    : 'Balanced approach with both corporate agreements and leisure packaging.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}