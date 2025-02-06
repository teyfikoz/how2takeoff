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
  // Yakıt verimliliği karşılaştırması
  const fuelEfficiencyData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    efficiency: (aircraft.maxRange * aircraft.maxPayload) / 
               (aircraft.fuelCapacity * 1000),
    fuelPerNM: aircraft.baseFuelFlow / aircraft.cruiseSpeed
  }));

  // Rüzgar etkisi analizi için örnek veriler
  const windEffectData = aircraftData.map(aircraft => {
    const baseRange = aircraft.maxRange;
    return [0, 10, 20, 30, 40, 50].map(windSpeed => ({
      name: aircraft.name,
      windSpeed,
      range: baseRange * (1 - (windSpeed / 100)) // Basit rüzgar etkisi hesaplaması
    }));
  }).flat();

  // Yük kapasitesi kullanım oranı analizi
  const payloadEfficiencyData = aircraftData.map(aircraft => {
    return [0.25, 0.5, 0.75, 1].map(loadFactor => ({
      name: aircraft.name,
      loadFactor: loadFactor * 100,
      fuelEfficiency: aircraft.fuelEfficiency * (1 - (loadFactor * 0.1)) // Yük faktörü etkisi
    }));
  }).flat();

  // Menzil ve yük kapasitesi karşılaştırması
  const rangeComparisonData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    maxRange: aircraft.maxRange,
    maxPayload: aircraft.maxPayload / 1000, // Convert to tons for better visualization
  }));

  // Emisyon verileri
  const emissionsData = aircraftData.map(aircraft => ({
    name: aircraft.name,
    co2: aircraft.baseFuelFlow * aircraft.fuelEfficiency * 3.16, // CO2 emission factor
    nox: aircraft.baseFuelFlow * aircraft.fuelEfficiency * 0.014 // NOx emission factor
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
        <h3 className="text-xl font-bold mb-4">Wind Effect Analysis</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={windEffectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="windSpeed" label={{ value: 'Wind Speed (kt)', position: 'bottom' }} />
            <YAxis label={{ value: 'Range (nm)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {aircraftData.map((aircraft, index) => (
              <Line
                key={aircraft.id}
                type="monotone"
                dataKey="range"
                data={windEffectData.filter(d => d.name === aircraft.name)}
                name={aircraft.name}
                stroke={`hsl(${index * 360 / aircraftData.length}, 70%, 50%)`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Payload Efficiency Impact</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={payloadEfficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="loadFactor" label={{ value: 'Payload Load Factor (%)', position: 'bottom' }} />
            <YAxis label={{ value: 'Fuel Efficiency', angle: -90, position: 'insideLeft' }} />
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
              />
            ))}
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
    </div>
  );
};

export default ComparisonCharts;