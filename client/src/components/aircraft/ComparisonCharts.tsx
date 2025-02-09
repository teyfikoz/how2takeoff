import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { Aircraft } from '@shared/schema';

interface Props {
  aircraftData: Aircraft[];
}

const ComparisonCharts: React.FC<Props> = ({ aircraftData }) => {
  // Fuel efficiency comparison
  const fuelEfficiencyData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    'Efficiency Score': (aircraft.maxRange * aircraft.maxPayload) /
               (aircraft.fuelCapacity * 1000),
    'Fuel per NM': aircraft.baseFuelFlow / aircraft.cruiseSpeed
  }));

  // Payload efficiency impact analysis with 10% intervals
  const payloadEfficiencyData = aircraftData.map(aircraft => {
    return Array.from({ length: 11 }, (_, i) => i * 10).map(loadFactor => ({
      name: aircraft.name,
      loadFactor: loadFactor,
      fuelEfficiency: aircraft.fuelEfficiency * (1 - (loadFactor/100 * 0.1))
    }));
  }).flat();

  // Range and payload comparison
  const rangeComparisonData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    'Max Range': aircraft.maxRange,
    'Max Payload': aircraft.maxPayload / 1000, // Convert to tons for better visualization
  }));

  // Emissions data
  const emissionsData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    'CO2': aircraft.baseFuelFlow * aircraft.fuelEfficiency * 3.16,
    'NOx': aircraft.baseFuelFlow * aircraft.fuelEfficiency * 0.014
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Fuel Efficiency Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={fuelEfficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12, marginTop: '10px' }}/>
            <Bar dataKey="Efficiency Score" fill="#8884d8" />
            <Bar dataKey="Fuel per NM" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Payload Factor Impact</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={payloadEfficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="loadFactor" 
              label={{ 
                value: 'Load Factor (%)', 
                position: 'bottom',
                offset: 0,
                style: { fontSize: 12 }
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ 
                value: 'Fuel Efficiency', 
                angle: -90, 
                position: 'insideLeft',
                offset: -35,
                style: { fontSize: 12 }
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            {aircraftData.map((aircraft, index) => (
              <Line
                key={aircraft.id}
                type="monotone"
                dataKey="fuelEfficiency"
                data={payloadEfficiencyData.filter(d => d.name === aircraft.name)}
                name={aircraft.name}
                stroke={`hsl(${index * 360 / aircraftData.length}, 70%, 50%)`}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Range and Payload Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={rangeComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{fontSize: 12}}
            />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="Max Range" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="Max Payload" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Emissions Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={emissionsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{fontSize: 12}}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="CO2" fill="#ff7300" />
            <Bar dataKey="NOx" fill="#387908" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonCharts;