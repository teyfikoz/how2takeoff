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
  Banknote, Users, Activity, Percent, MoveHorizontal, CalendarClock
} from 'lucide-react';

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

// Mock airport database with selected major airports
const AIRPORTS = [
  { iata: "JFK", name: "John F. Kennedy International Airport", city: "New York", lat: 40.6413, lon: -73.7781 },
  { iata: "LHR", name: "London Heathrow Airport", city: "London", lat: 51.4700, lon: -0.4543 },
  { iata: "CDG", name: "Charles de Gaulle Airport", city: "Paris", lat: 49.0097, lon: 2.5479 },
  { iata: "DXB", name: "Dubai International Airport", city: "Dubai", lat: 25.2528, lon: 55.3644 },
  { iata: "SIN", name: "Singapore Changi Airport", city: "Singapore", lat: 1.3644, lon: 103.9915 },
  { iata: "HND", name: "Tokyo Haneda Airport", city: "Tokyo", lat: 35.5494, lon: 139.7798 },
  { iata: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", lat: 33.9416, lon: -118.4085 },
  { iata: "ORD", name: "O'Hare International Airport", city: "Chicago", lat: 41.9742, lon: -87.9073 },
  { iata: "ATL", name: "Hartsfield-Jackson Atlanta International Airport", city: "Atlanta", lat: 33.6407, lon: -84.4277 },
  { iata: "PEK", name: "Beijing Capital International Airport", city: "Beijing", lat: 40.0799, lon: 116.6031 },
  { iata: "IST", name: "Istanbul Airport", city: "Istanbul", lat: 41.2608, lon: 28.7419 },
  { iata: "AMS", name: "Amsterdam Airport Schiphol", city: "Amsterdam", lat: 52.3105, lon: 4.7683 },
  { iata: "FRA", name: "Frankfurt Airport", city: "Frankfurt", lat: 50.0379, lon: 8.5622 },
  { iata: "MEX", name: "Mexico City International Airport", city: "Mexico City", lat: 19.4361, lon: -99.0719 },
  { iata: "SYD", name: "Sydney Airport", city: "Sydney", lat: -33.9399, lon: 151.1753 },
  { iata: "GRU", name: "São Paulo-Guarulhos International Airport", city: "São Paulo", lat: -23.4356, lon: -46.4731 },
  { iata: "JNB", name: "O.R. Tambo International Airport", city: "Johannesburg", lat: -26.1392, lon: 28.2460 },
  { iata: "DEL", name: "Indira Gandhi International Airport", city: "Delhi", lat: 28.5562, lon: 77.1000 },
  { iata: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", lat: 19.0896, lon: 72.8656 },
  { iata: "MAD", name: "Adolfo Suárez Madrid–Barajas Airport", city: "Madrid", lat: 40.4983, lon: -3.5676 },
  { iata: "DME", name: "Domodedovo International Airport", city: "Moscow", lat: 55.4103, lon: 37.9020 },
  { iata: "CAI", name: "Cairo International Airport", city: "Cairo", lat: 30.1219, lon: 31.4056 },
  { iata: "CGK", name: "Soekarno-Hatta International Airport", city: "Jakarta", lat: -6.1256, lon: 106.6558 },
  { iata: "GIG", name: "Rio de Janeiro/Galeão International Airport", city: "Rio de Janeiro", lat: -22.8099, lon: -43.2506 },
  { iata: "ICN", name: "Incheon International Airport", city: "Seoul", lat: 37.4602, lon: 126.4407 },
  { iata: "CUN", name: "Cancún International Airport", city: "Cancún", lat: 21.0365, lon: -86.8771 },
  { iata: "HKG", name: "Hong Kong International Airport", city: "Hong Kong", lat: 22.3080, lon: 113.9185 },
  { iata: "FCO", name: "Leonardo da Vinci–Fiumicino Airport", city: "Rome", lat: 41.8003, lon: 12.2389 },
  { iata: "BCN", name: "Josep Tarradellas Barcelona-El Prat Airport", city: "Barcelona", lat: 41.2971, lon: 2.0785 },
  { iata: "SFO", name: "San Francisco International Airport", city: "San Francisco", lat: 37.6213, lon: -122.3790 },
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

// Function to analyze profitability
function analyzeProfit(distance: number, aircraftType: string, loadFactor: number, rask: number, cask: number, fuelPrice: number) {
  const aircraft = AIRCRAFT_DATA[aircraftType as keyof typeof AIRCRAFT_DATA];
  const ASK = distance * aircraft.seats;
  const RPK = ASK * loadFactor;
  const revenue = rask * RPK;
  const cost = cask * ASK + (aircraft.fuel_burn_km * fuelPrice * distance);
  return { revenue, cost, profit: revenue - cost };
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
  const [profitAnalysis, setProfitAnalysis] = useState({ revenue: 0, cost: 0, profit: 0 });
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
                    <Label htmlFor="origin">Origin (IATA)</Label>
                    <Select value={originIATA} onValueChange={setOriginIATA}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin" />
                      </SelectTrigger>
                      <SelectContent>
                        {AIRPORTS.map(airport => (
                          <SelectItem key={airport.iata} value={airport.iata}>
                            {airport.iata} - {airport.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination (IATA)</Label>
                    <Select value={destIATA} onValueChange={setDestIATA}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {AIRPORTS.map(airport => (
                          <SelectItem key={airport.iata} value={airport.iata}>
                            {airport.iata} - {airport.city}
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
                  Analysis for {originIATA} to {destIATA} route using {aircraft}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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