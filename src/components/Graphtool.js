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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraphTooltip = ({ graphData, lastUpdated, isActive }) => {
  if (!graphData) return null;

  const chartData = {
    labels: graphData.time,
    datasets: [
      {
        label: "Temperature",
        data: graphData.temperature,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Temperature (°C)" } },
    },
  };

  return (
    <div className="tooltip">
      <p>Last Updated: {lastUpdated}</p>
      <p>Status: {isActive ? "Active" : "Inactive"}</p>
      <div style={{ height: "150px", width: "100%" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default GraphTooltip;
