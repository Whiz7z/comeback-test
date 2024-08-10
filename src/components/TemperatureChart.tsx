import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TemperatureChartProps {
  hourlyData: {
    dt: number;
    temp: number;
  }[];
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ hourlyData }) => {
  const data = {
    labels: hourlyData.map((dataPoint) => {
      const date = new Date(dataPoint.dt * 1000);
      return date.getHours() + ":00";
    }),
    datasets: [
      {
        label: "Temperature (°C)",
        data: hourlyData.map((dataPoint) => dataPoint.temp), 
        fill: false,
        borderColor: "rgba(10,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Hour of the Day",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
        },
        ticks: {
          callback: function (value: string | number) {
            if (typeof value === "number") {
              return value.toFixed(1); 
            }
            return value;
          },
        },
      },
    },
  };

  return (
    <Box sx={{ width: "900px" }}>
      <Line data={data} options={options} />
    </Box>
  );
};

export default TemperatureChart;
