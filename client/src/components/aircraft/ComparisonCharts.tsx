import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

interface Props {
  aircraftData: any[];
}

const ComparisonCharts: React.FC<Props> = ({ aircraftData }) => {
  const fuelEfficiencyData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    efficiency: (aircraft.maxRange * aircraft.maxPayload) / 
               (aircraft.fuelCapacity * 1000),
    fuelPerNM: aircraft.baseFuelFlow / aircraft.cruiseSpeed
  }));

  const emissionsData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    co2: aircraft.baseFuelFlow * 3.16,
    nox: aircraft.baseFuelFlow * 0.014,
    total: aircraft.baseFuelFlow * 3.174
  }));

  const rangeComparisonData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    maxRange: aircraft.maxRange,
    maxPayload: aircraft.maxPayload / 1000, // Convert to tons
    efficiency: aircraft.fuelEfficiency
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
        <h3 className="text-xl font-bold mb-4">Emissions Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={emissionsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="co2" stroke="#ff7300" name="CO2" />
            <Line type="monotone" dataKey="nox" stroke="#387908" name="NOx" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Range vs Payload Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={rangeComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="maxRange" fill="#8884d8" name="Max Range (nm)" />
            <Bar yAxisId="right" dataKey="maxPayload" fill="#82ca9d" name="Max Payload (tons)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonCharts;
