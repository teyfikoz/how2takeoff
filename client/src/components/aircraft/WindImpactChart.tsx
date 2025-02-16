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
  
  const calculateEffectiveRange = (baseRange: number, windSpeed: number, efficiency: number) => {
    const windFactor = (windSpeed / 100) * 0.05; // 5% impact per 100 knots
    return baseRange * (1 + (windFactor * efficiency));
  };

  const chartData = useMemo(() => {
    return windSpeeds.map(speed => ({
      windSpeed: speed,
      tailwind: calculateEffectiveRange(aircraft.maxRange, Math.abs(speed), aircraft.fuelEfficiency),
      headwind: calculateEffectiveRange(aircraft.maxRange, -Math.abs(speed), aircraft.fuelEfficiency)
    }));
  }, [aircraft]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-2">{aircraft.name}</h3>
      <p className="text-gray-600 mb-4">Effect of Tailwind and Headwind on Aircraft Performance</p>
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
          <YAxis
            label={{
              value: 'Effective Range (km)',
              angle: -90,
              position: 'insideLeft',
              offset: -5,
              style: { fontSize: 12 }
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => `${value.toLocaleString()} km`}
            labelFormatter={(label: number) => `Wind Speed: ${label} kt`}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: '20px' }} />
          <Line
            type="monotone"
            dataKey="tailwind"
            stroke="#3498db"
            name="Tailwind"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="headwind"
            stroke="#e74c3c"
            name="Headwind"
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
