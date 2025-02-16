import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { Aircraft } from '@shared/schema';

interface Props {
  aircraftData: Aircraft[];
}

const WindImpactChart: React.FC<Props> = ({ aircraftData }) => {
  const windSpeeds = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];

  const calculateImpact = (baseRange: number, windSpeed: number, efficiency: number) => {
    const windFactor = (windSpeed / 100) * 0.05; // 5% impact per 100 knots
    const effectiveRange = baseRange * (1 + (windFactor * efficiency));
    const fuelConsumption = efficiency * (1 - (windFactor * efficiency)); // Base fuel consumption adjusted by wind
    return { effectiveRange, fuelConsumption };
  };

  const chartData = useMemo(() => {
    return windSpeeds.map(speed => {
      const dataPoint: any = { windSpeed: speed };

      aircraftData.forEach(aircraft => {
        const impact = calculateImpact(aircraft.maxRange, speed, aircraft.fuelEfficiency);
        dataPoint[`${aircraft.name}_range`] = impact.effectiveRange;
        dataPoint[`${aircraft.name}_fuel`] = impact.fuelConsumption;
      });

      return dataPoint;
    });
  }, [aircraftData]);

  const getColorForIndex = (index: number) => {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-2">Wind Impact Analysis</h3>
      <p className="text-gray-600 mb-4">Effect of Wind on Range & Fuel Consumption Across Aircraft</p>
      <ResponsiveContainer width="100%" height={500}>
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
          <YAxis
            yAxisId="fuel"
            orientation="right"
            label={{
              value: 'Fuel Efficiency',
              angle: 90,
              position: 'insideRight',
              offset: 5,
              style: { fontSize: 12 }
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name.includes('range')) {
                return [`${value.toLocaleString()} km`, `Range (${name.split('_')[0]})`];
              }
              return [`${(value * 100).toFixed(2)}%`, `Fuel Efficiency (${name.split('_')[0]})`];
            }}
            labelFormatter={(label: number) => `Wind Speed: ${label} kt`}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: '20px' }} />

          {aircraftData.map((aircraft, index) => (
            <React.Fragment key={aircraft.id}>
              <Line
                yAxisId="range"
                type="monotone"
                dataKey={`${aircraft.name}_range`}
                stroke={getColorForIndex(index * 2)}
                name={`${aircraft.name} Range`}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="fuel"
                type="monotone"
                dataKey={`${aircraft.name}_fuel`}
                stroke={getColorForIndex(index * 2 + 1)}
                name={`${aircraft.name} Fuel`}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                strokeDasharray="5 5"
              />
            </React.Fragment>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WindImpactChart;