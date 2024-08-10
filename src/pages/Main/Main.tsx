
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loadStateFromLocalStorage,
  selectWeatherData,
  refreshAllWeatherData,
} from "../../store/weatherSlice";
import SearchInput from "../../components/SearchInput";
import WeatherCard from "../../components/WeatherCard";
import { Box } from "@mui/material";
import { AppDispatch } from "../../store/store";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const weatherData = useSelector(selectWeatherData);


 useEffect(() => {
   dispatch(loadStateFromLocalStorage());
   dispatch(refreshAllWeatherData());
 }, [dispatch]);

 return (
   <div style={{ display: "grid", gap: "40px", justifyContent: "center" }}>
     <SearchInput />
     <Box
       display={"flex"}
       justifyContent={"center"}
       flexWrap="wrap"
       gap={2}
       maxWidth={"1200px"}
       width={"100%"}
     >
       {weatherData &&
         weatherData.map((data, index) => (
           <Box
             key={index}
             flexBasis="calc(33.333% - 16px)" 
             maxWidth="calc(33.333% - 16px)" 
             flexGrow={1} 
             minWidth="280px" 
             width="100%"
           >
             <WeatherCard
               id={data.id}
               city={data.city}
               coordinates={data.coordinates}
               temp={data.current.temp}
               description={data.current.weather[0].description}
               icon={data.current.weather[0].icon}
             />
           </Box>
         ))}
     </Box>
   </div>
 );
};

export default App;