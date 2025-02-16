import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { Aircraft } from '@shared/schema';

interface Props {
  aircraft: Aircraft;
}

const WindImpactChart: React.FC<Props> = ({ aircraft }) => {
  const windSpeeds = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];

  const calculateImpact = (baseRange: number, windSpeed: number, efficiency: number) => {
    const windFactor = (windSpeed / 100) * 0.05; // 5% impact per 100 knots
    const effectiveRange = baseRange * (1 + (windFactor * efficiency));
    const fuelConsumption = aircraft.co2Factor * (1 - (windFactor * efficiency)); // Base fuel consumption adjusted by wind

    return { effectiveRange, fuelConsumption };
  };

  const chartData = useMemo(() => {
    return windSpeeds.map(speed => {
      const tailwindImpact = calculateImpact(aircraft.maxRange, Math.abs(speed), aircraft.fuelEfficiency);
      const headwindImpact = calculateImpact(aircraft.maxRange, -Math.abs(speed), aircraft.fuelEfficiency);

      return {
        windSpeed: speed,
        tailwindRange: tailwindImpact.effectiveRange,
        headwindRange: headwindImpact.effectiveRange,
        tailwindFuel: tailwindImpact.fuelConsumption,
        headwindFuel: headwindImpact.fuelConsumption
      };
    });
  }, [aircraft]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-2">{aircraft.name}</h3>
      <p className="text-gray-600 mb-4">Effect of Tailwind and Headwind on Range & Fuel Consumption</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="windSpeed"
            label={{
              value: 'Wind Speed (kt)',
              position: 'bottom',
              offset: 0,
              style: { fontSize: 12 }
            }}
            type="number"
            domain={[-50, 50]}
            ticks={windSpeeds}
          />
          {/* Range Y-axis (left) */}
          <YAxis
            yAxisId="range"
            label={{
              value: 'Effective Range (km)',
              angle: -90,
              position: 'insideLeft',
              offset: -5,
              style: { fontSize: 12 }
            }}
            tick={{ fontSize: 12 }}
          />
          {/* Fuel Consumption Y-axis (right) */}
          <YAxis
            yAxisId="fuel"
            orientation="right"
            label={{
              value: 'Fuel Consumption (kg/NM)',
              angle: 90,
              position: 'insideRight',
              offset: 5,
              style: { fontSize: 12 }
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name.includes('Range')) {
                return [`${value.toLocaleString()} km`, 'Range'];
              }
              return [`${value.toFixed(2)} kg/NM`, 'Fuel Consumption'];
            }}
            labelFormatter={(label: number) => `Wind Speed: ${label} kt`}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: '20px' }} />

          {/* Range Lines */}
          <Line
            yAxisId="range"
            type="monotone"
            dataKey="tailwindRange"
            stroke="#3498db"
            name="Range (Tailwind)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="range"
            type="monotone"
            dataKey="headwindRange"
            stroke="#e74c3c"
            name="Range (Headwind)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          {/* Fuel Consumption Lines */}
          <Line
            yAxisId="fuel"
            type="monotone"
            dataKey="tailwindFuel"
            stroke="#2ecc71"
            name="Fuel (Tailwind)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="fuel"
            type="monotone"
            dataKey="headwindFuel"
            stroke="#f39c12"
            name="Fuel (Headwind)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WindImpactChart;