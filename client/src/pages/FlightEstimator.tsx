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
  Info, Globe, Building2, ArrowUpFromLine, Map
} from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define a simple aircraft database
const AIRCRAFT_DATA = {
  "A320": { range_km: 6100, fuel_burn_km: 2.5, min_runway: 2000, seats: 180, cruise_speed: 840 },
  "B737": { range_km: 5600, fuel_burn_km: 2.3, min_runway: 1800, seats: 160, cruise_speed: 830 },
  "A350": { range_km: 15000, fuel_burn_km: 6.2, min_runway: 2500, seats: 350, cruise_speed: 910 },
  "B777": { range_km: 13649, fuel_burn_km: 7.8, min_runway: 2440, seats: 368, cruise_speed: 905 },
  "A220": { range_km: 5920, fuel_burn_km: 2.1, min_runway: 1460, seats: 130, cruise_speed: 871 },
  "B787": { range_km: 14010, fuel_burn_km: 5.6, min_runway: 2600, seats: 290, cruise_speed: 903 },
  "E190": { range_km: 4537, fuel_burn_km: 1.9, min_runway: 1620, seats: 100, cruise_speed: 829 },
  "CRJ900": { range_km: 2876, fuel_burn_km: 1.7, min_runway: 1939, seats: 90, cruise_speed: 829 },
};

