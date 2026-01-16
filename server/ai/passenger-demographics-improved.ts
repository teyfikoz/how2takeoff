// Improved Passenger Demographics Calculation
// More sophisticated analysis with additional factors

interface DemographicsResult {
  businessPercentage: number;
  leisurePercentage: number;
  mixedPercentage: number;
  dominantType: 'Business' | 'Leisure' | 'Mixed';
  confidence: number; // 0-100
  insights: string[];
}

function predictPassengerDemographics(
  dayOfWeek: string,
  season: string,
  timeOfDay: string,
  bookingType: string,
  routeType: string,
  priceSensitivity: string,
  distance: number
): DemographicsResult {

  let businessScore = 0;
  let leisureScore = 0;
  const insights: string[] = [];

  // 1. Day of Week Analysis (Weight: 25%)
  const businessDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const weekendDays = ['Friday', 'Saturday', 'Sunday'];

  if (businessDays.includes(dayOfWeek)) {
    businessScore += 25;
    insights.push(`${dayOfWeek} is a typical business travel day`);
  } else if (dayOfWeek === 'Friday') {
    businessScore += 15;
    leisureScore += 10;
    insights.push('Friday sees mixed business and weekend leisure traffic');
  } else {
    leisureScore += 25;
    insights.push(`${dayOfWeek} is primarily leisure travel`);
  }

  // 2. Time of Day Analysis (Weight: 20%)
  if (timeOfDay === 'morning' || timeOfDay === 'evening') {
    businessScore += 20;
    insights.push('Morning/evening flights favor business travelers');
  } else if (timeOfDay === 'afternoon') {
    businessScore += 10;
    leisureScore += 10;
    insights.push('Afternoon flights see balanced traffic');
  } else { // night
    leisureScore += 15;
    businessScore += 5;
    insights.push('Night flights often budget-conscious leisure');
  }

  // 3. Season Analysis (Weight: 15%)
  const businessSeasons = ['spring', 'fall'];
  const leisureSeasons = ['summer', 'holiday'];

  if (businessSeasons.includes(season)) {
    businessScore += 15;
    insights.push(`${season} is peak business conference season`);
  } else if (leisureSeasons.includes(season)) {
    leisureScore += 15;
    if (season === 'holiday') {
      leisureScore += 5; // Extra boost for holidays
    }
    insights.push(`${season} is peak vacation season`);
  } else { // winter (non-holiday)
    businessScore += 10;
    leisureScore += 5;
  }

  // 4. Booking Type Analysis (Weight: 20%)
  if (bookingType === 'last_minute') {
    businessScore += 20;
    insights.push('Last-minute bookings indicate urgent business travel');
  } else if (bookingType === 'early') {
    leisureScore += 20;
    insights.push('Early bookings suggest planned vacations');
  } else { // regular
    businessScore += 10;
    leisureScore += 10;
    insights.push('Regular booking window shows mixed demand');
  }

  // 5. Route Type (Weight: 10%)
  if (routeType === 'business') {
    businessScore += 10;
    insights.push('Route designated as business-oriented');
  } else if (routeType === 'leisure') {
    leisureScore += 10;
    insights.push('Route designated as leisure-oriented');
  } else {
    businessScore += 5;
    leisureScore += 5;
  }

  // 6. Price Sensitivity (Weight: 10%)
  if (priceSensitivity === 'low') {
    businessScore += 10;
    insights.push('Low price sensitivity indicates business travelers');
  } else if (priceSensitivity === 'high') {
    leisureScore += 10;
    insights.push('High price sensitivity common in leisure travel');
  } else {
    businessScore += 5;
    leisureScore += 5;
  }

  // 7. Distance Factor (Bonus: 0-10%)
  if (distance > 5000) {
    // Long-haul routes
    businessScore += 5;
    leisureScore += 5;
    insights.push('Long-haul route attracts both segments');
  } else if (distance < 1000) {
    // Short-haul routes
    businessScore += 5;
    insights.push('Short-haul favors business commuters');
  } else {
    // Medium-haul
    leisureScore += 5;
  }

  // Calculate final percentages (total possible score: 100 + bonuses)
  const totalScore = businessScore + leisureScore;
  const businessPct = Math.round((businessScore / totalScore) * 100);
  const leisurePct = Math.round((leisureScore / totalScore) * 100);

  // Calculate mixed percentage (overlap zone)
  const mixedPct = 100 - businessPct - leisurePct;

  // Determine dominant type
  let dominantType: 'Business' | 'Leisure' | 'Mixed';
  if (Math.abs(businessPct - leisurePct) < 15) {
    dominantType = 'Mixed';
  } else if (businessPct > leisurePct) {
    dominantType = 'Business';
  } else {
    dominantType = 'Leisure';
  }

  // Calculate confidence (based on score separation)
  const scoreDiff = Math.abs(businessScore - leisureScore);
  const confidence = Math.min(95, Math.round((scoreDiff / totalScore) * 200));

  return {
    businessPercentage: businessPct,
    leisurePercentage: leisurePct,
    mixedPercentage: mixedPct > 0 ? mixedPct : 0,
    dominantType,
    confidence,
    insights: insights.slice(0, 4) // Top 4 insights
  };
}

export { predictPassengerDemographics, type DemographicsResult };
