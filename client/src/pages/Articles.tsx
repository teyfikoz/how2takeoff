import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';
import { ExternalLink, Zap, Plane, BarChart3 } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { HeaderAd, InContentAd } from '@/components/AdSense';
import { ArticleSchema } from '@/components/StructuredData';

// Define data for carbon emissions chart
const baseEmissionData = [
  { year: 2025, business: 100, green: 98, slow: 99 },
  { year: 2026, business: 101, green: 95, slow: 100 },
  { year: 2027, business: 103, green: 91, slow: 102 },
  { year: 2028, business: 104, green: 86, slow: 103 },
  { year: 2029, business: 106, green: 80, slow: 105 },
  { year: 2030, business: 107, green: 74, slow: 106 },
  { year: 2031, business: 109, green: 68, slow: 108 },
  { year: 2032, business: 110, green: 61, slow: 109 },
  { year: 2033, business: 112, green: 55, slow: 111 },
  { year: 2034, business: 113, green: 48, slow: 112 },
  { year: 2035, business: 115, green: 42, slow: 114 },
  { year: 2036, business: 116, green: 37, slow: 115 },
  { year: 2037, business: 118, green: 33, slow: 117 },
  { year: 2038, business: 119, green: 29, slow: 118 },
  { year: 2039, business: 121, green: 26, slow: 120 },
  { year: 2040, business: 122, green: 22, slow: 121 },
];

// Base passenger demand data
const basePassengerData = [
  { year: 2025, static: 5.2, ai: 5.3, uncertain: 5.0 },
  { year: 2026, static: 5.4, ai: 5.7, uncertain: 4.9 },
  { year: 2027, static: 5.6, ai: 6.1, uncertain: 5.1 },
  { year: 2028, static: 5.8, ai: 6.6, uncertain: 5.0 },
  { year: 2029, static: 6.0, ai: 7.0, uncertain: 5.2 },
  { year: 2030, static: 6.2, ai: 7.5, uncertain: 5.1 },
  { year: 2031, static: 6.4, ai: 8.0, uncertain: 5.3 },
  { year: 2032, static: 6.6, ai: 8.5, uncertain: 5.2 },
  { year: 2033, static: 6.8, ai: 9.0, uncertain: 5.4 },
  { year: 2034, static: 7.0, ai: 9.5, uncertain: 5.3 },
  { year: 2035, static: 7.2, ai: 10.0, uncertain: 5.5 },
  { year: 2036, static: 7.4, ai: 10.5, uncertain: 5.4 },
  { year: 2037, static: 7.6, ai: 11.0, uncertain: 5.6 },
  { year: 2038, static: 7.8, ai: 11.5, uncertain: 5.5 },
  { year: 2039, static: 8.0, ai: 12.0, uncertain: 5.7 },
  { year: 2040, static: 8.2, ai: 12.5, uncertain: 5.6 },
];

// Base quantum computing data
const baseQuantumData = [
  { year: 2025, classic: 120, quantum: 30, classicSaving: 5, quantumSaving: 18 },
  { year: 2026, classic: 119, quantum: 25, classicSaving: 5.5, quantumSaving: 22 },
  { year: 2027, classic: 118, quantum: 20, classicSaving: 6, quantumSaving: 25 },
  { year: 2028, classic: 117, quantum: 15, classicSaving: 6.5, quantumSaving: 28 },
  { year: 2029, classic: 116, quantum: 10, classicSaving: 7, quantumSaving: 32 },
  { year: 2030, classic: 115, quantum: 8, classicSaving: 7.5, quantumSaving: 35 },
  { year: 2031, classic: 114, quantum: 7, classicSaving: 8, quantumSaving: 38 },
  { year: 2032, classic: 113, quantum: 6, classicSaving: 8.5, quantumSaving: 41 },
  { year: 2033, classic: 112, quantum: 5, classicSaving: 9, quantumSaving: 44 },
  { year: 2034, classic: 111, quantum: 4, classicSaving: 9.5, quantumSaving: 46 },
  { year: 2035, classic: 110, quantum: 3, classicSaving: 10, quantumSaving: 49 },
  { year: 2036, classic: 109, quantum: 2.5, classicSaving: 10.5, quantumSaving: 51 },
  { year: 2037, classic: 108, quantum: 2, classicSaving: 11, quantumSaving: 53 },
  { year: 2038, classic: 107, quantum: 1.5, classicSaving: 11.5, quantumSaving: 55 },
  { year: 2039, classic: 106, quantum: 1, classicSaving: 12, quantumSaving: 57 },
  { year: 2040, classic: 105, quantum: 0.5, classicSaving: 12.5, quantumSaving: 60 },
];

