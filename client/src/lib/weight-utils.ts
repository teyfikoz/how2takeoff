// EASA Standard Weight calculations for aviation
// Based on EASA "Survey on standard weights of passengers and baggage" 

export interface EASAPassengerWeights {
  adult: {
    male: number;
    female: number;
    average: number;
  };
  child: number;
  infant: number;
}

export interface BaggageWeights {
  checkedBag: number;  // kg per checked bag
  cabinBag: number;    // kg per cabin bag
  personalItem: number; // kg per personal item
}

// EASA Standard Passenger Weights (2023 Survey)
export const EASA_PASSENGER_WEIGHTS: EASAPassengerWeights = {
  adult: {
    male: 88.6,      // kg - EASA average male
    female: 72.9,    // kg - EASA average female
    average: 80.0,   // kg - weighted average
  },
  child: 35.0,       // kg - ages 2-12
  infant: 10.0,      // kg - under 2
};

// EASA Standard Baggage Weights
export const EASA_BAGGAGE_WEIGHTS: BaggageWeights = {
  checkedBag: 15.0,   // kg - average checked bag
  cabinBag: 6.0,      // kg - cabin baggage
  personalItem: 2.0,  // kg - personal items (purse, laptop)
};

// Flight categories with different standard weights
export type FlightCategory = domestic | shortHaul | mediumHaul | longHaul | charter;

export const FLIGHT_CATEGORY_WEIGHTS: Record<FlightCategory, {
  passenger: number;
  totalBaggage: number;
}> = {
  domestic: {
    passenger: 84,    // Less baggage typically
    totalBaggage: 13, // Lower checked bag ratio
  },
  shortHaul: {
    passenger: 84,
    totalBaggage: 16,
  },
  mediumHaul: {
    passenger: 84,
    totalBaggage: 20,
  },
  longHaul: {
    passenger: 84,
    totalBaggage: 25, // More baggage on long flights
  },
  charter: {
    passenger: 76,    // Often leisure with more varied demographics
    totalBaggage: 20,
  },
};

// Service/Consumables load per passenger
export const SERVICE_LOAD_PER_PAX: Record<FlightCategory, number> = {
  domestic: 1.5,     // kg per passenger - minimal service
  shortHaul: 2.0,    // kg per passenger - basic catering
  mediumHaul: 4.0,   // kg per passenger - full meal service
  longHaul: 6.0,     // kg per passenger - multiple meals
  charter: 3.5,      // kg per passenger - varies
};

// Crew weight standards (including baggage)
export const CREW_WEIGHTS = {
  flightCrew: 85.0,        // kg per flight crew member
  cabinCrew: 75.0,         // kg per cabin crew member
  crewBaggage: 20.0,       // kg per crew member baggage
};

// ============ CALCULATION FUNCTIONS ============

export interface PassengerManifest {
  adultMale: number;
  adultFemale: number;
  children: number;
  infants: number;
}

export interface FlightWeightParams {
  passengers: PassengerManifest;
  flightCategory: FlightCategory;
  checkedBagsPerPax: number;
  cabinBagsPerPax: number;
  flightCrew: number;
  cabinCrew: number;
}

// Calculate total passenger weight
export function calculatePassengerWeight(manifest: PassengerManifest): {
  totalWeight: number;
  breakdown: {
    males: number;
    females: number;
    children: number;
    infants: number;
  };
} {
  const males = manifest.adultMale * EASA_PASSENGER_WEIGHTS.adult.male;
  const females = manifest.adultFemale * EASA_PASSENGER_WEIGHTS.adult.female;
  const children = manifest.children * EASA_PASSENGER_WEIGHTS.child;
  const infants = manifest.infants * EASA_PASSENGER_WEIGHTS.infant;

  return {
    totalWeight: males + females + children + infants,
    breakdown: { males, females, children, infants },
  };
}

// Calculate total baggage weight
export function calculateBaggageWeight(
  totalPassengers: number,
  checkedBagsPerPax: number,
  cabinBagsPerPax: number = 1
): {
  totalWeight: number;
  breakdown: {
    checkedBags: number;
    cabinBags: number;
    personalItems: number;
  };
} {
  const checkedBags = totalPassengers * checkedBagsPerPax * EASA_BAGGAGE_WEIGHTS.checkedBag;
  const cabinBags = totalPassengers * cabinBagsPerPax * EASA_BAGGAGE_WEIGHTS.cabinBag;
  const personalItems = totalPassengers * EASA_BAGGAGE_WEIGHTS.personalItem;

  return {
    totalWeight: checkedBags + cabinBags + personalItems,
    breakdown: { checkedBags, cabinBags, personalItems },
  };
}

// Calculate crew weight
export function calculateCrewWeight(flightCrew: number, cabinCrew: number): {
  totalWeight: number;
  breakdown: {
    flightCrew: number;
    cabinCrew: number;
    crewBaggage: number;
  };
} {
  const totalCrew = flightCrew + cabinCrew;
  const flightCrewWeight = flightCrew * CREW_WEIGHTS.flightCrew;
  const cabinCrewWeight = cabinCrew * CREW_WEIGHTS.cabinCrew;
  const crewBaggage = totalCrew * CREW_WEIGHTS.crewBaggage;

  return {
    totalWeight: flightCrewWeight + cabinCrewWeight + crewBaggage,
    breakdown: {
      flightCrew: flightCrewWeight,
      cabinCrew: cabinCrewWeight,
      crewBaggage,
    },
  };
}

