import React from "react";
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { fetchWeatherData, deleteCity } from "../store/weatherSlice";
import { useNavigate } from "react-router-dom";

interface WeatherCardProps {
  id: string;
  city: string;
  coordinates: { lat: number; lng: number };
  temp: number;
  description: string;
  icon: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  id,
  city,
  coordinates,
  temp,
  description,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleRefresh = () => {
    dispatch(fetchWeatherData({ ...coordinates, city }));
  };

  const handleDelete = () => {
    dispatch(deleteCity(id));
  };

  const handleCardClick = () => {
    navigate(`/weather/${id}`);
  };

  return (
    <Card
      sx={{ maxWidth: '100%', height: '100%', display:'grid' }}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {city}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body1" color="text.primary">
          Temp: {temp}°C
        </Typography>
        
      </CardContent>
      <CardActions sx={{  alignContent: "flex-end", alignSelf: 'flex-end' }}>
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleRefresh();
          }}
        >
          Refresh
        </Button>
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          color="secondary"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default WeatherCard;