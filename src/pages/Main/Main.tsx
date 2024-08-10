
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loadStateFromLocalStorage,
  selectWeatherData,
  refreshAllWeatherData,
} from "../../store/weatherSlice";
import SearchInput from "../../components/SearchInput";
import WeatherCard from "../../components/WeatherCard";
import { Grid } from "@mui/material";
import { AppDispatch } from "../../store/store";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const weatherData = useSelector(selectWeatherData);

  console.log(weatherData, 'weatherData');

 useEffect(() => {
   dispatch(loadStateFromLocalStorage());
   dispatch(refreshAllWeatherData());
 }, [dispatch]);

 return (
   <div>
     <SearchInput />
     <Grid container spacing={2} mt={4}>
       {weatherData &&weatherData.map((data, index) =>   (

        
         <Grid item key={index} xs={12} sm={6} md={4}>
           <WeatherCard
             id={data.id}
             city={data.city}
             coordinates={data.coordinates}
             temp={data.current.temp}
             description={data.current.weather[0].description}
             icon={data.current.weather[0].icon}
           />
         </Grid>
       ))}
     </Grid>
   </div>
 );
};

export default App;