import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "./store";

interface Coordinates {
  lat: number;
  lng: number;
}

interface WeatherData {
  id: string;
  city: string;
  coordinates: Coordinates;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: [
      {
        id: number;
        main: string;
        description: string;
        icon: string;
      }
    ];
  };
  daily: unknown[];
  [key: string]: unknown;
}

interface WeatherState {
  weatherData: WeatherData[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WeatherState = {
  weatherData: [],
  status: "idle",
  error: null,
};

export const fetchWeatherData = createAsyncThunk(
  "weather/fetchWeatherData",
  async ({ lat, lng, city }: Coordinates & { city: string }, { getState }) => {
    const state = getState() as RootState;
    const existingCity = state.weather.weatherData.find(
      (data) => data.city === city
    );

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely,daily&units=metric&appid=${
      import.meta.env.VITE_API_KEY
    }&units=metric`;
    const response = await axios.get(url);
    return {
      data: {
        ...response.data,
        city,
        coordinates: { lat, lng },
        id: existingCity ? existingCity.id : uuidv4(), 
      },
    };
  }
);

export const refreshAllWeatherData = createAsyncThunk(
  "weather/refreshAllWeatherData",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const promises = state.weather.weatherData.map((city) =>
      axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${
          city.coordinates.lat
        }&lon=${city.coordinates.lng}&exclude=minutely,daily&appid=${
          import.meta.env.VITE_API_KEY
        }&units=metric`
      )
    );
    const responses = await Promise.all(promises);
    return responses.map((response, index) => ({
      data: {
        ...response.data,
        city: state.weather.weatherData[index].city,
        coordinates: state.weather.weatherData[index].coordinates,
        id: state.weather.weatherData[index].id,
      },
    }));
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    loadStateFromLocalStorage(state) {
      const savedState = localStorage.getItem("weatherState");
      if (savedState) {
        return JSON.parse(savedState) as WeatherState;
      }
      return state;
    },
    deleteCity(state, action: PayloadAction<string>) {
      state.weatherData = state.weatherData.filter(
        (city) => city.id !== action.payload
      );
      localStorage.setItem("weatherState", JSON.stringify(state));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchWeatherData.fulfilled,
        (state, action: PayloadAction<{ data: WeatherData }>) => {
          state.status = "succeeded";
          const existingCityIndex = state.weatherData.findIndex(
            (data) => data.id === action.payload.data.id
          );
          if (existingCityIndex !== -1) {
            state.weatherData[existingCityIndex] = action.payload.data;
          } else {
            state.weatherData.push(action.payload.data);
          }
          localStorage.setItem("weatherState", JSON.stringify(state));
        }
      )
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const { loadStateFromLocalStorage, deleteCity } = weatherSlice.actions;

export const selectWeatherData = (state: RootState) =>
  state.weather.weatherData;
export const selectWeatherById = (state: RootState, id: string) =>
  state.weather.weatherData.find((city) => city.id === id);

export default weatherSlice.reducer;
