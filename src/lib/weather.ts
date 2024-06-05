import axios from "axios";

/*
"latitude": 52.52,
  "longitude": 13.419,
  "elevation": 44.812,
  "generationtime_ms": 2.2119,
  "utc_offset_seconds": 0,
  "timezone": "Europe/Berlin",
  "timezone_abbreviation": "CEST",
  "hourly": {
    "time": ["2022-07-01T00:00", "2022-07-01T01:00", "2022-07-01T02:00", ...],
    "temperature_2m": [13, 12.7, 12.7, 12.5, 12.5, 12.8, 13, 12.9, 13.3, ...]
  },
  "hourly_units": {
    "temperature_2m": "°C"
  }*/

export type WeatherApiResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  hourly?: { time: string[]; temperature_2m: number[] };
  hourly_units?: { temperature_2m: string };
  daily?: {
    temperature_2m_max: number[];
    time: string[];
    weather_code: number[];
  };
  daily_units?: { temperature_2m_max: string; time: string };
};

export type LocationConfig = { latitude: number; longitude: number };

export async function getCurrentLocation() {
  return new Promise<LocationConfig>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        resolve({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      },
      () => reject("error")
    );
  });
}

export async function getWeather(
  location: LocationConfig
): Promise<WeatherApiResponse> {
  let response = await axios.get<WeatherApiResponse>(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=weather_code&daily=temperature_2m_max`
  );

  return response.data;
}
