import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData";
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
import Articles from "@/pages/Articles";
import FlightEstimator from "@/pages/FlightEstimator";
import DonationBanner from "@/components/DonationBanner";
import { Database, Home, BookOpen, TrendingUp, Plane, Globe, Users, User, Menu, X, BookText, Calculator } from "lucide-react";
import { useState, useEffect, useRef } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const menuItems = [
    { path: "/", icon: <Home className="h-5 w-5 mr-2" />, label: "Dashboard" },
    { path: "/flight-estimator", icon: <Calculator className="h-5 w-5 mr-2" />, label: "Flight Estimator" },
    { path: "/basic-aviation-passenger", icon: <BookOpen className="h-5 w-5 mr-2" />, label: "Basic Aviation Passenger" },
    { path: "/revenue-management", icon: <TrendingUp className="h-5 w-5 mr-2" />, label: "Revenue Management & Route Opt." },
    { path: "/ticketing-distribution", icon: <Globe className="h-5 w-5 mr-2" />, label: "Ticketing & Distribution" },
    { path: "/airline-crm", icon: <Users className="h-5 w-5 mr-2" />, label: "Airline CRM" },
    { path: "/basic-aviation-cargo", icon: <BookOpen className="h-5 w-5 mr-2" />, label: "Basic Aviation Cargo" },
    { path: "/carrier-types", icon: <Plane className="h-5 w-5 mr-2" />, label: "Carrier Types" },
    { path: "/database", icon: <Database className="h-5 w-5 mr-2" />, label: "Aircraft Database" },
    { path: "/articles", icon: <BookText className="h-5 w-5 mr-2" />, label: "Articles" },
    { path: "/about", icon: <User className="h-5 w-5 mr-2" />, label: "About Me" },
  ];

  const menuRow1 = menuItems.slice(0, 5);
  const menuRow2 = menuItems.slice(5);

  return (
    <nav className="bg-white shadow-sm border-b" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between md:min-h-[120px]">
          {/* Logo/Brand section */}
          <div className="flex items-center justify-between h-16 md:h-auto md:pt-4">
            <Link href="/" className="flex items-center px-2 text-gray-900 font-bold hover:text-blue-600">
              <Plane className="h-6 w-6 mr-2 text-blue-600" />
              <span className="text-lg">How2Takeoff</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          
          {/* Desktop Menu - 2 Rows with wrapping support */}
          <div className="hidden md:flex md:flex-col md:justify-center md:gap-2 md:py-2 md:flex-1">
            {/* First Row - 5 items */}
            <div className="flex flex-wrap gap-1 justify-end">
              {menuRow1.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    location === item.path 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              ))}
            </div>
            
            {/* Second Row - 6 items */}
            <div className="flex flex-wrap gap-1 justify-end">
              {menuRow2.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    location === item.path 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                location === item.path
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
      <div>
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-4">
          <DonationBanner />
        </div>
        <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/flight-estimator" component={FlightEstimator} />
        <Route path="/basic-aviation-passenger" component={BasicAviationPassenger} />
        <Route path="/revenue-management" component={RevenueManagement} />
        <Route path="/ticketing-distribution" component={TicketingDistribution} />
        <Route path="/airline-crm" component={AirlineCRM} />
        <Route path="/basic-aviation-cargo" component={BasicAviationCargo} />
        <Route path="/carrier-types" component={CarrierTypes} />
        <Route path="/database" component={AircraftDatabase} />
        <Route path="/articles" component={Articles} />
        <Route path="/about" component={AboutMe} />
        <Route component={NotFound} />
      </Switch>
    </div>
    </>
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