// Base cargo data
const baseCargoData = [
  { year: 2025, ecommerce: 65, industrial: 62, advanced: 66 },
  { year: 2026, ecommerce: 69, industrial: 61, advanced: 72 },
  { year: 2027, ecommerce: 74, industrial: 60, advanced: 79 },
  { year: 2028, ecommerce: 79, industrial: 59, advanced: 87 },
  { year: 2029, ecommerce: 85, industrial: 58, advanced: 96 },
  { year: 2030, ecommerce: 91, industrial: 57, advanced: 106 },
  { year: 2031, ecommerce: 97, industrial: 56, advanced: 116 },
  { year: 2032, ecommerce: 104, industrial: 55, advanced: 128 },
  { year: 2033, ecommerce: 111, industrial: 54, advanced: 141 },
  { year: 2034, ecommerce: 119, industrial: 53, advanced: 155 },
  { year: 2035, ecommerce: 127, industrial: 52, advanced: 170 },
  { year: 2036, ecommerce: 136, industrial: 51, advanced: 187 },
  { year: 2037, ecommerce: 145, industrial: 50, advanced: 206 },
  { year: 2038, ecommerce: 155, industrial: 49, advanced: 226 },
  { year: 2039, ecommerce: 166, industrial: 48, advanced: 249 },
  { year: 2040, ecommerce: 178, industrial: 47, advanced: 274 },
];

