import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, TrendingUp, Fuel, DollarSign, Users, Plane } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

interface AIRecommendationProps {
  defaultOrigin?: string;
  defaultDestination?: string;
}

export default function AIRecommendation({ defaultOrigin = '', defaultDestination = '' }: AIRecommendationProps) {
  const [origin, setOrigin] = useState(defaultOrigin);
  const [destination, setDestination] = useState(defaultDestination);
  const [passengers, setPassengers] = useState('180');
  const [cargo, setCargo] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [explanation, setExplanation] = useState('');

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
          cargo: parseInt(cargo) || 0,
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
    <Card className="shadow-lg border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="h-7 w-7" />
          AI Aircraft Recommendation
        </CardTitle>
        <CardDescription className="text-purple-100 text-base">
          Get intelligent aircraft suggestions powered by our decision engine
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ai-origin">Origin (IATA)</Label>
            <Input
              id="ai-origin"
              placeholder="e.g., IST"
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              maxLength={3}
              className="uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-dest">Destination (IATA)</Label>
            <Input
              id="ai-dest"
              placeholder="e.g., SIN"
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              maxLength={3}
              className="uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ai-passengers">Passengers</Label>
            <Input
              id="ai-passengers"
              type="number"
              placeholder="180"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-cargo">Cargo (kg, optional)</Label>
            <Input
              id="ai-cargo"
              type="number"
              placeholder="0"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={getAIRecommendation}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg h-12"
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
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {explanation && (
          <Alert className="bg-blue-50 border-blue-200">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 font-medium">
              {explanation}
            </AlertDescription>
          </Alert>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-3 mt-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Top Recommendations
            </h4>
            {recommendations.map((rec, index) => (
              <Card key={index} className="border-2 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      {rec.aircraft}
                    </CardTitle>
                    <div className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                      Score: {rec.score}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Profit:</span>
                      <span className="text-green-600 font-bold">
                        ${Math.round(rec.profit).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Fuel Eff:</span>
                      <span>{rec.fuelEfficiency.toFixed(1)} L/km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Capacity:</span>
                      <span>{rec.details.passengers} pax</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Range:</span>
                      <span>{Math.round(rec.details.range).toLocaleString()} km</span>
                    </div>
                  </div>
                  {rec.reasoning && rec.reasoning.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Why this aircraft?</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {rec.reasoning.map((reason, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-green-600 font-bold">•</span>
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
        )}
      </CardContent>
    </Card>
  );
}
