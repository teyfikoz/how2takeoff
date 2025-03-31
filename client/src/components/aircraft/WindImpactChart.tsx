import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { Aircraft } from '@shared/schema';
import { ArrowRight, RotateCcw, RotateCw } from 'lucide-react';

interface Props {
  aircraftData: Aircraft[];
}

const WindImpactChart: React.FC<Props> = ({ aircraftData }) => {
  const windSpeeds = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];
  const [windDirection, setWindDirection] = useState<number>(0);
  
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

  // Specific colors for better differentiation
  const rangeColors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];
  const fuelColors = ['#17becf', '#bcbd22', '#7f7f7f', '#e377c2', '#aec7e8', '#ffbb78'];

  const getWindArrowStyles = () => {
    // Animation for the arrow
    return {
      animation: 'pulse 2s infinite',
      transform: `rotate(${windDirection}deg)`,
      transformOrigin: 'center',
      transition: 'transform 0.5s ease-in-out'
    };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">Wind Impact Analysis</h3>
          <p className="text-gray-600">Effect of Wind on Range & Fuel Consumption Across Aircraft</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setWindDirection((prev) => (prev - 45) % 360)}
              className="p-1 hover:bg-gray-200 rounded-md transition"
              title="Rotate wind counterclockwise"
            >
              <RotateCcw className="h-5 w-5 text-gray-700" />
            </button>
            <div className="mx-2 flex items-center space-x-2">
              <ArrowRight 
                className="h-6 w-6 text-blue-500" 
                style={getWindArrowStyles()} 
              />
              <span className="text-sm text-gray-600">{windDirection}°</span>
            </div>
            <button 
              onClick={() => setWindDirection((prev) => (prev + 45) % 360)}
              className="p-1 hover:bg-gray-200 rounded-md transition"
              title="Rotate wind clockwise"
            >
              <RotateCw className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          This chart shows how different wind speeds affect both aircraft range (solid lines) and fuel consumption (dashed lines).
          Positive wind speeds represent tailwinds, negative speeds represent headwinds.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <span className="flex items-center text-sm">
            <span className="inline-block w-3 h-3 mr-1 rounded-full bg-blue-500"></span>
            Range (increased with tailwind)
          </span>
          <span className="flex items-center text-sm">
            <span className="inline-block w-3 h-3 mr-1 rounded-full bg-green-500"></span>
            Fuel Efficiency (improved with tailwind)
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
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
            stroke="#3498db"
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
            stroke="#2ecc71"
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name.includes('range')) {
                return [`${value.toLocaleString()} km`, `Range (${name.split('_')[0]})`];
              }
              return [`${(value * 100).toFixed(2)}%`, `Fuel Efficiency (${name.split('_')[0]})`];
            }}
            labelFormatter={(label: number) => `Wind Speed: ${label} kt`}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ddd' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: 12, paddingTop: '20px' }} 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />

          {aircraftData.map((aircraft, index) => (
            <React.Fragment key={aircraft.id}>
              <Line
                yAxisId="range"
                type="monotone"
                dataKey={`${aircraft.name}_range`}
                stroke={rangeColors[index % rangeColors.length]}
                name={`${aircraft.name} Range`}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="fuel"
                type="monotone"
                dataKey={`${aircraft.name}_fuel`}
                stroke={fuelColors[index % fuelColors.length]}
                name={`${aircraft.name} Fuel`}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                strokeDasharray="5 5"
              />
            </React.Fragment>
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default WindImpactChart;