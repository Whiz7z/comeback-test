import { usePlacesWidget } from "react-google-autocomplete";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchWeatherData } from "../store/weatherSlice";
import { AppDispatch } from "../store/store";

const SearchInput: React.FC = () => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [city, setCity] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const { ref } = usePlacesWidget({
    apiKey: import.meta.env.VITE_MY_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => {
      if (place.geometry?.location) {
        const location = place.geometry.location.toJSON();
        setCoordinates(location);
        setCity(place.formatted_address || "");
      }
    },
  });

  const handleGetWeather = () => {
    if (city) {
      dispatch(fetchWeatherData({ ...coordinates, city }));
    }
  };

  return (
    <Box width="100%" mt={4} display="flex" flexDirection="column">
      <Box
        display="flex"
        alignSelf={"center"}
        alignContent="center"
        gap={2}
        justifyItems={"center"}
      >
        <TextField
          inputRef={ref}
          id="standard-basic"
          label="City"
          variant="standard"
        />

        <Button variant="contained" onClick={handleGetWeather}>
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default SearchInput;