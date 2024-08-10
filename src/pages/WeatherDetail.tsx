import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { selectWeatherById, loadStateFromLocalStorage } from "../store/weatherSlice";
import { RootState, AppDispatch } from "../store/store";
import { Button, Typography, Box } from "@mui/material";
import TemperatureChart from "../components/TemperatureChart";

const WeatherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

   


  const weatherData = useSelector((state: RootState) =>
    selectWeatherById(state, id!)
  );

  useEffect(() => {
    if (!weatherData && id) {
      dispatch(loadStateFromLocalStorage());
    }
  }, [weatherData, dispatch, id]);

  if (!weatherData) {
    return <Typography variant="h5">City not found</Typography>;
  }

 

  return (
    <Box p={2}>
      <Button variant="contained" onClick={() => navigate(-1)}>
        Back
      </Button>
      <Typography variant="h4" mt={2}>
        Weather in {weatherData.city}
      </Typography>
      <Typography variant="body1" mt={2}>
        Temperature: {weatherData.current.temp}°C
      </Typography>
      <Typography variant="body1" mt={2}>
        Description: {weatherData.current.weather[0].description}
      </Typography>
      <Typography variant="body1" mt={2}>
        Humidity: {weatherData.current.humidity}%
      </Typography>
      <Typography variant="body1" mt={2}>
        Wind Speed: {weatherData.current.wind_speed} m/s
      </Typography>
      <Typography variant="body1" mt={2}>
        Wind Direction: {weatherData.current.wind_deg}°
      </Typography>
      <Typography variant="h5" mt={4}>
        Hourly Temperature Forecast
      </Typography>
      <TemperatureChart
        hourlyData={weatherData.hourly as { dt: number; temp: number }[]}
      />
    </Box>
  );
};

export default WeatherDetail;