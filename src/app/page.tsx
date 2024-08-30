"use client";

import "../app/globals.css";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import { ReactNode, useState, useEffect } from "react";
import { IoIosMail } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";

const googleColors = ["#4285F4", "#EA4335", "#F7E01A", "#34A853"];
const cities = [
  "New York, USA", "Los Angeles, USA", "Chicago, USA", "Houston, USA", "Phoenix, USA", "Philadelphia, USA",
  "San Antonio, USA", "San Diego, USA", "Dallas, USA", "San Jose, USA", "New Delhi, India", "Mumbai, India",
  "Bangalore, India", "Dharamshala, India", "Mexico City, Mexico", "Shahpur, India", "Chennai, India", "Jaipur, India",
  "Kangra, India"
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
  const [backgroundImage, setBackgroundImage] = useState<string>("url('/images/weather/default.jpg')");

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

  const getBackgroundImage = (condition: string) => {
    if (condition.toLowerCase().includes("sunny") || condition.toLowerCase().includes("clear")) {
      return "url('/images/weather/sunny.jpg')";
    } else if (condition.toLowerCase().includes("cloudy") || condition.toLowerCase().includes("overcast")) {
      return "url('/images/weather/cloudy.jpg')";
    } else if (condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("drizzle")) {
      return "url('/images/weather/rainy.jpg')";
    } else if (condition.toLowerCase().includes("snow")) {
      return "url('/images/weather/snowy.jpg')";
    } else if (condition.toLowerCase().includes("thunderstorm")) {
      return "url('/images/weather/thunderstorm.jpg')";
    } else if (condition.toLowerCase().includes("mist") || condition.toLowerCase().includes("fog")) {
      return "url('/images/weather/mist.jpg')";
    } else {
      return "url('/images/weather/default.jpg')";
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
            country: data.location.country, // Added this line to include the country
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
              <div className="text-center text-2xl p-2 font-medium">
                {api_data.city}, {api_data.country} {/* Display both city and country */}
              </div>
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

          setBackgroundImage(getBackgroundImage(api_data.condition));
          setShowWelcome(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSearch = () => {
    getWeather();
    setShowSuggestions(false); // Hide suggestions after search
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocation(suggestion);
    setShowSuggestions(false);
    getWeather();
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen py-2 bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage }}
    >
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 flex flex-wrap items-center justify-between py-4 bg-white shadow-md px-6 w-full z-10">
        <h1 className="text-3xl lg:text-4xl font-bold hidden lg:block" style={{ fontFamily: "Georama" }}>
          {colorizedText("Weather")}
        </h1>
        <div className="flex items-center gap-2 hidden lg:flex">
          <IoIosMail className="transition-colors duration-300 hover:text-blue-700" />
          <span className="hover:text-blue-700 cursor-pointer transition-colors duration-300">vr772107@gmail.com</span>
          <IoCall className="transition-colors duration-300 hover:text-blue-700" />
          <span className="hover:text-blue-700 cursor-pointer transition-colors duration-300">8219198229</span>
          <FaLocationDot className="transition-colors duration-300 hover:text-blue-700" />
          <span className="hover:text-blue-700 cursor-pointer transition-colors duration-300">Dharamshala</span>
        </div>
        {/* Search bar */}
        <div className="relative flex items-center space-x-2 w-full max-w-md">
          <input
            className="block w-full bg-gray-200 text-black rounded-full shadow-inner py-2 px-4 transition-all duration-300 focus:outline-gray-300 focus:ring-2 focus:ring-blue-600"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to prevent immediate hiding
            placeholder="Location..(e.g., Dharamshala)"
          />
          <button
            onClick={handleSearch}
            className="h-10 px-4 text-white bg-blue-500 rounded-full hover:bg-blue-700 transition-colors duration-300"
          >
            <FaSearch />
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 transition-all duration-300">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
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
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-start w-full px-6 mt-24 lg:mt-52 gap-4 lg:gap-6 max-w-3xl">
        <div className="w-full max-w-md mb-6 lg:mb-0">
          {showWelcome && (
            <div className="mb-4">
              <h1 className="text-xl lg:text-2xl font-semibold mb-4 text-center bg-gradient-to-r from-blue-400 to-green-400 text-white p-4 rounded-lg shadow-lg transition-all duration-300">
                Welcome to our weather service provided by Vishal Rana. Please enter the city you&apos;d like to retrieve weather information for, and we&apos;ll display the current conditions and forecast for that location.
              </h1>
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md text-center w-full">
            {weather}
          </div>
        </div>
      </div>
    </div>
  );
}
