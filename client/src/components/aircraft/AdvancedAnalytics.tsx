import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ComposedChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Aircraft } from '@shared/schema';

interface Props {
  aircraftData: Aircraft[];
}

const AdvancedAnalytics: React.FC<Props> = ({ aircraftData }) => {
  // Calculate fuel efficiency at different ranges
  const getFuelEfficiencyTrend = () => {
    const ranges = [1000, 2000, 3000, 4000, 5000]; // km
    return aircraftData.flatMap(aircraft => 
      ranges.map(range => ({
        name: aircraft.name,
        range,
        efficiency: aircraft.fuelEfficiency * (1 - (range / aircraft.maxRange) * 0.1)
      }))
    );
  };

  // Calculate takeoff performance based on temperature
  const getTakeoffPerformance = () => {
    const temperatures = [0, 10, 20, 30, 40]; // °C
    return aircraftData.flatMap(aircraft => 
      temperatures.map(temp => ({
        name: aircraft.name,
        temperature: temp,
        requiredRunway: aircraft.emptyWeight * (1 + (temp / 100)) * 0.3
      }))
    );
  };

  // Environmental impact calculations
  const getEnvironmentalImpact = () => {
    return aircraftData.map(aircraft => ({
      name: aircraft.name,
      co2: aircraft.fuelCapacity * 3.16, // kg CO2 per kg fuel
      noise: Math.sqrt(aircraft.maxPayload) * 0.5, // Approximated noise level
    }));
  };

  // Capacity optimization analysis
  const getCapacityOptimization = () => {
    return aircraftData.map(aircraft => ({
      name: aircraft.name,
      passengerCapacity: (aircraft.capacity.max + aircraft.capacity.min) / 2,
      cargoCapacity: aircraft.cargoCapacity / 1000, // Convert to tons
      efficiency: (aircraft.maxPayload / aircraft.emptyWeight) * 100
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Fuel Efficiency vs Range</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getFuelEfficiencyTrend()} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range"
                label={{ value: 'Range (km)', position: 'bottom', offset: 0 }}
              />
              <YAxis label={{ value: 'Fuel Efficiency', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              {aircraftData.map((aircraft, index) => (
                <Line
                  key={aircraft.id}
                  dataKey="efficiency"
                  data={getFuelEfficiencyTrend().filter(d => d.name === aircraft.name)}
                  name={aircraft.name}
                  stroke={`hsl(${index * 360 / aircraftData.length}, 70%, 50%)`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Takeoff Performance vs Temperature</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getTakeoffPerformance()} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="temperature"
                label={{ value: 'Temperature (°C)', position: 'bottom', offset: 0 }}
              />
              <YAxis label={{ value: 'Required Runway (m)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              {aircraftData.map((aircraft, index) => (
                <Line
                  key={aircraft.id}
                  dataKey="requiredRunway"
                  data={getTakeoffPerformance().filter(d => d.name === aircraft.name)}
                  name={aircraft.name}
                  stroke={`hsl(${index * 360 / aircraftData.length}, 70%, 50%)`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getEnvironmentalImpact()} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              <Bar yAxisId="left" dataKey="co2" fill="#8884d8" name="CO2 Emissions (kg)" />
              <Bar yAxisId="right" dataKey="noise" fill="#82ca9d" name="Noise Level (dB)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Capacity Optimization Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={getCapacityOptimization()} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              <Bar yAxisId="left" dataKey="passengerCapacity" fill="#8884d8" name="Passenger Capacity" />
              <Bar yAxisId="left" dataKey="cargoCapacity" fill="#82ca9d" name="Cargo Capacity (tons)" />
              <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#ff7300" name="Efficiency Ratio" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;
