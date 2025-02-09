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
    'Efficiency Score': aircraft.fuelEfficiency,
    'Fuel per NM': aircraft.co2Factor / aircraft.cruiseSpeed
  }));

  // Payload efficiency impact analysis with fixed intervals
  const payloadEfficiencyData = [];
  const loadFactors = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  aircraftData.forEach(aircraft => {
    loadFactors.forEach(loadFactor => {
      payloadEfficiencyData.push({
        name: aircraft.name,
        loadFactor,
        fuelEfficiency: aircraft.fuelEfficiency * (1 - (loadFactor/100 * 0.1))
      });
    });
  });

  // Range and payload comparison
  const rangeComparisonData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    'Max Range': aircraft.maxRange,
    'Max Payload': aircraft.cargoCapacity / 1000 // Convert to tons
  }));

  // Emissions data
  const emissionsData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    'CO2': aircraft.co2Factor * aircraft.fuelEfficiency,
    'NOx': (aircraft.co2Factor * aircraft.fuelEfficiency) * 0.004 // NOx factor
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
              type="number"
              domain={[0, 100]}
              ticks={loadFactors}
            />
            <YAxis 
              label={{ 
                value: 'Fuel Efficiency', 
                angle: -90, 
                position: 'insideLeft',
                offset: -5,
                style: { fontSize: 12 }
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: '20px' }}/>
            {aircraftData.map((aircraft, index) => (
              <Line
                key={aircraft.id}
                type="monotone"
                dataKey="fuelEfficiency"
                data={payloadEfficiencyData.filter(d => d.name === aircraft.name)}
                name={aircraft.name}
                stroke={`hsl(${index * 360 / aircraftData.length}, 70%, 50%)`}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Range and Payload Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={rangeComparisonData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{fontSize: 12}}
            />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{fontSize: 12}} />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{fontSize: 12}} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: '20px' }}/>
            <Bar yAxisId="left" dataKey="Max Range" fill="#8884d8" name="Max Range (km)" />
            <Bar yAxisId="right" dataKey="Max Payload" fill="#82ca9d" name="Max Payload (tons)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Emissions Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={emissionsData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{fontSize: 12}}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: '20px' }}/>
            <Bar dataKey="CO2" fill="#ff7300" name="CO2 Emissions" />
            <Bar dataKey="NOx" fill="#387908" name="NOx Emissions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonCharts;