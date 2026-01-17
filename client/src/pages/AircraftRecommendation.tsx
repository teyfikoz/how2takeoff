import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Loader2, TrendingUp, Fuel, DollarSign, Users, Plane, Package, Scale, Box, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSEO } from '@/hooks/useSEO';
import { AIRPORTS } from '@/data/airports-db';

interface Recommendation {
  aircraft: string;
  score: number;
  fuelEfficiency: number;
  operatingCost: number;
  revenue: number;
  profit: number;
  co2Emissions: number;
  breakEvenLoadFactor: number;
  details: {
    range: number;
    passengers: number;
    cargo: number;
    cruiseSpeed: number;
  };
  reasoning: string[];
}

// Standard cargo density factor (kg per m³) - typical for air cargo
const CARGO_DENSITY_FACTOR = 167; // IATA standard volumetric weight factor

export default function AircraftRecommendation() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState('180');
  const [cargo, setCargo] = useState('0');
  const [cargoUnit, setCargoUnit] = useState<'kg' | 'm3'>('kg');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [explanation, setExplanation] = useState('');

  // Airport search states
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');

  useSEO({
    title: 'AI Aircraft Recommendation - How2TakeOff',
    description: 'Get intelligent aircraft suggestions powered by our AI decision engine. Find the best aircraft for your route based on passengers, cargo, and profitability.',
    keywords: 'aircraft recommendation, AI aviation, flight planning, aircraft selection, cargo aircraft',
    canonical: 'https://how2takeoff.com/aircraft-recommendation'
  });

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

  // Convert cargo to kg for API
  const getCargoInKg = (): number => {
    const cargoValue = parseFloat(cargo) || 0;
    if (cargoUnit === 'm3') {
      // Convert cubic meters to kg using volumetric weight factor
      return cargoValue * CARGO_DENSITY_FACTOR;
    }
    return cargoValue;
  };

  // Display conversion helper
  const getCargoConversionInfo = (): string => {
    const cargoValue = parseFloat(cargo) || 0;
    if (cargoUnit === 'm3' && cargoValue > 0) {
      return `= ${(cargoValue * CARGO_DENSITY_FACTOR).toLocaleString()} kg (volumetric weight)`;
    } else if (cargoUnit === 'kg' && cargoValue > 0) {
      return `= ${(cargoValue / CARGO_DENSITY_FACTOR).toFixed(2)} m³ (at ${CARGO_DENSITY_FACTOR} kg/m³)`;
    }
    return '';
  };

  const getAIRecommendation = async () => {
    if (!origin || !destination || !passengers) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin,
          destination,
          passengers: parseInt(passengers),
          cargo: getCargoInKg(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      setRecommendations(data.recommendations);
      setExplanation(data.explanation);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 flex items-center justify-center lg:justify-start gap-3">
            <Sparkles className="h-10 w-10 text-purple-600" />
            AI Aircraft Recommendation
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Get intelligent aircraft suggestions powered by our decision engine
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Plane className="h-6 w-6" />
                  Flight Parameters
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Enter your route and capacity requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                {/* Origin Airport */}
                <div className="space-y-2">
                  <Label htmlFor="ai-origin" className="text-sm font-medium">Origin Airport</Label>
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select origin airport" />
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
                              <span className="ml-1">-</span>
                              <span className="truncate max-w-[180px]">{airport.city}</span>
                              <span className="text-xs text-gray-400 ml-auto">{airport.country}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* Destination Airport */}
                <div className="space-y-2">
                  <Label htmlFor="ai-dest" className="text-sm font-medium">Destination Airport</Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select destination airport" />
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
                              <span className="ml-1">-</span>
                              <span className="truncate max-w-[180px]">{airport.city}</span>
                              <span className="text-xs text-gray-400 ml-auto">{airport.country}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* Passengers */}
                <div className="space-y-2">
                  <Label htmlFor="ai-passengers" className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Passengers
                  </Label>
                  <Input
                    id="ai-passengers"
                    type="number"
                    placeholder="180"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* Cargo with Unit Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ai-cargo" className="text-sm font-medium flex items-center gap-2">
                      <Package className="h-4 w-4 text-green-600" />
                      Cargo (optional)
                    </Label>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            <strong>Volumetric Weight:</strong> Cargo can be measured in kg (weight) or m³ (volume).
                            When using m³, we apply the IATA standard volumetric factor of {CARGO_DENSITY_FACTOR} kg/m³
                            for aircraft cargo capacity calculations.
                          </p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      id="ai-cargo"
                      type="number"
                      placeholder="0"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      className="h-11 flex-1"
                    />
                    <Tabs value={cargoUnit} onValueChange={(v) => setCargoUnit(v as 'kg' | 'm3')} className="w-auto">
                      <TabsList className="h-11">
                        <TabsTrigger value="kg" className="px-3 h-9 flex items-center gap-1">
                          <Scale className="h-3.5 w-3.5" />
                          kg
                        </TabsTrigger>
                        <TabsTrigger value="m3" className="px-3 h-9 flex items-center gap-1">
                          <Box className="h-3.5 w-3.5" />
                          m³
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {getCargoConversionInfo() && (
                    <p className="text-xs text-gray-500 italic">
                      {getCargoConversionInfo()}
                    </p>
                  )}
                </div>

                <Button
                  onClick={getAIRecommendation}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg h-12 mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get AI Recommendation
                    </>
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <p className="text-gray-700 font-medium">
                    Our AI analyzes route distance, passenger count, and cargo requirements
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700 font-medium">
                    Scores aircraft based on fuel efficiency, profitability, and CO2 emissions
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-gray-700 font-medium">
                    Returns top 5 recommendations with detailed reasoning
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {explanation && (
              <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-900 font-medium text-base ml-2">
                  {explanation}
                </AlertDescription>
              </Alert>
            )}

            {recommendations.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  Top Recommendations
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {recommendations.map((rec, index) => (
                    <Card key={index} className={`border-2 hover:shadow-xl transition-all duration-300 ${
                      index === 0 ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-white' :
                      index === 1 ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-white' :
                      index === 2 ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-white' :
                      'border-gray-200'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl flex items-center gap-3">
                            <span className={`rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold ${
                              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' :
                              index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                              index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' :
                              'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            }`}>
                              {index + 1}
                            </span>
                            <span className="text-gray-900">{rec.aircraft}</span>
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
                              Score: {rec.score}/100
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <div>
                              <span className="block text-xs text-gray-500">Est. Profit</span>
                              <span className="font-bold text-green-600">
                                ${Math.round(rec.profit).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                            <Fuel className="h-5 w-5 text-blue-600" />
                            <div>
                              <span className="block text-xs text-gray-500">Fuel Efficiency</span>
                              <span className="font-bold text-blue-600">{rec.fuelEfficiency.toFixed(1)} L/km</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                            <Users className="h-5 w-5 text-purple-600" />
                            <div>
                              <span className="block text-xs text-gray-500">Capacity</span>
                              <span className="font-bold text-purple-600">{rec.details.passengers} pax</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                            <Plane className="h-5 w-5 text-orange-600" />
                            <div>
                              <span className="block text-xs text-gray-500">Range</span>
                              <span className="font-bold text-orange-600">{Math.round(rec.details.range).toLocaleString()} km</span>
                            </div>
                          </div>
                        </div>

                        {rec.reasoning && rec.reasoning.length > 0 && (
                          <div className="bg-gray-50 p-4 rounded-lg border">
                            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-purple-600" />
                              Why this aircraft?
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1.5">
                              {rec.reasoning.map((reason, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : !loading && !error && (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="py-16">
                  <div className="text-center">
                    <Sparkles className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready to Analyze</h3>
                    <p className="text-gray-500">
                      Enter your route and requirements to get AI-powered aircraft recommendations
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
