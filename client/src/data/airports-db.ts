export interface Airport {
    code: string;
    name: string;
    city: string;
    country: string;
    lat: number;
    lon: number;
  }

  export const AIRPORTS: Airport[] = [
    {
      code: "IST",
      name: "Istanbul Airport",
      city: "Istanbul",
      country: "Turkey",
      lat: 41.2753,
      lon: 28.7519
    },
    {
      code: "JFK",
      name: "John F. Kennedy International Airport",
      city: "New York",
      country: "USA",
      lat: 40.6413,
      lon: -73.7781
    }
  ];
