import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiAirchina } from "react-icons/si";
import { Users, TrendingUp, Calculator, Target, UserCheck, DollarSign, Brain, Sparkles, History,
         Plane, CheckCircle, XCircle, CalendarClock, Ticket, Globe } from "lucide-react";
import CRMCalculator from "@/components/CRMCalculator";
import { useSEO } from '@/hooks/useSEO';

export default function AirlineCRM() {
  useSEO({
    title: 'Airline CRM Analytics & Customer Journey - How2TakeOff',
    description: 'Comprehensive airline CRM system covering customer journey, loyalty programs, CLV calculation, segmentation strategies, and marketing automation for airlines.',
    keywords: 'airline CRM, customer relationship management, airline loyalty programs, CLV, customer segmentation, airline marketing',
    canonical: 'https://how2takeoff.com/airline-crm'
  });

  // State for passenger prediction
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [seasonType, setSeasonType] = useState('summer');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [bookingType, setBookingType] = useState('early');
  const [routeType, setRouteType] = useState('mixed');
  const [priceSensitivity, setPriceSensitivity] = useState('medium');

  // Dropdown options
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const seasons = ['spring', 'summer', 'fall', 'winter', 'holiday'];
  const timesOfDay = ['morning', 'afternoon', 'evening', 'night'];
  const bookingTypes = ['early', 'regular', 'last_minute'];
  const routeTypes = ['business', 'leisure', 'mixed'];
  const priceSensitivityLevels = ['low', 'medium', 'high'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SiAirchina className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Airline CRM Analytics Dashboard
            </h1>
          </div>
          <p className="text-gray-700 text-lg mt-2">
            Comprehensive customer relationship management analytics and insights based on IATA standards
          </p>
        </header>

        {/* Key Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customer Lifetime Value</p>
                  <h3 className="text-3xl font-bold text-blue-600 mt-2">$4,250</h3>
                  <p className="text-xs text-gray-500 mt-1">Industry Average</p>
                </div>
                <DollarSign className="h-12 w-12 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Retention Rate</p>
                  <h3 className="text-3xl font-bold text-green-600 mt-2">73%</h3>
                  <p className="text-xs text-gray-500 mt-1">24-Month Period</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Customers</p>
                  <h3 className="text-3xl font-bold text-purple-600 mt-2">2.4M</h3>
                  <p className="text-xs text-gray-500 mt-1">Direct Booking</p>
                </div>
                <Users className="h-12 w-12 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Promoter Score</p>
                  <h3 className="text-3xl font-bold text-orange-600 mt-2">+42</h3>
                  <p className="text-xs text-gray-500 mt-1">Good Performance</p>
                </div>
                <Target className="h-12 w-12 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Passenger Demographics Analysis Section */}
        <Card className="border-purple-200 shadow-xl">
          <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-6 w-6 text-purple-600" />
              Passenger Demographics Analysis
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Comprehensive factors affecting passenger type prediction and demand patterns for targeted marketing
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Temporal Factors Card */}
              <div className="space-y-4 p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
                <h4 className="text-base font-semibold flex items-center gap-2 text-blue-900">
                  <CalendarClock className="h-5 w-5 text-blue-600" />
                  Temporal Factors
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dayOfWeek" className="text-sm font-medium text-gray-700">Day of Week</Label>
                    <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                      <SelectTrigger className="bg-white h-11 text-base">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map(day => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="season" className="text-sm font-medium text-gray-700">Season</Label>
                    <Select value={seasonType} onValueChange={setSeasonType}>
                      <SelectTrigger className="bg-white h-11 text-base">
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        {seasons.map(season => (
                          <SelectItem key={season} value={season}>
                            {season.charAt(0).toUpperCase() + season.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeOfDay" className="text-sm font-medium text-gray-700">Time of Day</Label>
                    <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                      <SelectTrigger className="bg-white h-11 text-base">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timesOfDay.map(time => (
                          <SelectItem key={time} value={time}>
                            {time.charAt(0).toUpperCase() + time.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic bg-blue-100/50 p-3 rounded-lg">💡 Weekday mornings/evenings favor business travelers</p>
              </div>

              {/* Booking Behavior Card */}
              <div className="space-y-4 p-5 bg-purple-50 rounded-xl border border-purple-200 shadow-sm">
                <h4 className="text-base font-semibold flex items-center gap-2 text-purple-900">
                  <Ticket className="h-5 w-5 text-purple-600" />
                  Booking Behavior
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="bookingType" className="text-sm font-medium text-gray-700">Booking Window</Label>
                  <Select value={bookingType} onValueChange={setBookingType}>
                    <SelectTrigger className="bg-white h-11 text-base">
                      <SelectValue placeholder="Select booking type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookingTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type === 'early' ? 'Early (>30 days)' :
                           type === 'regular' ? 'Regular (7-30 days)' :
                           'Last Minute (<7 days)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                  <h5 className="text-sm font-semibold mb-2.5 text-purple-900">📊 Booking Pattern Indicators</h5>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span><strong className="text-purple-800">Early ({'>'}30 days):</strong> Leisure travelers, price-sensitive</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span><strong className="text-purple-800">Regular (7-30 days):</strong> Mixed business and leisure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span><strong className="text-purple-800">Last Minute ({'<'}7 days):</strong> Business or urgent travel</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Route Characteristics Card */}
              <div className="space-y-4 p-5 bg-green-50 rounded-xl border border-green-200 shadow-sm">
                <h4 className="text-base font-semibold flex items-center gap-2 text-green-900">
                  <Globe className="h-5 w-5 text-green-600" />
                  Route Characteristics
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="routeType" className="text-sm font-medium text-gray-700">Route Type</Label>
                    <Select value={routeType} onValueChange={setRouteType}>
                      <SelectTrigger className="bg-white h-11 text-base">
                        <SelectValue placeholder="Select route type" />
                      </SelectTrigger>
                      <SelectContent>
                        {routeTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type === 'business' ? '💼 Business Hub' :
                             type === 'leisure' ? '🏖️ Leisure/Tourist' :
                             '🔄 Mixed Traffic'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priceSensitivity" className="text-sm font-medium text-gray-700">Price Sensitivity</Label>
                    <Select value={priceSensitivity} onValueChange={setPriceSensitivity}>
                      <SelectTrigger className="bg-white h-11 text-base">
                        <SelectValue placeholder="Select sensitivity" />
                      </SelectTrigger>
                      <SelectContent>
                        {priceSensitivityLevels.map(level => (
                          <SelectItem key={level} value={level}>
                            {level === 'low' ? '💎 Low (Premium)' :
                             level === 'medium' ? '⚖️ Medium (Balanced)' :
                             '💰 High (Budget)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                  <h5 className="text-sm font-semibold mb-2.5 text-green-900">🎯 Route Type Impact</h5>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span><strong className="text-green-800">Business:</strong> Corporate hubs, high fares, weekday demand</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span><strong className="text-green-800">Leisure:</strong> Tourist destinations, seasonal peaks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span><strong className="text-green-800">Mixed:</strong> Balanced traffic, steady demand</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Passenger Type Summary */}
            <div className="mt-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 shadow-md">
              <h4 className="text-lg font-bold flex items-center gap-2 text-indigo-900 mb-4">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
                Predicted Passenger Profile
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                  <div className="text-sm font-medium text-gray-600 mb-1">Primary Type</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {(dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') && seasonType === 'summer' ? '🏖️ Leisure' :
                     (dayOfWeek !== 'Saturday' && dayOfWeek !== 'Sunday') && timeOfDay === 'morning' ? '💼 Business' :
                     '🔄 Mixed'}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                  <div className="text-sm font-medium text-gray-600 mb-1">Booking Pattern</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {bookingType === 'early' ? '📅 Planned' :
                     bookingType === 'regular' ? '📆 Standard' :
                     '⚡ Urgent'}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                  <div className="text-sm font-medium text-gray-600 mb-1">Route Character</div>
                  <div className="text-2xl font-bold text-green-600">
                    {routeType === 'business' ? '💼 Corporate' :
                     routeType === 'leisure' ? '🏖️ Vacation' :
                     '🌍 Diverse'}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200">
                <p className="text-sm text-gray-700">
                  <strong>CRM Strategy Insight:</strong> Based on your selections, target marketing should focus on{' '}
                  <span className="font-bold text-indigo-600">
                    {priceSensitivity === 'low' ? 'premium travelers with exclusive benefits and personalized service' :
                     priceSensitivity === 'medium' ? 'balanced market segments with value-added services' :
                     'cost-conscious passengers with competitive pricing and promotions'}
                  </span>
                  {' '}with {bookingType === 'last_minute' ? 'flexible pricing strategies and last-minute deals' : 'advance purchase incentives and loyalty rewards'}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Journey Section */}
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-6 w-6 text-blue-600" />
              Customer Journey in CRM System
            </CardTitle>
            <p className="text-gray-600 mt-2">Interactive journey map from awareness to post-flight engagement</p>
          </CardHeader>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="awareness">
                <AccordionTrigger className="text-lg font-semibold">
                  1. Awareness & Search
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Customer starts their journey through:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Direct channels (airline website, mobile app, call center)</li>
                    <li>Indirect channels (OTAs, GDS platforms, corporate travel)</li>
                    <li>Anonymous browsing data collection for retargeting</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="booking">
                <AccordionTrigger className="text-lg font-semibold">
                  2. Booking & Data Collection
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Data capture varies by booking channel:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Direct booking → Full customer profile</li>
                    <li>Indirect booking → Limited customer details</li>
                    <li>CRM enrichment with loyalty program data</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="preflight">
                <AccordionTrigger className="text-lg font-semibold">
                  3. Pre-Flight Experience
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Automated notifications and updates</li>
                    <li>Personalized upsell opportunities</li>
                    <li>Loyalty program benefits activation</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="flight">
                <AccordionTrigger className="text-lg font-semibold">
                  4. Flight Experience
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Personalized in-flight services</li>
                    <li>Crew CRM integration</li>
                    <li>Premium services for high-value passengers</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="postflight">
                <AccordionTrigger className="text-lg font-semibold">
                  5. Post-Flight Engagement
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Customer satisfaction surveys</li>
                    <li>Targeted promotions based on travel history</li>
                    <li>AI-powered churn prediction</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Direct vs Indirect Customers */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserCheck className="h-6 w-6 text-green-600" />
              Direct vs Indirect Customers
            </CardTitle>
            <p className="text-gray-600 mt-2">Understanding customer acquisition channels and their strategic value</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border-2 border-green-300 shadow-md">
                <h3 className="font-bold text-xl mb-4 text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  Direct Customers
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Full customer data ownership
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Higher personalization potential
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Stronger loyalty opportunities
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-lg border-2 border-red-300 shadow-md">
                <h3 className="font-bold text-xl mb-4 text-red-700 flex items-center gap-2">
                  <XCircle className="h-6 w-6" />
                  Indirect Customers
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Limited customer data access
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Harder to personalize
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    High-value corporate travelers
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Conversion Strategies */}
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-purple-600" />
              Customer Conversion Strategies
            </CardTitle>
            <p className="text-gray-600 mt-2">Proven tactics to convert indirect customers and maximize direct bookings</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-4 text-blue-700 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Incentivizing Direct Bookings
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Exclusive direct booking discounts</li>
                  <li>• Bonus loyalty miles & points</li>
                  <li>• Special ancillary benefits</li>
                  <li>• Fare transparency & price matching</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border-2 border-green-200 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-4 text-green-700 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Enhanced Direct Experience
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Personalized offers & recommendations</li>
                  <li>• User-friendly booking experience</li>
                  <li>• Better refund & flexibility policies</li>
                  <li>• Instant booking confirmation</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-4 text-purple-700 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Retargeting Strategies
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Post-booking email campaigns</li>
                  <li>• Win-back offers for churned customers</li>
                  <li>• Loyalty program enrollment targeting</li>
                  <li>• Personalized retention incentives</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key CRM Metrics Section */}
        <Card className="border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calculator className="h-6 w-6 text-indigo-600" />
              Key CRM Metrics
            </CardTitle>
            <p className="text-gray-600 mt-2">Essential metrics for measuring CRM performance and customer value</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Customer Acquisition
                </h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium">CAC (Customer Acquisition Cost)</p>
                    <div className="bg-gray-50 p-2 rounded mt-1">
                      <p className="text-sm font-mono">Marketing Costs ÷ New Customers</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">CRC (Customer Retention Cost)</p>
                    <div className="bg-gray-50 p-2 rounded mt-1">
                      <p className="text-sm font-mono">Loyalty Program Costs ÷ Existing Customers</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border-2 border-green-200 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Churn & Loyalty
                </h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium">Churn Rate (24-month basis)</p>
                    <div className="bg-white p-2 rounded mt-1 border border-green-200">
                      <p className="text-sm font-mono">Lost Customers ÷ Total Customers</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Customer Lifetime Value (CLV)</p>
                    <div className="bg-white p-2 rounded mt-1 border border-green-200">
                      <p className="text-sm font-mono">Avg Revenue × Years × Retention Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Satisfaction Metrics
                </h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium">NPS (Net Promoter Score)</p>
                    <div className="bg-gray-50 p-2 rounded mt-1">
                      <p className="text-sm font-mono">% Promoters - % Detractors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Segmentation Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Customer Segmentation (24-Month Model)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-gray-600">
                Based on IATA standards and airline loyalty program benchmarks, customers are segmented using a 24-month activity window:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="font-semibold text-lg mb-4">Active Segments</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold">New Customers</h4>
                      <p className="text-sm text-gray-600 mt-1">First-time flyers who recently booked</p>
                      <p className="text-sm text-green-600 mt-1">Strategy: Welcome offers and onboarding</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Retained Customers</h4>
                      <p className="text-sm text-gray-600 mt-1">Multiple bookings within 24 months</p>
                      <p className="text-sm text-blue-600 mt-1">Strategy: Loyalty rewards and upgrades</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="font-semibold text-lg mb-4">At-Risk & Churned</h3>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Churn Risk</h4>
                      <p className="text-sm text-gray-600 mt-1">Declining booking frequency</p>
                      <p className="text-sm text-yellow-600 mt-1">Strategy: Early intervention and special offers</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Churned Customers</h4>
                      <p className="text-sm text-gray-600 mt-1">No bookings for over 24 months</p>
                      <p className="text-sm text-red-600 mt-1">Strategy: Reactivation campaigns</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-6">
                <h3 className="font-semibold text-lg mb-4">Why 24 Months?</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold">Industry Standards</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li>• IATA recommended timeframe for customer activity tracking</li>
                      <li>• Matches most frequent flyer program expiry policies</li>
                      <li>• Captures both frequent and seasonal travelers</li>
                      <li>• Allows for business travel patterns</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Advantages</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li>• Balances short and long-term travel patterns</li>
                      <li>• Aligns with industry loyalty programs</li>
                      <li>• Optimal for retention strategies</li>
                      <li>• Supports effective reactivation campaigns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Calculator Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-500" />
              Interactive CRM Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Calculate key CRM metrics and analyze customer data with this interactive calculator.
              Input your airline's data to get instant insights and analytics.
            </p>
            <CRMCalculator />
          </CardContent>
        </Card>

        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-6">
          <p>Based on IATA and ICAO standards</p>
          <p className="mt-2">© Aviation Performance Analytics</p>
        </footer>
      </div>
    </div>
  );
}