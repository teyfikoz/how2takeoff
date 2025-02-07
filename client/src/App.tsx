import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import AircraftDatabase from "@/pages/AircraftDatabase";
import BasicAviationPassenger from "@/pages/BasicAviationPassenger";
import BasicAviationCargo from "@/pages/BasicAviationCargo";
import RevenueManagement from "@/pages/RevenueManagement";
import CarrierTypes from "@/pages/CarrierTypes";
import TicketingDistribution from "@/pages/TicketingDistribution";
import AirlineCRM from "@/pages/AirlineCRM";
import AboutMe from "@/pages/AboutMe";
import { Database, Home, BookOpen, TrendingUp, Plane, Globe, Users, User } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4">
            <Link href="/" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
            <Link href="/basic-aviation-passenger" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
              <BookOpen className="h-5 w-5 mr-2" />
              Basic Aviation Passenger
            </Link>
            <Link href="/revenue-management" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
              <TrendingUp className="h-5 w-5 mr-2" />
              Revenue Management & Route Opt.
            </Link>
            <Link href="/ticketing-distribution" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
              <Globe className="h-5 w-5 mr-2" />
              Ticketing & Distribution
            </Link>
            <Link href="/airline-crm" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
              <Users className="h-5 w-5 mr-2" />
              Airline CRM
            </Link>
            <Link href="/basic-aviation-cargo" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
              <BookOpen className="h-5 w-5 mr-2" />
              Basic Aviation Cargo
            </Link>
            <Link href="/carrier-types" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
              <Plane className="h-5 w-5 mr-2" />
              Carrier Types
            </Link>
            <Link href="/database" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
              <Database className="h-5 w-5 mr-2" />
              Aircraft Database
            </Link>
            <Link href="/about" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
              <User className="h-5 w-5 mr-2" />
              About Me
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/basic-aviation-passenger" component={BasicAviationPassenger} />
        <Route path="/revenue-management" component={RevenueManagement} />
        <Route path="/ticketing-distribution" component={TicketingDistribution} />
        <Route path="/airline-crm" component={AirlineCRM} />
        <Route path="/basic-aviation-cargo" component={BasicAviationCargo} />
        <Route path="/carrier-types" component={CarrierTypes} />
        <Route path="/database" component={AircraftDatabase} />
        <Route path="/about" component={AboutMe} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;