export default function Articles() {
  useSEO({
    title: 'Aviation Industry Articles & Future Trends - How2TakeOff',
    description: 'Explore in-depth aviation industry articles covering carbon emissions, AI in aviation, quantum computing, cargo drone delivery, and future aviation trends with interactive scenarios.',
    keywords: 'aviation articles, aviation industry trends, carbon emissions aviation, AI aviation, quantum computing aviation, cargo drones, aviation future',
    canonical: 'https://how2takeoff.com/articles'
  });

  // State for modifying emissions scenario
  const [emissionScenario, setEmissionScenario] = useState('green');
  const [emissionReduction, setEmissionReduction] = useState(30);
  
  // State for passenger demand scenario
  const [passengerScenario, setPassengerScenario] = useState('ai');
  const [aiAdoption, setAiAdoption] = useState(50);
  
  // State for quantum computing scenario
  const [computingScenario, setComputingScenario] = useState('quantum');
  const [quantumAdvancement, setQuantumAdvancement] = useState(70);
  
  // State for cargo scenario
  const [cargoScenario, setCargoScenario] = useState('advanced');
  const [droneAdoption, setDroneAdoption] = useState(60);

  // Function to modify emission data based on user inputs
  const modifiedEmissionData = baseEmissionData.map(item => {
    const yearFactor = (item.year - 2025) / 15; // Normalize year impact (0 to 1)
    const reductionFactor = emissionReduction / 100;
    
    return {
      ...item,
      green: emissionScenario === 'green' 
        ? Math.max(10, item.green * (1 - (yearFactor * reductionFactor * 0.5)))
        : item.green,
      business: emissionScenario === 'business'
        ? item.business * (1 - (yearFactor * reductionFactor * 0.1))
        : item.business,
      slow: emissionScenario === 'slow'
        ? item.slow * (1 - (yearFactor * reductionFactor * 0.05))
        : item.slow
    };
  });

  // Function to modify passenger data based on user inputs
  const modifiedPassengerData = basePassengerData.map(item => {
    const yearFactor = (item.year - 2025) / 15;
    const adoptionFactor = aiAdoption / 100;
    
    return {
      ...item,
      ai: passengerScenario === 'ai'
        ? item.ai * (1 + (yearFactor * adoptionFactor * 0.5))
        : item.ai,
      static: passengerScenario === 'static'
        ? item.static * (1 + (yearFactor * adoptionFactor * 0.1))
        : item.static,
      uncertain: passengerScenario === 'uncertain'
        ? Math.max(4.5, item.uncertain * (1 + (Math.sin(item.year) * 0.2 * adoptionFactor)))
        : item.uncertain
    };
  });

  // Function to modify quantum data based on user inputs
  const modifiedQuantumData = baseQuantumData.map(item => {
    const yearFactor = (item.year - 2025) / 15;
    const advancementFactor = quantumAdvancement / 100;
    
    return {
      ...item,
      quantum: computingScenario === 'quantum'
        ? Math.max(0.1, item.quantum * (1 - (yearFactor * advancementFactor * 0.5)))
        : item.quantum,
      quantumSaving: computingScenario === 'quantum'
        ? Math.min(99, item.quantumSaving * (1 + (yearFactor * advancementFactor * 0.7)))
        : item.quantumSaving,
      classic: computingScenario === 'classic'
        ? item.classic * (1 - (yearFactor * advancementFactor * 0.1))
        : item.classic,
      classicSaving: computingScenario === 'classic'
        ? item.classicSaving * (1 + (yearFactor * advancementFactor * 0.3))
        : item.classicSaving
    };
  });

  // Function to modify cargo data based on user inputs
  const modifiedCargoData = baseCargoData.map(item => {
    const yearFactor = (item.year - 2025) / 15;
    const droneFactor = droneAdoption / 100;
    
    return {
      ...item,
      advanced: cargoScenario === 'advanced'
        ? item.advanced * (1 + (yearFactor * droneFactor * 1.0))
        : item.advanced,
      ecommerce: cargoScenario === 'ecommerce'
        ? item.ecommerce * (1 + (yearFactor * droneFactor * 0.5))
        : item.ecommerce,
      industrial: cargoScenario === 'industrial'
        ? Math.max(40, item.industrial * (1 - (yearFactor * droneFactor * 0.2)))
        : item.industrial
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              The Future of Aviation
            </h1>
            <h2 className="text-xl text-gray-700 mt-2">
              Impact of Artificial Intelligence, Quantum Computing, and Fusion Energy on Commercial Air Travel and Air Cargo by 2040
            </h2>
          </div>

          <div className="prose max-w-none">
            <p>
              The aviation industry stands on the brink of transformation. Emerging technologies such as artificial intelligence (AI), 
              quantum computing, and fusion energy are poised to reshape commercial aviation, cargo logistics, and passenger experiences. 
              This article explores how these innovations will redefine the future of air travel by 2040, considering the evolving dynamics 
              of fuel efficiency, sustainability, digital connectivity, and global cooperation.
            </p>
          </div>

          <Tabs defaultValue="co2">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="co2" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>CO₂ Emissions</span>
              </TabsTrigger>
              <TabsTrigger value="passengers" className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                <span>Passenger Demand</span>
              </TabsTrigger>
              <TabsTrigger value="quantum" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Quantum Computing</span>
              </TabsTrigger>
              <TabsTrigger value="cargo" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>Air Cargo</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="co2" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Carbon Dioxide Emissions Scenarios (2025-2040)</CardTitle>
                  <CardDescription>
                    Explore different emission paths based on technology adoption and policy implementation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4 col-span-1">
                      <div className="space-y-2">
                        <Label htmlFor="emission-scenario">Scenario</Label>
                        <Select 
                          value={emissionScenario}
                          onValueChange={setEmissionScenario}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select scenario" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="business">Business as Usual</SelectItem>
                            <SelectItem value="green">Green Innovation</SelectItem>
                            <SelectItem value="slow">Slow Adaptation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emission-reduction">Green Technology Adoption</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="emission-reduction"
                            min={0}
                            max={100}
                            step={1}
                            value={[emissionReduction]}
                            onValueChange={(values) => setEmissionReduction(values[0])}
                          />
                          <span className="w-12 text-sm">{emissionReduction}%</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-2 bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-sm">Scenario Description</h4>
                        {emissionScenario === 'green' && (
                          <p className="text-xs text-gray-600">
                            Green Innovation scenario assumes rapid adoption of sustainable technologies including SAF, electric aircraft, and improved operations, resulting in 40%+ emissions reduction by 2040.
                          </p>
                        )}
                        {emissionScenario === 'business' && (
                          <p className="text-xs text-gray-600">
                            Business as Usual assumes current trends continue with moderate improvements in efficiency but no dramatic technology breakthroughs or policy changes.
                          </p>
                        )}
                        {emissionScenario === 'slow' && (
                          <p className="text-xs text-gray-600">
                            Slow Adaptation assumes limited adoption of new technologies due to economic constraints, regulatory challenges, or other barriers, leading to minimal emissions reductions.
                          </p>
                        )}
                      </div>
                    </div>
                  
                    <div className="col-span-1 md:col-span-2">
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={modifiedEmissionData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                          <XAxis 
                            dataKey="year" 
                            label={{ 
                              value: 'Year', 
                              position: 'bottom',
                              offset: 0,
                              style: { fontSize: 12 }
                            }}
                          />
                          <YAxis 
                            label={{ 
                              value: 'CO₂ Emissions Index (2025=100)', 
                              angle: -90, 
                              position: 'insideLeft',
                              offset: -5,
                              style: { fontSize: 12 }
                            }}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`${value}`, 'Emission Index']}
                            labelFormatter={(label) => `Year: ${label}`}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="business" 
                            stroke="#8884d8" 
                            fill="#8884d8" 
                            fillOpacity={0.3} 
                            name="Business as Usual"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="green" 
                            stroke="#82ca9d" 
                            fill="#82ca9d" 
                            fillOpacity={0.3} 
                            name="Green Innovation"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="slow" 
                            stroke="#ffc658" 
                            fill="#ffc658" 
                            fillOpacity={0.3} 
                            name="Slow Adaptation"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="prose max-w-none">
                <h3>Environmental Impacts and CO₂ Emissions</h3>
                <p>
                  As air traffic grows, so does the challenge of mitigating environmental impact. By 2040, we anticipate:
                </p>
                <ul>
                  <li>ICAO and IATA-driven mandates for net-zero CO₂ emissions.</li>
                  <li>Carbon capture systems integrated into aircraft.</li>
                  <li>AI models to monitor emissions in real-time.</li>
                  <li>Fusion energy, while still under development, holds immense promise for zero-emission aviation in the long run.</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="passengers" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Driven Passenger Demand Projections (2025-2040)</CardTitle>
                  <CardDescription>
                    Explore how AI will transform passenger behavior and airline demand forecasting.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4 col-span-1">
                      <div className="space-y-2">
                        <Label htmlFor="passenger-scenario">Scenario</Label>
                        <Select 
                          value={passengerScenario}
                          onValueChange={setPassengerScenario}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select scenario" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ai">AI-Driven Personalization</SelectItem>
                            <SelectItem value="static">Static Demand Modeling</SelectItem>
                            <SelectItem value="uncertain">High Uncertainty</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ai-adoption">AI Technology Adoption Rate</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="ai-adoption"
                            min={0}
                            max={100}
                            step={1}
                            value={[aiAdoption]}
                            onValueChange={(values) => setAiAdoption(values[0])}
                          />
                          <span className="w-12 text-sm">{aiAdoption}%</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-2 bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-sm">Scenario Description</h4>
                        {passengerScenario === 'ai' && (
                          <p className="text-xs text-gray-600">
                            AI-Driven Personalization assumes advanced AI systems that deliver highly personalized travel experiences, leading to increased customer loyalty and more frequent travel.
                          </p>
                        )}
                        {passengerScenario === 'static' && (
                          <p className="text-xs text-gray-600">
                            Static Demand Modeling represents traditional forecasting methods with limited personalization and standard growth patterns.
                          </p>
                        )}
                        {passengerScenario === 'uncertain' && (
                          <p className="text-xs text-gray-600">
                            High Uncertainty scenario accounts for major disruptions similar to COVID-19, economic crises, or geopolitical events that create unpredictable demand patterns.
                          </p>
                        )}
                      </div>
                    </div>
                  
                    <div className="col-span-1 md:col-span-2">
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={modifiedPassengerData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                          <XAxis 
                            dataKey="year" 
                            label={{ 
                              value: 'Year', 
                              position: 'bottom',
                              offset: 0,
                              style: { fontSize: 12 }
                            }}
                          />
                          <YAxis 
                            label={{ 
                              value: 'Passengers (Billions)', 
                              angle: -90, 
                              position: 'insideLeft',
                              offset: -5,
                              style: { fontSize: 12 }
                            }}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`${value.toFixed(1)} billion`, 'Passengers']}
                            labelFormatter={(label) => `Year: ${label}`}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="static" 
                            stroke="#8884d8" 
                            name="Static Modeling"
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="ai" 
                            stroke="#82ca9d" 
                            name="AI-Driven"
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="uncertain" 
                            stroke="#ff7300" 
                            name="High Uncertainty"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="prose max-w-none">
                <h3>AI-Powered Operations and Autonomous Flight</h3>
                <p>
                  Artificial intelligence is already revolutionizing airline operations—from predictive maintenance and real-time route optimization to dynamic pricing and customer personalization. By 2040:
                </p>
                <ul>
                  <li>AI copilots and autonomous systems will assist or even replace human pilots in certain airspace zones.</li>
                  <li>Passenger personalization engines will optimize in-flight services, cabin environments, and loyalty programs.</li>
                  <li>AI-driven ATC (Air Traffic Control) will minimize delays and fuel burn through real-time coordination across global skies.</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="quantum" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quantum Computing Impact on Decision Times & Cost Savings (2025-2040)</CardTitle>
                  <CardDescription>
                    Explore how quantum computing will transform aviation logistics and scheduling optimization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4 col-span-1">
                      <div className="space-y-2">
                        <Label htmlFor="computing-scenario">Scenario</Label>
                        <Select 
                          value={computingScenario}
                          onValueChange={setComputingScenario}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select scenario" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quantum">Quantum Ready Airlines</SelectItem>
                            <SelectItem value="classic">Classical Computing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quantum-advancement">Quantum Tech Advancement</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="quantum-advancement"
                            min={0}
                            max={100}
                            step={1}
                            value={[quantumAdvancement]}
                            onValueChange={(values) => setQuantumAdvancement(values[0])}
                          />
                          <span className="w-12 text-sm">{quantumAdvancement}%</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-2 bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-sm">Scenario Description</h4>
                        {computingScenario === 'quantum' && (
                          <p className="text-xs text-gray-600">
                            Quantum Ready Airlines assumes rapid adoption of quantum computing for route optimization, fleet scheduling, and maintenance planning, leading to dramatic reductions in decision time and significant cost savings.
                          </p>
                        )}
                        {computingScenario === 'classic' && (
                          <p className="text-xs text-gray-600">
                            Classical Computing assumes continuing with traditional computing technologies with gradual improvements in algorithms and processing power.
                          </p>
                        )}
                      </div>
                    </div>
                  
                    <div className="col-span-1 md:col-span-2">
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={modifiedQuantumData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                          <XAxis 
                            dataKey="year" 
                            label={{ 
                              value: 'Year', 
                              position: 'bottom',
                              offset: 0,
                              style: { fontSize: 12 }
                            }}
                          />
                          <YAxis 
                            yAxisId="left"
                            label={{ 
                              value: 'Decision Time (sec)', 
                              angle: -90, 
                              position: 'insideLeft',
                              offset: -5,
                              style: { fontSize: 12 }
                            }}
                          />
                          <YAxis 
                            yAxisId="right"
                            orientation="right"
                            label={{ 
                              value: 'Cost Saving (%)', 
                              angle: 90, 
                              position: 'insideRight',
                              offset: 5,
                              style: { fontSize: 12 }
                            }}
                          />
                          <Tooltip 
                            formatter={(value: number, name: string) => {
                              if (name && typeof name === 'string' && name.includes('Saving')) {
                                return [`${value.toFixed(1)}%`, name];
                              }
                              return [`${value.toFixed(1)} sec`, name];
                            }}
                            labelFormatter={(label) => `Year: ${label}`}
                          />
                          <Legend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="classic" 
                            stroke="#8884d8" 
                            name="Classical Computing Time"
                            strokeWidth={2}
                          />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="quantum" 
                            stroke="#82ca9d" 
                            name="Quantum Computing Time"
                            strokeWidth={2}
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="classicSaving" 
                            stroke="#8884d8" 
                            name="Classical Computing Saving"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="quantumSaving" 
                            stroke="#82ca9d" 
                            name="Quantum Computing Saving"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="prose max-w-none">
                <h3>Quantum Computing in Aviation Logistics</h3>
                <p>
                  Quantum computing offers unprecedented processing power that will transform aviation logistics and scheduling:
                </p>
                <ul>
                  <li>Optimization of flight schedules, gate assignments, and maintenance windows in real-time.</li>
                  <li>Simulation of thousands of weather and traffic scenarios to determine the safest and most efficient flight paths.</li>
                  <li>Enhancement of crew pairing and aircraft rotations to reduce costs and increase fleet utilization.</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="cargo" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Air Cargo Volume Projections (2025-2040)</CardTitle>
                  <CardDescription>
                    Explore different scenarios for air cargo growth based on economic and technological factors.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4 col-span-1">
                      <div className="space-y-2">
                        <Label htmlFor="cargo-scenario">Scenario</Label>
                        <Select 
                          value={cargoScenario}
                          onValueChange={setCargoScenario}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select scenario" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ecommerce">E-commerce Boom</SelectItem>
                            <SelectItem value="industrial">Industrial Shift</SelectItem>
                            <SelectItem value="advanced">Advanced Air Cargo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="drone-adoption">Drone/Autonomous Vehicle Adoption</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="drone-adoption"
                            min={0}
                            max={100}
                            step={1}
                            value={[droneAdoption]}
                            onValueChange={(values) => setDroneAdoption(values[0])}
                          />
                          <span className="w-12 text-sm">{droneAdoption}%</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-2 bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-sm">Scenario Description</h4>
                        {cargoScenario === 'ecommerce' && (
                          <p className="text-xs text-gray-600">
                            E-commerce Boom assumes continued growth in global e-commerce, driving demand for air cargo with faster delivery times and more global trade.
                          </p>
                        )}
                        {cargoScenario === 'industrial' && (
                          <p className="text-xs text-gray-600">
                            Industrial Shift assumes more localized manufacturing and less reliance on global supply chains, reducing the need for air cargo.
                          </p>
                        )}
                        {cargoScenario === 'advanced' && (
                          <p className="text-xs text-gray-600">
                            Advanced Air Cargo assumes radical innovation with autonomous drones, AI-optimized logistics, and fusion-powered air freighters enabling entirely new cargo models.
                          </p>
                        )}
                      </div>
                    </div>
                  
                    <div className="col-span-1 md:col-span-2">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={modifiedCargoData.filter(d => d.year % 3 === 1)}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                          <XAxis 
                            dataKey="year" 
                            label={{ 
                              value: 'Year', 
                              position: 'bottom',
                              offset: 0,
                              style: { fontSize: 12 }
                            }}
                          />
                          <YAxis 
                            label={{ 
                              value: 'Cargo Volume Index (2025=100)', 
                              angle: -90, 
                              position: 'insideLeft',
                              offset: -5,
                              style: { fontSize: 12 }
                            }}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`${value.toFixed(1)}`, 'Volume Index']}
                            labelFormatter={(label) => `Year: ${label}`}
                          />
                          <Legend />
                          <Bar dataKey="ecommerce" fill="#8884d8" name="E-commerce Boom" />
                          <Bar dataKey="industrial" fill="#82ca9d" name="Industrial Shift" />
                          <Bar dataKey="advanced" fill="#ff7300" name="Advanced Air Cargo" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="prose max-w-none">
                <h3>Cargo Transportation 4.0</h3>
                <p>
                  Air cargo will see dramatic shifts:
                </p>
                <ul>
                  <li>Drone cargo fleets for last-mile delivery.</li>
                  <li>Predictive AI models for demand, customs clearance, and load factor optimization.</li>
                  <li>Blockchain-based tracking for enhanced security and transparency.</li>
                  <li>Fusion-powered long-haul cargo aircraft could reduce transit time and emissions.</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <div className="prose max-w-none">
            <h3>Conclusion</h3>
            <p>
              The convergence of AI, quantum computing, and fusion energy will redefine how humanity flies, moves goods, and experiences travel. 
              These advancements, when combined with a clear focus on sustainability and passenger-centric innovation, will chart a cleaner, 
              smarter, and more connected future for aviation.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">References</h3>
            <div className="space-y-2 text-sm">
              <p>IATA (2024). Annual Review 2024. https://www.iata.org/en/publications/economics/</p>
              <p>IATA (2025). Air Cargo Monthly Analysis – January 2025. https://www.iata.org</p>
              <p>IATA (n.d.). Value of Air Transport - Country Reports. https://www.iata.org/en/publications/economics/reports/value-of-air-transport-country-reports/</p>
              <p>ICAO (2023). Net-Zero CO2 Emissions by 2050 Vision. https://www.icao.int</p>
              <p>Boeing (2023). Commercial Market Outlook 2023–2042</p>
              <p>McKinsey & Company (2024). The future of air mobility and sustainability</p>
              <p>Eurocontrol (2023). AI and Automation in European Skies</p>
              <p>NASA (2023). Electric and Hybrid-Electric Propulsion Projects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}