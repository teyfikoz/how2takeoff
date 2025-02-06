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

  // Genişletilmiş rüzgar etkisi analizi
  const windEffectData = aircraftData.map(aircraft => {
    const baseRange = aircraft.maxRange;
    // Rüzgar hızı varyasyonları (-40%, -20%, 0%, +20%, +40%)
    const windSpeedVariations = [-0.4, -0.2, 0, 0.2, 0.4];
    const baseWindSpeed = 20; // Örnek baz rüzgar hızı
    const windDirection = 180; // Ters rüzgar senaryosu

    return windSpeedVariations.map(variation => {
      const windSpeed = baseWindSpeed * (1 + variation);
      const windEffect = Math.cos((windDirection * Math.PI) / 180) * windSpeed;
      const effectiveRange = baseRange * (1 - (windEffect / aircraft.cruiseSpeed));

      return {
        name: aircraft.name,
        variation: `${variation >= 0 ? '+' : ''}${variation * 100}%`,
        windSpeed: Math.round(windSpeed),
        range: Math.round(effectiveRange)
      };
    });
  }).flat();

  // Yük kapasitesi kullanım oranı analizi
  const payloadEfficiencyData = aircraftData.map(aircraft => {
    return [0.25, 0.5, 0.75, 1].map(loadFactor => ({
      name: aircraft.name,
      loadFactor: loadFactor * 100,
      fuelEfficiency: aircraft.fuelEfficiency * (1 - (loadFactor * 0.1))
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
        <h3 className="text-xl font-bold mb-4">Yakıt Verimliliği Karşılaştırması</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={fuelEfficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="efficiency" fill="#8884d8" name="Verimlilik Skoru" />
            <Bar dataKey="fuelPerNM" fill="#82ca9d" name="NM Başına Yakıt" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Rüzgar Etkisi Analizi</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="variation" 
              label={{ value: 'Rüzgar Hızı Değişimi', position: 'bottom' }} 
            />
            <YAxis 
              label={{ value: 'Efektif Menzil (km)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip />
            <Legend />
            {aircraftData.map((aircraft, index) => (
              <Line
                key={aircraft.id}
                type="monotone"
                data={windEffectData.filter(d => d.name === aircraft.name)}
                dataKey="range"
                name={`${aircraft.name} Menzili`}
                stroke={`hsl(${index * 360 / aircraftData.length}, 70%, 50%)`}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Yük Faktörü Etkisi</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={payloadEfficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="loadFactor" label={{ value: 'Yük Faktörü (%)', position: 'bottom' }} />
            <YAxis label={{ value: 'Yakıt Verimliliği', angle: -90, position: 'insideLeft' }} />
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
        <h3 className="text-xl font-bold mb-4">Menzil ve Yük Kapasitesi</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={rangeComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="maxRange" fill="#8884d8" name="Maksimum Menzil (km)" />
            <Bar yAxisId="right" dataKey="maxPayload" fill="#82ca9d" name="Maksimum Yük (ton)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Emisyon Karşılaştırması</h3>
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