// Calculate service/consumables load
export function calculateServiceLoad(
  totalPassengers: number,
  flightCategory: FlightCategory
): number {
  return totalPassengers * SERVICE_LOAD_PER_PAX[flightCategory];
}

// Complete payload calculation
export function calculateTotalPayload(params: FlightWeightParams): {
  totalPayload: number;
  breakdown: {
    passengers: number;
    baggage: number;
    crew: number;
    serviceLoad: number;
  };
  details: {
    passengerDetails: ReturnType<typeof calculatePassengerWeight>;
    baggageDetails: ReturnType<typeof calculateBaggageWeight>;
    crewDetails: ReturnType<typeof calculateCrewWeight>;
  };
} {
  const totalPax = 
    params.passengers.adultMale + 
    params.passengers.adultFemale + 
    params.passengers.children;
  
  const passengerDetails = calculatePassengerWeight(params.passengers);
  const baggageDetails = calculateBaggageWeight(
    totalPax,
    params.checkedBagsPerPax,
    params.cabinBagsPerPax
  );
  const crewDetails = calculateCrewWeight(params.flightCrew, params.cabinCrew);
  const serviceLoad = calculateServiceLoad(totalPax, params.flightCategory);

  return {
    totalPayload: 
      passengerDetails.totalWeight + 
      baggageDetails.totalWeight + 
      crewDetails.totalWeight + 
      serviceLoad,
    breakdown: {
      passengers: passengerDetails.totalWeight,
      baggage: baggageDetails.totalWeight,
      crew: crewDetails.totalWeight,
      serviceLoad,
    },
    details: {
      passengerDetails,
      baggageDetails,
      crewDetails,
    },
  };
}

// ============ TAKE-OFF WEIGHT CALCULATIONS ============

export interface TakeOffWeightParams {
  basicEmptyWeight: number;      // BEW - kg
  payload: number;               // Passenger + Baggage + Cargo
  fuelWeight: number;            // Block fuel - kg
  maxTakeOffWeight: number;      // MTOW - kg
  maxZeroFuelWeight: number;     // MZFW - kg
  maxLandingWeight: number;      // MLW - kg
}

export function calculateTakeOffWeight(params: TakeOffWeightParams): {
  takeOffWeight: number;
  zeroFuelWeight: number;
  withinLimits: {
    mtow: boolean;
    mzfw: boolean;
    mlw: boolean;
    overall: boolean;
  };
  margins: {
    mtowMargin: number;
    mzfwMargin: number;
    mlwMargin: number;
  };
} {
  const zeroFuelWeight = params.basicEmptyWeight + params.payload;
  const takeOffWeight = zeroFuelWeight + params.fuelWeight;
  
  // Assume trip fuel burn is ~30% for landing weight calculation
  const estimatedLandingWeight = takeOffWeight - (params.fuelWeight * 0.3);

  const withinMTOW = takeOffWeight <= params.maxTakeOffWeight;
  const withinMZFW = zeroFuelWeight <= params.maxZeroFuelWeight;
  const withinMLW = estimatedLandingWeight <= params.maxLandingWeight;

  return {
    takeOffWeight,
    zeroFuelWeight,
    withinLimits: {
      mtow: withinMTOW,
      mzfw: withinMZFW,
      mlw: withinMLW,
      overall: withinMTOW && withinMZFW && withinMLW,
    },
    margins: {
      mtowMargin: params.maxTakeOffWeight - takeOffWeight,
      mzfwMargin: params.maxZeroFuelWeight - zeroFuelWeight,
      mlwMargin: params.maxLandingWeight - estimatedLandingWeight,
    },
  };
}

// Simple weight estimation using standard values
export function estimateFlightWeight(
  passengerCount: number,
  flightCategory: FlightCategory,
  checkedBagRatio: number = 1.0,  // 0-2 bags per passenger average
  cabinCrew: number = 4,
  flightCrew: number = 2
): {
  totalPayloadWeight: number;
  passengerWeight: number;
  baggageWeight: number;
  crewWeight: number;
  serviceWeight: number;
} {
  const categoryWeights = FLIGHT_CATEGORY_WEIGHTS[flightCategory];
  
  const passengerWeight = passengerCount * categoryWeights.passenger;
  const baggageWeight = passengerCount * categoryWeights.totalBaggage * checkedBagRatio;
  const crewWeight = calculateCrewWeight(flightCrew, cabinCrew).totalWeight;
  const serviceWeight = calculateServiceLoad(passengerCount, flightCategory);

  return {
    totalPayloadWeight: passengerWeight + baggageWeight + crewWeight + serviceWeight,
    passengerWeight,
    baggageWeight,
    crewWeight,
    serviceWeight,
  };
}
