import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';

interface Props {
  aircraftData: any[];
}

const ComparisonCharts: React.FC<Props> = ({ aircraftData }) => {
  // Fuel efficiency comparison
  const fuelEfficiencyData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    efficiency: (aircraft.maxRange * aircraft.maxPayload) / 
               (aircraft.fuelCapacity * 1000),
    fuelPerNM: aircraft.baseFuelFlow / aircraft.cruiseSpeed
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
    maxRange: aircraft.maxRange,
    maxPayload: aircraft.maxPayload / 1000, // Convert to tons for better visualization
  }));

  // Emissions data
  const emissionsData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    'CO2 Emissions': aircraft.baseFuelFlow * aircraft.fuelEfficiency * 3.16,
    'NOx Emissions': aircraft.baseFuelFlow * aircraft.fuelEfficiency * 0.014
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Fuel Efficiency Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={fuelEfficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency Score" />
            <Bar dataKey="fuelPerNM" fill="#82ca9d" name="Fuel per NM" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Payload Factor Impact</h3>
        <ResponsiveContainer width="100%" height={500}>
          <LineChart 
            data={payloadEfficiencyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="loadFactor" 
              label={{ 
                value: 'Load Factor (%)', 
                position: 'bottom',
                offset: 0
              }}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              domain={[0, 100]}
              type="number"
              padding={{ left: 30, right: 30 }}
              interval={0}
            />
            <YAxis 
              label={{ 
                value: 'Fuel Efficiency', 
                angle: -90, 
                position: 'insideLeft',
                offset: 15
              }}
              domain={['auto', 'auto']}
            />
            <Tooltip />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
            {aircraftData.map((aircraft, index) => (
              <Line
                key={aircraft.id}
                type="monotone"
                dataKey="fuelEfficiency"
                data={payloadEfficiencyData.filter(d => d.name === aircraft.name)}
                name={aircraft.name}
                stroke={`hsl(${index * 360 / aircraftData.length}, 70%, 50%)`}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                strokeWidth={2}
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
            />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
            <Bar yAxisId="left" dataKey="maxRange" fill="#8884d8" name="Max Range (km)" />
            <Bar yAxisId="right" dataKey="maxPayload" fill="#82ca9d" name="Max Payload (tons)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Emissions Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={emissionsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="CO2 Emissions" fill="#ff7300" name="CO2" />
            <Bar dataKey="NOx Emissions" fill="#387908" name="NOx" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonCharts;