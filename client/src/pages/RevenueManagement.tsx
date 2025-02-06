import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiAirchina } from "react-icons/si";

// Sample data - In real app, this would come from API
const revenueData = [
  { month: 'Jan', directRevenue: 12000, connectingRevenue: 8000 },
  { month: 'Feb', directRevenue: 13000, connectingRevenue: 8500 },
  { month: 'Mar', directRevenue: 15000, connectingRevenue: 9000 },
  { month: 'Apr', directRevenue: 14000, connectingRevenue: 8800 },
  { month: 'May', directRevenue: 16000, connectingRevenue: 9500 },
  { month: 'Jun', directRevenue: 18000, connectingRevenue: 10000 },
];

const loadFactorData = [
  { route: 'IST-JFK', loadFactor: 85 },
  { route: 'IST-LHR', loadFactor: 78 },
  { route: 'IST-CDG', loadFactor: 82 },
  { route: 'IST-DXB', loadFactor: 88 },
];

const routeTypeData = [
  { name: 'Direct Flights', value: 60 },
  { name: 'Connecting Flights', value: 40 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function RevenueManagement() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <SiAirchina className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Revenue Management & Route Optimization
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Comprehensive analysis of revenue streams, route performance, and optimization opportunities.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue Trends */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Revenue Trends by Flight Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="directRevenue" 
                      stroke="#8884d8" 
                      name="Direct Flights"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="connectingRevenue" 
                      stroke="#82ca9d" 
                      name="Connecting Flights"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Load Factors */}
          <Card>
            <CardHeader>
              <CardTitle>Route Load Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={loadFactorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="route" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="loadFactor" fill="#8884d8" name="Load Factor (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Route Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Route Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={routeTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {routeTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Key Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">RASK</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">$0.112</p>
                    <p className="text-xs text-gray-500">Revenue per Available Seat KM</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Average Load Factor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">82.5%</p>
                    <p className="text-xs text-gray-500">Across all routes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Yield</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">$0.138</p>
                    <p className="text-xs text-gray-500">Revenue per RPK</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Network Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">94.2%</p>
                    <p className="text-xs text-gray-500">Route utilization</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
