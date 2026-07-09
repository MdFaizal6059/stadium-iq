// FIFA World Cup 2026 official host stadiums (16 venues across USA, Canada, Mexico)
export type Stadium = {
  id: string;
  name: string;
  city: string;
  country: "USA" | "Canada" | "Mexico";
  lat: number;
  lng: number;
  capacity: number;
  matches: number;
};

export const HOST_STADIUMS: Stadium[] = [
  { id: "atl", name: "Atlanta Stadium", city: "Atlanta", country: "USA", lat: 33.7554, lng: -84.4008, capacity: 71000, matches: 8 },
  { id: "bos", name: "Boston Stadium", city: "Boston", country: "USA", lat: 42.0909, lng: -71.2643, capacity: 65878, matches: 7 },
  { id: "dal", name: "Dallas Stadium", city: "Dallas", country: "USA", lat: 32.7473, lng: -97.0945, capacity: 80000, matches: 9 },
  { id: "hou", name: "Houston Stadium", city: "Houston", country: "USA", lat: 29.6847, lng: -95.4107, capacity: 72220, matches: 7 },
  { id: "kc", name: "Kansas City Stadium", city: "Kansas City", country: "USA", lat: 39.0489, lng: -94.4839, capacity: 76416, matches: 6 },
  { id: "la", name: "Los Angeles Stadium", city: "Los Angeles", country: "USA", lat: 33.9535, lng: -118.3392, capacity: 70240, matches: 8 },
  { id: "mia", name: "Miami Stadium", city: "Miami", country: "USA", lat: 25.958, lng: -80.2389, capacity: 65326, matches: 7 },
  { id: "nyc", name: "New York New Jersey Stadium", city: "New York / New Jersey", country: "USA", lat: 40.8135, lng: -74.0745, capacity: 82500, matches: 8 },
  { id: "phi", name: "Philadelphia Stadium", city: "Philadelphia", country: "USA", lat: 39.9008, lng: -75.1675, capacity: 69796, matches: 6 },
  { id: "sf", name: "San Francisco Bay Area Stadium", city: "San Francisco Bay Area", country: "USA", lat: 37.4032, lng: -121.9698, capacity: 68500, matches: 6 },
  { id: "sea", name: "Seattle Stadium", city: "Seattle", country: "USA", lat: 47.5952, lng: -122.3316, capacity: 68740, matches: 6 },
  { id: "tor", name: "Toronto Stadium", city: "Toronto", country: "Canada", lat: 43.6332, lng: -79.4185, capacity: 45500, matches: 6 },
  { id: "van", name: "BC Place Vancouver", city: "Vancouver", country: "Canada", lat: 49.2767, lng: -123.1119, capacity: 54500, matches: 7 },
  { id: "mex", name: "Mexico City Stadium", city: "Mexico City", country: "Mexico", lat: 19.3029, lng: -99.1505, capacity: 87000, matches: 5 },
  { id: "gdl", name: "Guadalajara Stadium", city: "Guadalajara", country: "Mexico", lat: 20.6819, lng: -103.4626, capacity: 46232, matches: 4 },
  { id: "mty", name: "Monterrey Stadium", city: "Monterrey", country: "Mexico", lat: 25.6692, lng: -100.2447, capacity: 53500, matches: 4 },
];

export function getStadium(id: string): Stadium {
  return HOST_STADIUMS.find((s) => s.id === id) ?? HOST_STADIUMS[0];
}

// Deterministic pseudo-live metrics derived from stadium id + minute bucket,
// so the UI feels dynamic without external calls but stays stable per stadium.
export function liveMetricsFor(s: Stadium, tick = Math.floor(Date.now() / 15000)) {
  const seed = [...s.id].reduce((a, c) => a + c.charCodeAt(0), 0) + tick;
  const r = (n: number, mod: number) => ((seed * (n + 7)) % mod + mod) % mod;
  const attendance = Math.min(s.capacity, Math.round(s.capacity * (0.72 + r(1, 24) / 100)));
  return {
    attendance,
    density: 55 + r(2, 40), // %
    tempC: 14 + r(3, 20),
    windKph: 4 + r(4, 22),
    airQuality: 22 + r(5, 60),
    transitDelayMin: r(6, 8),
    accessibilityLoad: 30 + r(7, 55),
    riskLevel: (["Low", "Moderate", "Elevated", "High"] as const)[r(8, 4)],
  };
}

// Convert (lat, lng) into projected 2D coordinates on a stylized North-America
// bounding box used by the 3D-tilted SVG map.
export function project(lat: number, lng: number, w: number, h: number) {
  const minLng = -125,
    maxLng = -75,
    minLat = 15,
    maxLat = 55;
  const x = ((lng - minLng) / (maxLng - minLng)) * w;
  const y = ((maxLat - lat) / (maxLat - minLat)) * h;
  return { x, y };
}