// Enhanced airport database with ICAO codes and additional info
const AIRPORTS = [
  { iata: "JFK", icao: "KJFK", name: "John F Kennedy International Airport", city: "New York", country: "US", region: "US-NY", lat: 40.639447, lon: -73.779317, elevation_ft: 13, type: "large_airport", website: "https://www.jfkairport.com/", scheduled: "yes" },
  { iata: "LHR", icao: "EGLL", name: "London Heathrow Airport", city: "London", country: "GB", region: "GB-ENG", lat: 51.4706, lon: -0.461941, elevation_ft: 83, type: "large_airport", website: "http://www.heathrowairport.com/", scheduled: "yes" },
  { iata: "CDG", icao: "LFPG", name: "Charles de Gaulle International Airport", city: "Paris", country: "FR", region: "FR-IDF", lat: 49.012798, lon: 2.55, elevation_ft: 392, type: "large_airport", website: "http://www.aeroportsdeparis.fr/", scheduled: "yes" },
  { iata: "DXB", icao: "OMDB", name: "Dubai International Airport", city: "Dubai", country: "AE", region: "AE-DU", lat: 25.2527999878, lon: 55.3643989563, elevation_ft: 62, type: "large_airport", website: "http://www.dubaiairport.com/", scheduled: "yes" },
  { iata: "SIN", icao: "WSSS", name: "Singapore Changi Airport", city: "Singapore", country: "SG", region: "SG-04", lat: 1.35019, lon: 103.994003, elevation_ft: 22, type: "large_airport", website: "http://www.changiairport.com/", scheduled: "yes" },
  { iata: "HND", icao: "RJTT", name: "Tokyo Haneda International Airport", city: "Tokyo", country: "JP", region: "JP-13", lat: 35.552299, lon: 139.779999, elevation_ft: 35, type: "large_airport", website: "http://www.haneda-airport.jp/", scheduled: "yes" },
  { iata: "LAX", icao: "KLAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "US", region: "US-CA", lat: 33.942501, lon: -118.407997, elevation_ft: 125, type: "large_airport", website: "https://www.flylax.com/", scheduled: "yes" },
  { iata: "ORD", icao: "KORD", name: "Chicago O'Hare International Airport", city: "Chicago", country: "US", region: "US-IL", lat: 41.9786, lon: -87.9048, elevation_ft: 680, type: "large_airport", website: "https://www.flychicago.com/ohare/", scheduled: "yes" },
  { iata: "ATL", icao: "KATL", name: "Hartsfield Jackson Atlanta International Airport", city: "Atlanta", country: "US", region: "US-GA", lat: 33.6367, lon: -84.428101, elevation_ft: 1026, type: "large_airport", website: "http://www.atlanta-airport.com/", scheduled: "yes" },
  { iata: "PEK", icao: "ZBAA", name: "Beijing Capital International Airport", city: "Beijing", country: "CN", region: "CN-11", lat: 40.080101, lon: 116.584999, elevation_ft: 116, type: "large_airport", website: "http://en.bcia.com.cn/", scheduled: "yes" },
  { iata: "IST", icao: "LTFM", name: "İstanbul Airport", city: "Istanbul", country: "TR", region: "TR-34", lat: 41.261297, lon: 28.741951, elevation_ft: 325, type: "large_airport", website: "http://www.igairport.com/", scheduled: "yes" },
  { iata: "AMS", icao: "EHAM", name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "NL", region: "NL-NH", lat: 52.308601, lon: 4.76389, elevation_ft: -11, type: "large_airport", website: "https://www.schiphol.nl/", scheduled: "yes" },
  { iata: "FRA", icao: "EDDF", name: "Frankfurt Airport", city: "Frankfurt am Main", country: "DE", region: "DE-HE", lat: 50.030241, lon: 8.561096, elevation_ft: 364, type: "large_airport", website: "https://www.frankfurt-airport.de/", scheduled: "yes" },
  { iata: "MEX", icao: "MMMX", name: "Benito Juárez International Airport", city: "Ciudad de México", country: "MX", region: "MX-DIF", lat: 19.435137, lon: -99.071328, elevation_ft: 7316, type: "large_airport", website: "https://www.aicm.com.mx", scheduled: "yes" },
  { iata: "SYD", icao: "YSSY", name: "Sydney Kingsford Smith International Airport", city: "Sydney", country: "AU", region: "AU-NSW", lat: -33.946098, lon: 151.177002, elevation_ft: 21, type: "large_airport", website: "https://www.sydneyairport.com.au/", scheduled: "yes" },
  { iata: "GRU", icao: "SBGR", name: "Guarulhos - Governador André Franco Montoro International Airport", city: "São Paulo", country: "BR", region: "BR-SP", lat: -23.435556, lon: -46.473056, elevation_ft: 2459, type: "large_airport", website: "https://www.gru.com.br/", scheduled: "yes" },
  { iata: "JNB", icao: "FAOR", name: "O.R. Tambo International Airport", city: "Johannesburg", country: "ZA", region: "ZA-GT", lat: -26.139099, lon: 28.246, elevation_ft: 5558, type: "large_airport", website: "https://www.airports.co.za/", scheduled: "yes" },
  { iata: "DEL", icao: "VIDP", name: "Indira Gandhi International Airport", city: "Delhi", country: "IN", region: "IN-DL", lat: 28.556501, lon: 77.103104, elevation_ft: 777, type: "large_airport", website: "http://www.newdelhiairport.in/", scheduled: "yes" },
  { iata: "BOM", icao: "VABB", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "IN", region: "IN-MH", lat: 19.0886993408, lon: 72.8678970337, elevation_ft: 39, type: "large_airport", website: "https://www.csmia.aero/", scheduled: "yes" },
  { iata: "MAD", icao: "LEMD", name: "Adolfo Suárez Madrid–Barajas Airport", city: "Madrid", country: "ES", region: "ES-MD", lat: 40.471926, lon: -3.56264, elevation_ft: 1998, type: "large_airport", website: "http://www.aena.es/", scheduled: "yes" },
  { iata: "DME", icao: "UUDD", name: "Domodedovo International Airport", city: "Moscow", country: "RU", region: "RU-MOS", lat: 55.408611, lon: 37.906111, elevation_ft: 588, type: "large_airport", website: "http://www.dme.ru/", scheduled: "yes" },
  { iata: "CAI", icao: "HECA", name: "Cairo International Airport", city: "Cairo", country: "EG", region: "EG-C", lat: 30.121944, lon: 31.405556, elevation_ft: 382, type: "large_airport", website: "http://www.cairo-airport.com/", scheduled: "yes" },
  { iata: "CGK", icao: "WIII", name: "Soekarno-Hatta International Airport", city: "Jakarta", country: "ID", region: "ID-JK", lat: -6.12556, lon: 106.656, elevation_ft: 32, type: "large_airport", website: "https://www.jakartaairportonline.com/", scheduled: "yes" },
  { iata: "GIG", icao: "SBGL", name: "Rio de Janeiro/Galeão International Airport", city: "Rio de Janeiro", country: "BR", region: "BR-RJ", lat: -22.809999, lon: -43.250557, elevation_ft: 28, type: "large_airport", website: "http://www.riogaleao.com/", scheduled: "yes" },
  { iata: "ICN", icao: "RKSI", name: "Incheon International Airport", city: "Seoul", country: "KR", region: "KR-41", lat: 37.46910095214844, lon: 126.45099639892578, elevation_ft: 23, type: "large_airport", website: "https://www.airport.kr/", scheduled: "yes" },
  { iata: "CUN", icao: "MMUN", name: "Cancún International Airport", city: "Cancún", country: "MX", region: "MX-ROO", lat: 21.036500930800003, lon: -86.8770980835, elevation_ft: 23, type: "large_airport", website: "https://www.asur.com.mx/", scheduled: "yes" },
  { iata: "HKG", icao: "VHHH", name: "Hong Kong International Airport", city: "Hong Kong", country: "HK", region: "HK-N/A", lat: 22.308901, lon: 113.915001, elevation_ft: 28, type: "large_airport", website: "http://www.hongkongairport.com/", scheduled: "yes" },
  { iata: "FCO", icao: "LIRF", name: "Leonardo da Vinci–Fiumicino Airport", city: "Rome", country: "IT", region: "IT-62", lat: 41.800278, lon: 12.238889, elevation_ft: 13, type: "large_airport", website: "http://www.adr.it/", scheduled: "yes" },
  { iata: "BCN", icao: "LEBL", name: "Josep Tarradellas Barcelona-El Prat Airport", city: "Barcelona", country: "ES", region: "ES-CT", lat: 41.2971, lon: 2.07846, elevation_ft: 14, type: "large_airport", website: "http://www.aena.es/", scheduled: "yes" },
  { iata: "SFO", icao: "KSFO", name: "San Francisco International Airport", city: "San Francisco", country: "US", region: "US-CA", lat: 37.6189994812, lon: -122.3750015259, elevation_ft: 13, type: "large_airport", website: "https://www.flysfo.com/", scheduled: "yes" },
];

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
  
  return { 
    revenue, 
    cost, 
    fuelCost,
    operatingCost,
    profit: revenue - cost,
    emissions: {
      totalCO2,
      co2PerPassenger,
      co2PerPassengerKm,
      environmentalScore
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
  // State for basic inputs
  const [originIATA, setOriginIATA] = useState('JFK');
  const [destIATA, setDestIATA] = useState('LHR');
  const [aircraft, setAircraft] = useState('A320');
  const [runwayLength, setRunwayLength] = useState(3000);
  
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
    emissions: {
      totalCO2: 0,
      co2PerPassenger: 0,
      co2PerPassengerKm: 0,
      environmentalScore: 0
    }
  });
  const [passengerType, setPassengerType] = useState('');
  
  // Profitability data for different load factors
  const [profitData, setProfitData] = useState<Array<{loadFactor: number, profit: number, revenue: number, cost: number}>>([]);
  const [aircraftComparisonData, setAircraftComparisonData] = useState<Array<{type: string, profit: number, seats: number}>>([]);
  
  // Dropdown options
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const seasons = ['spring', 'summer', 'fall', 'winter', 'holiday'];
  const timesOfDay = ['morning', 'afternoon', 'evening', 'night'];
  const bookingTypes = ['early', 'regular', 'last_minute'];
  
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
      
      // Generate aircraft comparison data
      const aircraftData: Array<{type: string, profit: number, seats: number}> = [];
      Object.keys(AIRCRAFT_DATA).forEach(craftType => {
        if (checkAircraftSuitability(dist, runwayLength, craftType)) {
          const profitForType = analyzeProfit(dist, craftType, loadFactor, rask, cask, fuelPrice);
          aircraftData.push({
            type: craftType,
            profit: Math.round(profitForType.profit),
            seats: AIRCRAFT_DATA[craftType as keyof typeof AIRCRAFT_DATA].seats
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Flight Feasibility, Profitability & Passenger Type Estimator
          </h1>
          <p className="text-gray-600 mt-2">
            Analyze route profitability, aircraft suitability, and predict passenger demographics
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Input Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlaneTakeoff className="h-5 w-5 text-blue-500" />
                  Flight Details
                </CardTitle>
                <CardDescription>Enter route details and aircraft information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="origin">Origin</Label>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin" />
                      </SelectTrigger>
                      <SelectContent>
                        {AIRPORTS.map(airport => (
                          <SelectItem key={airport.iata} value={airport.iata}>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{airport.iata}</span>
                              <span className="text-gray-500 text-xs">({airport.icao})</span>
                              <span className="ml-1">-</span>
                              <span>{airport.city}</span>
                              <span className="text-xs text-gray-400 ml-auto">{airport.country}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="destination">Destination</Label>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {AIRPORTS.map(airport => (
                          <SelectItem key={airport.iata} value={airport.iata}>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{airport.iata}</span>
                              <span className="text-gray-500 text-xs">({airport.icao})</span>
                              <span className="ml-1">-</span>
                              <span>{airport.city}</span>
                              <span className="text-xs text-gray-400 ml-auto">{airport.country}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aircraft">Aircraft Type</Label>
                  <Select value={aircraft} onValueChange={setAircraft}>
                    <SelectTrigger>
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
                  <Label htmlFor="runway">Minimum Runway Length (m)</Label>
                  <Input
                    id="runway"
                    type="number"
                    value={runwayLength}
                    onChange={e => setRunwayLength(Number(e.target.value))}
                    min={1000}
                    max={5000}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-green-500" />
                  Economic Parameters
                </CardTitle>
                <CardDescription>Set economic and operational parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="loadFactor">Load Factor ({Math.round(loadFactor * 100)}%)</Label>
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
                  <Label htmlFor="rask">RASK (Revenue per Available Seat-Kilometer)</Label>
                  <Input
                    id="rask"
                    type="number"
                    value={rask}
                    onChange={e => setRASK(Number(e.target.value))}
                    min={0.01}
                    max={0.5}
                    step={0.01}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cask">CASK (Cost per Available Seat-Kilometer)</Label>
                  <Input
                    id="cask"
                    type="number"
                    value={cask}
                    onChange={e => setCASK(Number(e.target.value))}
                    min={0.01}
                    max={0.5}
                    step={0.01}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelPrice">Fuel Price ($ per liter)</Label>
                  <Input
                    id="fuelPrice"
                    type="number"
                    value={fuelPrice}
                    onChange={e => setFuelPrice(Number(e.target.value))}
                    min={0.5}
                    max={5}
                    step={0.1}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Passenger Demographics
                </CardTitle>
                <CardDescription>Predict passenger type and booking patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dayOfWeek">Day of Week</Label>
                  <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map(day => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="season">Season</Label>
                  <Select value={seasonType} onValueChange={setSeasonType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons.map(season => (
                        <SelectItem key={season} value={season}>
                          {season.charAt(0).toUpperCase() + season.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeOfDay">Time of Day</Label>
                  <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timesOfDay.map(time => (
                        <SelectItem key={time} value={time}>
                          {time.charAt(0).toUpperCase() + time.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bookingType">Booking Type</Label>
                  <Select value={bookingType} onValueChange={setBookingType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select booking type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookingTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type === 'early' ? 'Early (>30 days)' : 
                           type === 'regular' ? 'Regular (7-30 days)' : 
                           'Last Minute (<7 days)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Results Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Flight Analysis Results</CardTitle>
                <CardDescription>
                  Analysis for {originIATA} ({AIRPORTS.find(a => a.iata === originIATA)?.icao}) to {destIATA} ({AIRPORTS.find(a => a.iata === destIATA)?.icao}) route using {aircraft}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Distance</h3>
                        <p className="text-2xl font-bold">{distance.toLocaleString()} km</p>
                      </div>
                      <MoveHorizontal className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Flight Time: ~{Math.floor(flightTime)} hr {Math.round((flightTime - Math.floor(flightTime)) * 60)} min</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Aircraft Suitability</h3>
                        <p className="text-2xl font-bold text-blue-600">{suitable ? "Suitable" : "Not Suitable"}</p>
                      </div>
                      <Plane className={`h-5 w-5 ${suitable ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {suitable 
                        ? `${aircraft} can operate this route` 
                        : `${aircraft} cannot operate this route`}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Profit Estimation</h3>
                        <p className={`text-2xl font-bold ${profitAnalysis.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(profitAnalysis.profit)}
                        </p>
                      </div>
                      <TrendingUp className={`h-5 w-5 ${profitAnalysis.profit > 0 ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Rev: {formatCurrency(profitAnalysis.revenue)}, Cost: {formatCurrency(profitAnalysis.cost)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between items-start cursor-help">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Environmental Impact</h3>
                              <div className="w-full bg-gray-200 rounded-full h-6 mt-2">
                                <div 
                                  className={`h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
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
                            <Activity className="h-5 w-5 text-blue-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-4 bg-white text-gray-800 border border-gray-200">
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
                          </div>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                    <p className="text-xs text-gray-500 mt-1">
                      {(profitAnalysis.emissions.co2PerPassenger / 1000).toFixed(1)} tonnes CO2 per passenger
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Passenger Type</h3>
                        <p className="text-2xl font-bold text-purple-600">{passengerType}</p>
                      </div>
                      <Users className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on seasonality and booking patterns
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="profitability">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="profitability" className="flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  <span>Load Factor Impact</span>
                </TabsTrigger>
                <TabsTrigger value="aircraft" className="flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  <span>Aircraft Comparison</span>
                </TabsTrigger>
                <TabsTrigger value="passenger" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Passenger Analysis</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profitability">
                <Card>
                  <CardHeader>
                    <CardTitle>Load Factor Impact on Profitability</CardTitle>
                    <CardDescription>
                      See how profit changes as load factor increases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={profitData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="loadFactor" 
                            label={{ value: 'Load Factor (%)', position: 'bottom', offset: 0 }} 
                          />
                          <YAxis 
                            label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', offset: -5 }} 
                          />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                          <Line type="monotone" dataKey="revenue" stroke="#4ade80" name="Revenue" strokeWidth={2} />
                          <Line type="monotone" dataKey="cost" stroke="#f87171" name="Cost" strokeWidth={2} />
                          <Line type="monotone" dataKey="profit" stroke="#60a5fa" name="Profit" strokeWidth={2} />
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
                        {profitData.find(item => item.profit >= 0) ? (
                          <p>
                            Break-even load factor: approximately{' '}
                            <strong className="text-blue-600">
                              {profitData.find(item => item.profit >= 0)?.loadFactor}%
                            </strong>
                          </p>
                        ) : (
                          <p className="text-red-600">
                            This route does not break even at any tested load factor.
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
                    
                    <div className="mt-4">
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
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="passenger">
                <Card>
                  <CardHeader>
                    <CardTitle>Passenger Demographics Analysis</CardTitle>
                    <CardDescription>
                      Passenger type prediction and implications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-4">Predicted Passenger Mix</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Business', value: passengerType === 'Business' ? 70 : passengerType === 'Mixed' ? 40 : 20 },
                                  { name: 'Leisure', value: passengerType === 'Leisure' ? 70 : passengerType === 'Mixed' ? 40 : 20 },
                                  { name: 'Other', value: 10 }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {[
                                  { name: 'Business', value: passengerType === 'Business' ? 70 : passengerType === 'Mixed' ? 40 : 20 },
                                  { name: 'Leisure', value: passengerType === 'Leisure' ? 70 : passengerType === 'Mixed' ? 40 : 20 },
                                  { name: 'Other', value: 10 }
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-4">Business Implications</h3>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-sm mb-1">Pricing Strategy</h4>
                            <p className="text-sm text-gray-600">
                              {passengerType === 'Business' 
                                ? 'Focus on premium pricing, flexible tickets, and business class seats.' 
                                : passengerType === 'Leisure' 
                                ? 'Competitive economy pricing, advance purchase discounts, and promotional fares.'
                                : 'Balanced pricing across cabins with moderate flexibility options.'}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-sm mb-1">Scheduling</h4>
                            <p className="text-sm text-gray-600">
                              {passengerType === 'Business' 
                                ? 'Early morning and evening departures, high frequency, consistent schedule.' 
                                : passengerType === 'Leisure' 
                                ? 'Mid-day and weekend departures, adjusted for seasonal demand.'
                                : 'Mixed schedule with both business and leisure-friendly departure times.'}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-sm mb-1">Revenue Optimization</h4>
                            <p className="text-sm text-gray-600">
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