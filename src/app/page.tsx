"use client";

import "../app/globals.css";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import { ReactNode, useState, useEffect } from "react";
import { IoIosMail } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";

const googleColors = ["#4285F4", "#EA4335", "#F7E01A", "#34A853"];
const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
  "San Antonio", "San Diego", "Dallas", "San Jose", "Delhi", "Mumbai", "Bangalore", 
  "Dharamshala", "Mexico", "Shahpur", "Chennai", "Jaipur", "Kangra"
];

const colorizedText = (text: string) => {
  return text.split("").map((char, index) => (
    <span key={index} style={{ color: googleColors[index % googleColors.length] }}>
      {char}
    </span>
  ));
};

export default function Home() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<ReactNode>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [background, setBackground] = useState<string>("bg-gray-100");

  useEffect(() => {
    if (location) {
      const filteredSuggestions = cities.filter((city) =>
        city.toLowerCase().includes(location.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [location]);

  const getBackgroundStyle = (condition: string) => {
    if (condition.toLowerCase().includes("sunny") || condition.toLowerCase().includes("clear")) {
      return "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500";
    } else if (condition.toLowerCase().includes("cloudy") || condition.toLowerCase().includes("overcast")) {
      return "bg-gradient-to-r from-yellow-400 to-gray-600";
    } else if (condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("drizzle")) {
      return "bg-gradient-to-r from-blue-400 to-blue-600";
    } else if (condition.toLowerCase().includes("snow")) {
      return "bg-gradient-to-r from-gray-200 to-whitw-500 to black-500";
    } else if (condition.toLowerCase().includes("thunderstorm")) {
      return "bg-gradient-to-r from-gray-600 to-gray-900";
    } else {
      return "bg-gray-100";
    }
  };

  const getWeather = async () => {
    const api_key = "600c304e2fd54dca83972135242808";
    const api_url = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${location}`;

    if (location) {
      try {
        const res = await fetch(api_url);
        const data = await res.json();

        if (data) {
          const api_data = {
            city: data.location.name,
            temp: data.current.temp_c,
            humidity: data.current.humidity,
            wind: data.current.wind_mph,
            gust: data.current.gust_mph,
            visibility: data.current.vis_miles,
            condition: data.current.condition.text,
            img: data.current.condition.icon,
          };

          setWeather(
            <>
              <div className="text-center text-2xl p-2 font-medium">{api_data.city}</div>
              <div className="flex justify-center mb-4">
                <img src={api_data.img} width="80" height="80" alt="condition" />
              </div>
              <div className="text-4xl font-semibold text-center mb-2">
                Temp: {api_data.temp}°C
              </div>
              <div className="text-center text-xl mb-4">
                {colorizedText(api_data.condition)}
              </div>
              <div className="flex flex-wrap justify-between text-gray-500 text-sm">
                <div>Humidity: {api_data.humidity}%</div>
                <div>Wind: {api_data.wind} mph</div>
                <div>Visibility: {api_data.visibility} miles</div>
                <div>Gust: {api_data.gust} mph</div>
              </div>
            </>
          );

          setBackground(getBackgroundStyle(api_data.condition));
          setShowWelcome(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSearch = () => {
    getWeather();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocation(suggestion);
    setShowSuggestions(false);
    getWeather();
  };

  return (
    <div className={`flex flex-col items-center justify-start min-h-screen py-2 ${background} transition-colors duration-500`}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 flex flex-wrap items-center justify-between py-4 bg-white shadow-md px-6 w-screen z-10">
        <h1 className="text-4xl font-bold hidden lg:block" style={{ fontFamily: "Georama" }}>
          {colorizedText("Weather")}
        </h1>
        <div className="flex items-center gap-2 hidden lg:flex">
          <IoIosMail />
          <span className="hover:text-blue-700 cursor-pointer">vr772107@gmail.com</span>
          <IoCall />
          <span className="hover:text-blue-700 cursor-pointer">8219198229</span>
          <FaLocationDot />
          <span className="hover:text-blue-700 cursor-pointer">Dharamshala</span>
        </div>
        {/* Search bar */}
        <div className="relative flex items-center space-x-2 w-full max-w-md">
          <input
            className="block w-full bg-gray-200 text-black rounded-full shadow-inner py-2 px-4 focus:outline-gray-300 focus:ring-2 focus:ring-blue-600"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            placeholder="Location..(e.g., New York)"
          />
          <button
            onClick={handleSearch}
            className="h-10 px-4 text-white bg-blue-500 rounded-full hover:bg-blue-700 transition-colors duration-300"
          >
            <FaSearch />
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row items-start justify-start w-full px-6 mt-52 gap-2 max-w-3xl">
        <div className="w-full max-w-md mb-6 lg:mb-0">
          {showWelcome && (
            <div className="mb-4">
              <h1 className="text-2xl font-semibold mb-4 text-center bg-gradient-to-r from-blue-400 to-green-400 text-white p-4 rounded-lg shadow-lg">
                Welcome to our weather service provided by Vishal Rana. Please enter the city you'd like to retrieve weather information for, and we'll display the current conditions and forecast for that location.
              </h1>
            </div>
          )}
          <div className="bg-gray-800 shadow-lg rounded-3xl px-8 pt-6 pb-8 text-white">
            {weather}
          </div>
        </div>

        {/* Right-side search bar */}
        <div className="w-full max-w-md lg:w-[800px] mt-6 lg:mt-12 lg:ml-8 hidden lg:block">
          <h1 className="text-4xl lg:text-7xl font-bold mb-4 text-center" style={{ fontFamily: "Georama" }}>
            {colorizedText("Weather")}
          </h1>
          <div className="flex items-center space-x-2 w-full"></div>

          <div className="flex items-center space-x-2 w-full mb-4">
            <input
              className="block w-full bg-gray-200 text-black rounded-full shadow-inner py-2 px-4 focus:outline-gray-300 focus:ring-2 focus:ring-blue-600"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location..(e.g., New York)"
            />
            <button
              onClick={handleSearch}
              className="h-10 px-4 text-white bg-blue-500 rounded-full hover:bg-blue-700 transition-colors duration-300"
            >
              <FaSearch />
            </button>
          </div>
          <p className="text-lg mb-4 font-medium text-gray-700 text-center">
            Enter the name of the city to get the current weather conditions. For more detailed forecasts, try our main search bar.
          </p>
        </div>
      </div>
    </div>
  );
}
