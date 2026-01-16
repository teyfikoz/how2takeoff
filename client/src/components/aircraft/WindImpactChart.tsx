import React, { useMemo, useState } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";
import { Aircraft } from "@shared/schema";
import { ArrowRight, RotateCcw, RotateCw, Wind } from "lucide-react";

interface Props {
  aircraftData: any[];
}

const WindImpactChart: React.FC<Props> = ({ aircraftData }) => {
  const windSpeeds = [-50, -30, -10, 0, 10, 30, 50];
  const [windDirection, setWindDirection] = useState<number>(0);
  
  const calculateImpact = (baseRange: number, windSpeed: number, efficiency: number) => {
    const windFactor = (windSpeed / 100) * 0.05;
    const effectiveRange = baseRange * (1 + (windFactor * efficiency));
    const fuelConsumption = efficiency * (1 - (windFactor * efficiency));
    return { effectiveRange, fuelConsumption };
  };

  const chartData = useMemo(() => {
    return windSpeeds.map(speed => {
      const dataPoint: any = { 
        windSpeed: speed,
        windLabel: `${speed > 0 ? "+" : ""}${speed} kt`
      };

      // Calculate average range and fuel for this wind speed
      let totalRange = 0;
      let totalFuel = 0;
      
      aircraftData.forEach(aircraft => {
        const impact = calculateImpact(aircraft.maxRange, speed, aircraft.fuelEfficiency);
        dataPoint[`${aircraft.name}_range`] = +impact.effectiveRange.toFixed(0);
        dataPoint[`${aircraft.name}_fuel`] = +(impact.fuelConsumption * 100).toFixed(2);
        totalRange += impact.effectiveRange;
        totalFuel += impact.fuelConsumption * 100;
      });

      // Add averages for combo view
      dataPoint.avgRange = Math.round(totalRange / aircraftData.length);
      dataPoint.avgFuel = +(totalFuel / aircraftData.length).toFixed(2);

      return dataPoint;
    });
  }, [aircraftData]);

  const rangeColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
  const fuelColors = ["#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa", "#f472b6"];

  const getWindArrowStyles = () => {
    return {
      animation: "pulse 2s infinite",
      transform: `rotate(${windDirection}deg)`,
      transformOrigin: "center",
      transition: "transform 0.5s ease-in-out"
    };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-blue-300 rounded-lg shadow-lg max-w-xs">
          <p className="font-bold text-gray-800 mb-2">Wind Speed: {label} kt</p>
          <div className="space-y-1">
            {payload.slice(0, 4).map((entry: any, index: number) => (
              <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
                {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
                {entry.name.includes("Fuel") ? "%" : " km"}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-cyan-50 p-6 rounded-xl shadow-lg border-2 border-cyan-200">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2 text-gray-800 flex items-center gap-2">
            <Wind className="h-7 w-7 text-cyan-600" />
            Wind Impact Analysis (Combo Chart)
          </h3>
          <p className="text-gray-600 text-base">Bars show Range, Lines show Fuel Efficiency</p>
        </div>
        <div className="flex items-center bg-white rounded-xl p-2 shadow-md border-2 border-cyan-200">
          <button 
            onClick={() => setWindDirection((prev) => (prev - 45 + 360) % 360)}
            className="p-2 hover:bg-cyan-100 rounded-lg transition-all duration-200"
            title="Rotate wind counterclockwise"
          >
            <RotateCcw className="h-6 w-6 text-cyan-700" />
          </button>
          <div className="mx-4 flex items-center space-x-3">
            <ArrowRight 
              className="h-8 w-8 text-cyan-600" 
              style={getWindArrowStyles()} 
            />
            <span className="text-lg font-bold text-gray-700 min-w-[60px]">{windDirection}°</span>
          </div>
          <button 
            onClick={() => setWindDirection((prev) => (prev + 45) % 360)}
            className="p-2 hover:bg-cyan-100 rounded-lg transition-all duration-200"
            title="Rotate wind clockwise"
          >
            <RotateCw className="h-6 w-6 text-cyan-700" />
          </button>
        </div>
      </div>
      
      <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong className="text-blue-700">Bars</strong> represent average effective range. 
          <strong className="text-green-700 ml-2">Lines</strong> represent fuel efficiency percentage.
          Positive wind speeds = tailwinds (favorable), Negative = headwinds (unfavorable).
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 60, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.7} />
          <XAxis
            dataKey="windLabel"
            label={{
              value: "Wind Speed (knots)",
              position: "bottom",
              offset: 10,
              style: { fontSize: 15, fontWeight: 600, fill: "#374151" }
            }}
            tick={{ fontSize: 14, fontWeight: 500, fill: "#374151" }}
          />
          <YAxis
            yAxisId="range"
            label={{
              value: "Effective Range (km)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { fontSize: 15, fontWeight: 600, fill: "#3b82f6" }
            }}
            tick={{ fontSize: 14, fontWeight: 500, fill: "#3b82f6" }}
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <YAxis
            yAxisId="fuel"
            orientation="right"
            label={{
              value: "Fuel Efficiency (%)",
              angle: 90,
              position: "insideRight",
              offset: 10,
              style: { fontSize: 15, fontWeight: 600, fill: "#10b981" }
            }}
            tick={{ fontSize: 14, fontWeight: 500, fill: "#10b981" }}
            stroke="#10b981"
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: 14, fontWeight: 600, paddingTop: "25px" }} 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconSize={24}
          />

          {/* Bars for Range */}
          <Bar
            yAxisId="range"
            dataKey="avgRange"
            fill="#3b82f6"
            name="Avg Range"
            radius={[8, 8, 0, 0]}
            opacity={0.8}
          />

          {/* Lines for Fuel Efficiency */}
          <Line
            yAxisId="fuel"
            type="monotone"
            dataKey="avgFuel"
            stroke="#10b981"
            name="Avg Fuel Eff"
            strokeWidth={4}
            dot={{ r: 6, fill: "#10b981", strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default WindImpactChart;
