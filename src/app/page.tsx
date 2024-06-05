"use client";

import { ICON_SIZE } from "@/lib/configs";
import {
  LocationConfig,
  WeatherApiResponse,
  getCurrentLocation,
  getWeather,
} from "@/lib/weather";

import { useEffect, useState } from "react";

import {
  WiCelsius,
  WiDayCloudyHigh,
  WiDayShowers,
  WiDaySunny,
  WiDayFog,
} from "react-icons/wi";

const weatherIcons = [
  <WiDaySunny size={ICON_SIZE.small} />,
  <WiDayCloudyHigh size={ICON_SIZE.small} />,
  <WiDayShowers size={ICON_SIZE.small} />,
  <WiDayFog size={ICON_SIZE.small} />,
];

function getWeatherIconIndex(iconNumber: number) {
  let icon: number;
  switch (iconNumber) {
    case 1:
    case 2:
    case 3:
      icon = 2;
      break;
    case 45:
    case 48:
      icon = 3;
      break;
    case 61:
    case 63:
    case 65:
      icon = 2;
      break;
    default:
      icon = 0;
      break;
  }
  return icon;
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherApiResponse>();
  const [icon, setIcon] = useState(0);

  useEffect(() => {
    getCurrentLocation().then((response) => {
      getWeather(response).then((response) => {
        console.log(response);
        setWeather(response);
      });
    });
  }, []);

  return (
    <div className="flex h-screen justify-center items-center bg-orange-100">
      <div className="p-2 border border-orange-300 w-1/2 h-2/3 grid grid-rows-3 grid-cols-2 gap-2 text-6xl font-bold bg-orange-200">
        <div className="flex items-center justify-center border border-orange-400">
          <div className="relative">
            <p>{weather?.daily?.temperature_2m_max[0]}</p>
            <WiCelsius
              size={ICON_SIZE.small}
              className="absolute -right-8 -top-2 "
            />
          </div>
        </div>
        <div className="relative flex items-center justify-center border border-orange-400">
          {weather?.daily?.weather_code[0] &&
            weatherIcons[getWeatherIconIndex(weather.daily.weather_code[0])]}
          <p className="absolute bottom-2 left-2 text-base">
            {weather?.daily?.time[0].split("-").reverse().join("/")}
          </p>
        </div>
        <div className="border border-orange-400 flex flex-col col-start-2 row-span-full divide-orange-400 divide-y justify-evenly overflow-auto">
          {weather?.daily?.temperature_2m_max.map(
            (temperature, temperatureIndex) =>
              temperatureIndex !== 0 && (
                <div
                  className="flex justify-evenly items-center text-xl border-orange-400 p-1"
                  key={`${temperatureIndex}-${temperature}`}
                >
                  {weather.daily?.time[temperatureIndex]
                    .split("-")
                    .reverse()
                    .join("/")}{" "}
                  {temperature.toFixed(1)}{" "}
                  {weather?.daily?.weather_code &&
                    weatherIcons[
                      getWeatherIconIndex(
                        weather?.daily?.weather_code[temperatureIndex]
                      )
                    ]}
                </div>
              )
          )}
        </div>
        <div className="flex text-4xl items-center justify-center">
          Santos - SP
        </div>
      </div>
    </div>
  );
}
