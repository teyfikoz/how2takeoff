import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, AreaChart, Area
} from "recharts";
import { Aircraft } from "@shared/schema";

interface Props {
  aircraftData: Aircraft[];
}

const ComparisonCharts: React.FC<Props> = ({ aircraftData }) => {
  // Fuel efficiency comparison
  const fuelEfficiencyData = aircraftData.map(aircraft => ({
    name: aircraft.name.length > 15 ? aircraft.name.substring(0, 12) + "..." : aircraft.name,
    fullName: aircraft.name,
    "Efficiency Score": +(aircraft.fuelEfficiency * 100).toFixed(2),
    "Fuel per NM": +((aircraft.co2Factor / aircraft.cruiseSpeed) * 100).toFixed(2)
  }));

  // Payload efficiency impact analysis - IMPROVED with area chart
  const payloadEfficiencyData: any[] = [];
  const loadFactors = [0, 20, 40, 60, 80, 100];

  aircraftData.forEach(aircraft => {
    loadFactors.forEach(loadFactor => {
      payloadEfficiencyData.push({
        aircraft: aircraft.name,
        loadFactor,
        efficiency: +(aircraft.fuelEfficiency * (1 - (loadFactor/100 * 0.1)) * 100).toFixed(2)
      });
    });
  });

  // Range and payload comparison
  const rangeComparisonData = aircraftData.map(aircraft => ({
    name: aircraft.name.length > 15 ? aircraft.name.substring(0, 12) + "..." : aircraft.name,
    fullName: aircraft.name,
    "Max Range": aircraft.maxRange,
    "Max Payload": +(aircraft.cargoCapacity / 1000).toFixed(2)
  }));

  // Emissions data
  const emissionsData = aircraftData.map(aircraft => ({
    name: aircraft.name.length > 15 ? aircraft.name.substring(0, 12) + "..." : aircraft.name,
    fullName: aircraft.name,
    "CO2": +(aircraft.co2Factor * aircraft.fuelEfficiency).toFixed(3),
    "NOx": +((aircraft.co2Factor * aircraft.fuelEfficiency) * 0.004).toFixed(4)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const fullName = payload[0]?.payload?.fullName || label;
      return (
        <div className="bg-white p-4 border-2 border-blue-300 rounded-lg shadow-lg">
          <p className="font-bold text-gray-800 mb-2">{fullName}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const areaColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg border-2 border-blue-200">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">📊</span>
          Fuel Efficiency Comparison
        </h3>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart 
            data={fuelEfficiencyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 90 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 14, fontWeight: 500, fill: "#374151" }}
            />
            <YAxis 
              tick={{ fontSize: 14, fontWeight: 500, fill: "#374151" }}
              label={{ 
                value: "Efficiency %", 
                angle: -90, 
                position: "insideLeft",
                style: { fontSize: 14, fontWeight: 600 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: 14, fontWeight: 600, paddingTop: "20px" }}
              iconType="rect"
              iconSize={18}
            />
            <Bar dataKey="Efficiency Score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Fuel per NM" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg border-2 border-green-200">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-green-600">📈</span>
          Payload Factor Impact (Area Chart)
        </h3>
        <ResponsiveContainer width="100%" height={450}>
          <AreaChart 
            data={payloadEfficiencyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              {aircraftData.map((aircraft, index) => (
                <linearGradient key={aircraft.id} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={areaColors[index % areaColors.length]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={areaColors[index % areaColors.length]} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="loadFactor" 
              label={{ 
                value: "Load Factor (%)", 
                position: "bottom",
                offset: 10,
                style: { fontSize: 14, fontWeight: 600 }
              }}
              tick={{ fontSize: 14, fontWeight: 500, fill: "#374151" }}
              type="number"
              domain={[0, 100]}
              ticks={loadFactors}
            />
            <YAxis 
              label={{ 
                value: "Fuel Efficiency %", 
                angle: -90, 
                position: "insideLeft",
                offset: 10,
                style: { fontSize: 14, fontWeight: 600 }
              }}
              tick={{ fontSize: 14, fontWeight: 500, fill: "#374151" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: 14, fontWeight: 600, paddingTop: "20px" }}
              iconType="rect"
              iconSize={18}
            />
            {aircraftData.map((aircraft, index) => (
              <Area
                key={aircraft.id}
                type="monotone"
                dataKey="efficiency"
                data={payloadEfficiencyData.filter(d => d.aircraft === aircraft.name)}
                name={aircraft.name}
                stroke={areaColors[index % areaColors.length]}
                strokeWidth={3}
                fill={`url(#color${index})`}
                activeDot={{ r: 8 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl shadow-lg border-2 border-purple-200">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-purple-600">✈️</span>
          Range and Payload Comparison
        </h3>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart 
            data={rangeComparisonData}
            margin={{ top: 20, right: 60, left: 20, bottom: 90 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 14, fontWeight: 500, fill: "#374151" }}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke="#8b5cf6" 
              tick={{ fontSize: 14, fontWeight: 500 }}
              label={{ 
                value: "Range (km)", 
                angle: -90, 
                position: "insideLeft",
                style: { fontSize: 14, fontWeight: 600 }
              }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#10b981" 
              tick={{ fontSize: 14, fontWeight: 500 }}
              label={{ 
                value: "Payload (tons)", 
                angle: 90, 
                position: "insideRight",
                style: { fontSize: 14, fontWeight: 600 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: 14, fontWeight: 600, paddingTop: "20px" }}
              iconType="rect"
              iconSize={18}
            />
            <Bar 
              yAxisId="left" 
              dataKey="Max Range" 
              fill="#8b5cf6" 
              name="Max Range (km)"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              yAxisId="right" 
              dataKey="Max Payload" 
              fill="#10b981" 
              name="Max Payload (tons)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-xl shadow-lg border-2 border-orange-200">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-orange-600">🌍</span>
          Emissions Comparison
        </h3>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart 
            data={emissionsData}
            margin={{ top: 20, right: 30, left: 20, bottom: 90 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 14, fontWeight: 500, fill: "#374151" }}
            />
            <YAxis 
              tick={{ fontSize: 14, fontWeight: 500, fill: "#374151" }}
              label={{ 
                value: "Emissions", 
                angle: -90, 
                position: "insideLeft",
                style: { fontSize: 14, fontWeight: 600 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: 14, fontWeight: 600, paddingTop: "20px" }}
              iconType="rect"
              iconSize={18}
            />
            <Bar 
              dataKey="CO2" 
              fill="#f97316" 
              name="CO2 Emissions"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="NOx" 
              fill="#22c55e" 
              name="NOx Emissions"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonCharts;
