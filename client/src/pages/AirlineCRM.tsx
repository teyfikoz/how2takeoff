import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiAirchina } from "react-icons/si";
import { Users, TrendingUp, Calculator, Target, UserCheck, DollarSign, Brain, Sparkles, History,
         Plane, CheckCircle, XCircle, CalendarClock, Ticket, Globe, AlertTriangle, Loader2,
         ArrowRight, Shield, UserX, RefreshCw, Gift, Ban, Percent, Award, Package, Zap,
         ThumbsUp, ThumbsDown, Info } from "lucide-react";
import CRMCalculator from "@/components/CRMCalculator";
import { useSEO } from '@/hooks/useSEO';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useChurnPrediction } from "@/services/churn-prediction.service";
import { useOfferRecommendation } from "@/services/offer-recommendation.service";
import {
  type LoyaltyTier,
  type ChurnPredictionRequest,
  LOYALTY_TIER_LABELS,
  LOYALTY_TIER_COLORS,
  RISK_LEVEL_LABELS,
  CUSTOMER_VALUE_LABELS,
  SAMPLE_CUSTOMERS,
  formatChurnProbability,
  getRiskLevelStyle,
  formatCurrency,
  getPriorityLabel,
} from "@/domain/churn-prediction";
import {
  type TravelPurpose,
  type OfferRecommendationRequest,
  OFFER_TYPE_LABELS,
  OFFER_INTENSITY_LABELS,
  TRAVEL_PURPOSE_LABELS,
  PRICE_SENSITIVITY_LABELS,
  getOfferTypeStyle,
  formatRetentionLift,
  getCostEfficiencyLabel,
  formatConfidence,
} from "@/domain/offer-recommendation";

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

  // State for churn prediction
  const [churnInput, setChurnInput] = useState<ChurnPredictionRequest>({
    daysSinceLastBooking: 90,
    daysSinceLastFlight: 75,
    bookingsLast12Months: 3,
    bookingsLast24Months: 8,
    flightsLast12Months: 5,
    totalSpendLast12Months: 2500,
    averageTicketPrice: 450,
    loyaltyTier: "silver",
    loyaltyPointsBalance: 15000,
    preferredBookingChannel: "direct",
    farePreference: "economy",
    emailOpenRate: 20,
    appUsageLast30Days: 3,
    complaintsLast12Months: 0,
    topRouteFrequency: 3,
    uniqueDestinations: 2,
  });
  const { loading: churnLoading, result: churnResult, predict: predictChurn, reset: resetChurn } = useChurnPrediction();

  // State for offer recommendation context
  const [offerContext, setOfferContext] = useState<{
    travelPurposeMix: TravelPurpose;
    priceSensitivity: "low" | "medium" | "high";
    lastOfferDate?: string;
    lastOfferAccepted?: boolean;
  }>({
    travelPurposeMix: "mixed",
    priceSensitivity: "medium",
  });
  const { loading: offerLoading, result: offerResult, recommend: recommendOffer, reset: resetOffer } = useOfferRecommendation();

  // Build offer request from churn result and context
  const buildOfferRequest = (): OfferRecommendationRequest | null => {
    if (!churnResult?.success || !churnResult.data) return null;
    return {
      churnRiskScore: churnResult.data.churnProbability,
      riskLevel: churnResult.data.riskLevel,
      customerValue: churnResult.data.customerValue,
      loyaltyTier: churnInput.loyaltyTier || "none",
      travelPurposeMix: offerContext.travelPurposeMix,
      priceSensitivity: offerContext.priceSensitivity,
      lastOfferDate: offerContext.lastOfferDate,
      lastOfferAccepted: offerContext.lastOfferAccepted,
    };
  };

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

        {/* AI Churn Prediction Section */}
        <Card className="border-2 border-orange-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Brain className="h-6 w-6 text-orange-600" />
              AI Churn Prediction
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Predict customer churn risk using AI-powered analysis of booking patterns, engagement, and loyalty data
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                {/* Quick Load Sample Customers */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    Quick Load Sample Customer
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {SAMPLE_CUSTOMERS.map((sample, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs h-auto py-2 px-3"
                        onClick={() => {
                          setChurnInput(sample.data);
                          resetChurn();
                        }}
                      >
                        <div className="text-left">
                          <div className="font-medium">{sample.name}</div>
                          <div className="text-gray-500 text-[10px]">{sample.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Recency & Frequency */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-blue-900">
                    <CalendarClock className="h-4 w-4" />
                    Recency & Frequency (RFM)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Days Since Last Booking</Label>
                      <Input
                        type="number"
                        value={churnInput.daysSinceLastBooking}
                        onChange={(e) => setChurnInput({...churnInput, daysSinceLastBooking: Number(e.target.value)})}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Days Since Last Flight</Label>
                      <Input
                        type="number"
                        value={churnInput.daysSinceLastFlight}
                        onChange={(e) => setChurnInput({...churnInput, daysSinceLastFlight: Number(e.target.value)})}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Bookings (12 months)</Label>
                      <Input
                        type="number"
                        value={churnInput.bookingsLast12Months}
                        onChange={(e) => setChurnInput({...churnInput, bookingsLast12Months: Number(e.target.value)})}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Bookings (24 months)</Label>
                      <Input
                        type="number"
                        value={churnInput.bookingsLast24Months}
                        onChange={(e) => setChurnInput({...churnInput, bookingsLast24Months: Number(e.target.value)})}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Monetary Value */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-green-900">
                    <DollarSign className="h-4 w-4" />
                    Monetary Value
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Total Spend (12 mo) $</Label>
                      <Input
                        type="number"
                        value={churnInput.totalSpendLast12Months}
                        onChange={(e) => setChurnInput({...churnInput, totalSpendLast12Months: Number(e.target.value)})}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Avg Ticket Price $</Label>
                      <Input
                        type="number"
                        value={churnInput.averageTicketPrice}
                        onChange={(e) => setChurnInput({...churnInput, averageTicketPrice: Number(e.target.value)})}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Loyalty & Engagement */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-purple-900">
                    <Sparkles className="h-4 w-4" />
                    Loyalty & Engagement
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Loyalty Tier</Label>
                      <Select
                        value={churnInput.loyaltyTier}
                        onValueChange={(v) => setChurnInput({...churnInput, loyaltyTier: v as LoyaltyTier})}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(LOYALTY_TIER_LABELS) as LoyaltyTier[]).map(tier => (
                            <SelectItem key={tier} value={tier}>
                              {LOYALTY_TIER_LABELS[tier]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Points Balance</Label>
                        <Input
                          type="number"
                          value={churnInput.loyaltyPointsBalance}
                          onChange={(e) => setChurnInput({...churnInput, loyaltyPointsBalance: Number(e.target.value)})}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Email Open Rate %</Label>
                        <Input
                          type="number"
                          value={churnInput.emailOpenRate}
                          onChange={(e) => setChurnInput({...churnInput, emailOpenRate: Number(e.target.value)})}
                          className="h-9"
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">App Sessions (30 days)</Label>
                        <Input
                          type="number"
                          value={churnInput.appUsageLast30Days}
                          onChange={(e) => setChurnInput({...churnInput, appUsageLast30Days: Number(e.target.value)})}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Complaints (12 mo)</Label>
                        <Input
                          type="number"
                          value={churnInput.complaintsLast12Months}
                          onChange={(e) => setChurnInput({...churnInput, complaintsLast12Months: Number(e.target.value)})}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Predict Button */}
                <Button
                  onClick={() => predictChurn(churnInput)}
                  disabled={churnLoading}
                  className="w-full h-12 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  {churnLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Predict Churn Risk
                    </>
                  )}
                </Button>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {churnResult?.success && churnResult.data && (
                  <>
                    {/* Risk Score Card */}
                    <div className={`p-6 rounded-xl border-2 ${getRiskLevelStyle(churnResult.data.riskLevel).border} ${getRiskLevelStyle(churnResult.data.riskLevel).bg}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <UserX className="h-5 w-5" />
                          Churn Risk Assessment
                        </h3>
                        <span className={`px-3 py-1 rounded-full font-semibold ${RISK_LEVEL_LABELS[churnResult.data.riskLevel].bgColor} ${RISK_LEVEL_LABELS[churnResult.data.riskLevel].color}`}>
                          {RISK_LEVEL_LABELS[churnResult.data.riskLevel].label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-xs text-gray-500 mb-1">Churn Probability</div>
                          <div className={`text-3xl font-bold ${
                            churnResult.data.churnProbability >= 0.5 ? 'text-red-600' :
                            churnResult.data.churnProbability >= 0.25 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {formatChurnProbability(churnResult.data.churnProbability)}
                          </div>
                          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                churnResult.data.churnProbability >= 0.5 ? 'bg-red-500' :
                                churnResult.data.churnProbability >= 0.25 ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${churnResult.data.churnProbability * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-xs text-gray-500 mb-1">Likely Churn Window</div>
                          <div className="text-2xl font-bold text-gray-800">
                            {churnResult.data.predictedChurnWindow}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Confidence: {Math.round(churnResult.data.confidence * 100)}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 mb-1">Customer Value</div>
                          <div className={`text-lg font-bold ${CUSTOMER_VALUE_LABELS[churnResult.data.customerValue].color}`}>
                            {CUSTOMER_VALUE_LABELS[churnResult.data.customerValue].label}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 mb-1">Retention Priority</div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-purple-600">{churnResult.data.retentionPriority}/10</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              churnResult.data.retentionPriority >= 8 ? 'bg-red-100 text-red-700' :
                              churnResult.data.retentionPriority >= 6 ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {getPriorityLabel(churnResult.data.retentionPriority)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        Key Risk Factors
                      </h4>
                      <div className="space-y-2">
                        {churnResult.data.factors.map((factor, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border ${
                              factor.direction === 'increases_risk' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{factor.factor}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                factor.impact === 'high' ? 'bg-red-200 text-red-800' :
                                factor.impact === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-gray-200 text-gray-700'
                              }`}>
                                {factor.impact.toUpperCase()} {factor.direction === 'increases_risk' ? `+${factor.score}` : factor.score}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{factor.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-900">
                        <CheckCircle className="h-4 w-4" />
                        Recommended Actions
                      </h4>
                      <div className="space-y-2">
                        {churnResult.data.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-blue-100">
                            <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {!churnResult && !churnLoading && (
                  <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 text-center h-full flex flex-col items-center justify-center">
                    <UserX className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready for Churn Analysis</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                      Enter customer data or select a sample customer profile to predict churn risk with AI-powered analysis.
                    </p>
                  </div>
                )}

                {churnResult?.error && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium">Error</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{churnResult.error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* How It Works */}
            <div className="mt-8 pt-6 border-t">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                How AI Churn Prediction Works
              </h4>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center bg-gray-50 p-6 rounded-lg">
                <div className="flex-1 p-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CalendarClock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h5 className="font-semibold text-sm">Recency</h5>
                  <p className="text-xs text-gray-600">Days since last activity</p>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 hidden md:block" />
                <div className="flex-1 p-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <RefreshCw className="h-6 w-6 text-green-600" />
                  </div>
                  <h5 className="font-semibold text-sm">Frequency</h5>
                  <p className="text-xs text-gray-600">Booking patterns & trends</p>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 hidden md:block" />
                <div className="flex-1 p-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <h5 className="font-semibold text-sm">Monetary</h5>
                  <p className="text-xs text-gray-600">Spend & value analysis</p>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 hidden md:block" />
                <div className="flex-1 p-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Brain className="h-6 w-6 text-orange-600" />
                  </div>
                  <h5 className="font-semibold text-sm">AI Analysis</h5>
                  <p className="text-xs text-gray-600">Risk score & recommendations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Offer Recommendation Section */}
        <Card className="border-2 border-indigo-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Gift className="h-6 w-6 text-indigo-600" />
              AI Offer Recommendation
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Get AI-powered, policy-driven offer recommendations based on churn analysis. Human-in-the-loop approach - produces strategy, not spam.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                {/* Prerequisites Check */}
                <div className={`p-4 rounded-lg border-2 ${churnResult?.success ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    {churnResult?.success ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-800">Churn Analysis Complete</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-800">Churn Analysis Required</span>
                      </>
                    )}
                  </h4>
                  {churnResult?.success && churnResult.data ? (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="bg-white p-2 rounded border">
                        <div className="text-xs text-gray-500">Churn Risk</div>
                        <div className={`font-bold ${RISK_LEVEL_LABELS[churnResult.data.riskLevel].color}`}>
                          {RISK_LEVEL_LABELS[churnResult.data.riskLevel].label}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <div className="text-xs text-gray-500">Customer Value</div>
                        <div className={`font-bold ${CUSTOMER_VALUE_LABELS[churnResult.data.customerValue].color}`}>
                          {CUSTOMER_VALUE_LABELS[churnResult.data.customerValue].label}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <div className="text-xs text-gray-500">Loyalty Tier</div>
                        <div className="font-bold">{LOYALTY_TIER_LABELS[churnInput.loyaltyTier || "none"]}</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-yellow-700">
                      Run churn prediction above first to enable AI offer recommendations.
                    </p>
                  )}
                </div>

                {/* Customer Context */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-indigo-900">
                    <Users className="h-4 w-4" />
                    Customer Context
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Travel Purpose Mix</Label>
                      <Select
                        value={offerContext.travelPurposeMix}
                        onValueChange={(v) => setOfferContext({...offerContext, travelPurposeMix: v as TravelPurpose})}
                      >
                        <SelectTrigger className="h-9 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(TRAVEL_PURPOSE_LABELS) as TravelPurpose[]).map(purpose => (
                            <SelectItem key={purpose} value={purpose}>
                              {TRAVEL_PURPOSE_LABELS[purpose]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Price Sensitivity</Label>
                      <Select
                        value={offerContext.priceSensitivity}
                        onValueChange={(v) => setOfferContext({...offerContext, priceSensitivity: v as "low" | "medium" | "high"})}
                      >
                        <SelectTrigger className="h-9 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(["low", "medium", "high"] as const).map(level => (
                            <SelectItem key={level} value={level}>
                              {PRICE_SENSITIVITY_LABELS[level]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Offer History (Optional) */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-gray-700">
                    <History className="h-4 w-4" />
                    Recent Offer History (Optional)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Last Offer Date</Label>
                      <Input
                        type="date"
                        value={offerContext.lastOfferDate || ""}
                        onChange={(e) => setOfferContext({...offerContext, lastOfferDate: e.target.value || undefined})}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Was Accepted?</Label>
                      <Select
                        value={offerContext.lastOfferAccepted === undefined ? "unknown" : offerContext.lastOfferAccepted ? "yes" : "no"}
                        onValueChange={(v) => setOfferContext({
                          ...offerContext,
                          lastOfferAccepted: v === "unknown" ? undefined : v === "yes"
                        })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unknown">Unknown</SelectItem>
                          <SelectItem value="yes">Yes - Accepted</SelectItem>
                          <SelectItem value="no">No - Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Get Recommendation Button */}
                <Button
                  onClick={() => {
                    const request = buildOfferRequest();
                    if (request) recommendOffer(request);
                  }}
                  disabled={offerLoading || !churnResult?.success}
                  className="w-full h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {offerLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating Recommendation...
                    </>
                  ) : (
                    <>
                      <Gift className="h-5 w-5 mr-2" />
                      Get AI Offer Recommendation
                    </>
                  )}
                </Button>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {offerResult?.success && offerResult.data && (
                  <>
                    {/* Primary Recommendation */}
                    <div className={`p-6 rounded-xl border-2 ${getOfferTypeStyle(offerResult.data.recommendedOfferType).border} ${getOfferTypeStyle(offerResult.data.recommendedOfferType).bg}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          {offerResult.data.recommendedOfferType === "no_offer" ? (
                            <Ban className="h-5 w-5" />
                          ) : (
                            <Gift className="h-5 w-5" />
                          )}
                          AI Recommendation
                        </h3>
                        <span className={`px-3 py-1 rounded-full font-semibold ${OFFER_INTENSITY_LABELS[offerResult.data.offerIntensity].bgColor} ${OFFER_INTENSITY_LABELS[offerResult.data.offerIntensity].color}`}>
                          {OFFER_INTENSITY_LABELS[offerResult.data.offerIntensity].label}
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-lg border mb-4">
                        <div className="flex items-center gap-3 mb-2">
                          {offerResult.data.recommendedOfferType === "discount_light" && <Percent className="h-8 w-8 text-blue-600" />}
                          {offerResult.data.recommendedOfferType === "flexibility_upgrade" && <RefreshCw className="h-8 w-8 text-purple-600" />}
                          {offerResult.data.recommendedOfferType === "loyalty_bonus" && <Award className="h-8 w-8 text-amber-600" />}
                          {offerResult.data.recommendedOfferType === "ancillary_bundle" && <Package className="h-8 w-8 text-indigo-600" />}
                          {offerResult.data.recommendedOfferType === "priority_service" && <Zap className="h-8 w-8 text-pink-600" />}
                          {offerResult.data.recommendedOfferType === "no_offer" && <CheckCircle className="h-8 w-8 text-green-600" />}
                          <div>
                            <div className="text-xl font-bold">
                              {OFFER_TYPE_LABELS[offerResult.data.recommendedOfferType].label}
                            </div>
                            <div className="text-sm text-gray-600">
                              {OFFER_TYPE_LABELS[offerResult.data.recommendedOfferType].description}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Confidence: {formatConfidence(offerResult.data.confidence)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 mb-1">Expected Retention Lift</div>
                          <div className={`text-lg font-bold ${offerResult.data.expectedRetentionLift > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                            {formatRetentionLift(offerResult.data.expectedRetentionLift)}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 mb-1">Cost Efficiency</div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{offerResult.data.costEfficiencyScore}/10</span>
                            <span className={`text-xs ${getCostEfficiencyLabel(offerResult.data.costEfficiencyScore).color}`}>
                              {getCostEfficiencyLabel(offerResult.data.costEfficiencyScore).label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        AI Reasoning
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <div className="text-xs text-blue-700 font-medium mb-1">Primary Driver</div>
                          <p className="text-sm text-gray-700">{offerResult.data.reasoning.primaryDriver}</p>
                        </div>
                        {offerResult.data.reasoning.secondaryFactors.length > 0 && (
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <div className="text-xs text-gray-500 font-medium mb-2">Secondary Factors</div>
                            <ul className="space-y-1">
                              {offerResult.data.reasoning.secondaryFactors.map((factor, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-gray-400">•</span>
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {offerResult.data.reasoning.guardrailsApplied.length > 0 && (
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <div className="text-xs text-yellow-700 font-medium mb-2 flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Guardrails Applied
                            </div>
                            <ul className="space-y-1">
                              {offerResult.data.reasoning.guardrailsApplied.map((guardrail, idx) => (
                                <li key={idx} className="text-sm text-yellow-800 flex items-start gap-2">
                                  <span className="text-yellow-500">!</span>
                                  {guardrail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Do Not Recommend */}
                    {offerResult.data.doNotRecommend.length > 0 && (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-800">
                          <Ban className="h-4 w-4" />
                          Do NOT Recommend These Offers
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {offerResult.data.doNotRecommend.map((offer, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              {OFFER_TYPE_LABELS[offer].label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Offer Fatigue Warning */}
                    {offerResult.data.offerFatigueWarning && (
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="flex items-start gap-2 text-orange-800">
                          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">Offer Fatigue Warning</span>
                            <p className="text-sm mt-1">{offerResult.data.offerFatigueWarning}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!offerResult && !offerLoading && (
                  <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 text-center h-full flex flex-col items-center justify-center">
                    <Gift className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready for Offer Recommendation</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                      {churnResult?.success
                        ? "Set customer context and click the button to get AI-powered offer recommendation."
                        : "First run churn prediction above, then get personalized offer recommendations based on the analysis."}
                    </p>
                  </div>
                )}

                {offerResult?.error && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium">Error</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{offerResult.error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* How It Works */}
            <div className="mt-8 pt-6 border-t">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                Policy-Driven Offer Strategy
              </h4>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Brain className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h5 className="font-semibold text-sm">Decision Matrix</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      Churn Risk x Customer Value x Travel Purpose
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <h5 className="font-semibold text-sm">Guardrails</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      VIP + Low Churn = No Offer. Prevents over-promotion.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <h5 className="font-semibold text-sm">Explainable</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      Every recommendation comes with reasoning and confidence.
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg border text-center">
                  <p className="text-sm text-gray-600">
                    <strong>6 Controlled Offer Types:</strong> Light Discount, Flexibility Upgrade, Loyalty Bonus, Ancillary Bundle, Priority Service, and <span className="text-green-600 font-semibold">No Offer</span> (AI maturity indicator).
                  </p>
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