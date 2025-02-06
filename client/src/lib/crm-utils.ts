// CRM calculation utilities

export interface CustomerSegmentConfig {
  newCustomerPeriod: number; // in months
  churnThreshold: number; // in months
  atRiskFlightReduction: number; // percentage reduction in frequency
  loyalMinFlights: number; // minimum flights per year
}

export interface CLVConfig {
  averageTicketPrice: number;
  flightsPerYear: number;
  projectionYears: number;
  annualGrowthRate: number; // percentage
  discountRate: number; // percentage
}

export const calculateCLV = (config: CLVConfig): number => {
  let totalValue = 0;
  const yearlyRevenue = config.averageTicketPrice * config.flightsPerYear;

  for (let year = 1; year <= config.projectionYears; year++) {
    // Apply growth rate
    const growthMultiplier = Math.pow(1 + config.annualGrowthRate / 100, year - 1);
    // Apply discount rate
    const discountMultiplier = Math.pow(1 + config.discountRate / 100, -year);
    
    totalValue += yearlyRevenue * growthMultiplier * discountMultiplier;
  }

  return Math.round(totalValue);
};

export const calculateChurnProbability = (
  lastFlightMonths: number,
  averageFrequency: number,
  config: CustomerSegmentConfig
): number => {
  // Simple probability calculation based on time since last flight
  const normalizedTime = lastFlightMonths / config.churnThreshold;
  const frequencyFactor = averageFrequency / config.loyalMinFlights;
  
  // Calculate probability (0-1)
  let probability = normalizedTime * (1 - frequencyFactor);
  
  // Ensure probability is between 0 and 1
  return Math.max(0, Math.min(1, probability));
};

export const categorizeCustomer = (
  lastFlightMonths: number,
  flightsLastYear: number,
  previousYearFlights: number,
  config: CustomerSegmentConfig
): {
  category: 'new' | 'loyal' | 'at-risk' | 'churned';
  details: string;
} => {
  // New customer
  if (lastFlightMonths <= config.newCustomerPeriod) {
    return {
      category: 'new',
      details: 'First-time or recent customer'
    };
  }

  // Churned customer
  if (lastFlightMonths >= config.churnThreshold) {
    return {
      category: 'churned',
      details: `No flights in ${config.churnThreshold}+ months`
    };
  }

  // Calculate flight frequency change
  const frequencyChange = ((flightsLastYear - previousYearFlights) / previousYearFlights) * 100;

  // At-risk customer
  if (frequencyChange <= -config.atRiskFlightReduction) {
    return {
      category: 'at-risk',
      details: `${Math.abs(Math.round(frequencyChange))}% reduction in flight frequency`
    };
  }

  // Loyal customer
  if (flightsLastYear >= config.loyalMinFlights) {
    return {
      category: 'loyal',
      details: `${flightsLastYear} flights in the last year`
    };
  }

  // Default to at-risk if none of the above
  return {
    category: 'at-risk',
    details: 'Below loyalty threshold'
  };
};
