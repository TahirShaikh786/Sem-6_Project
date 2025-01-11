import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useAuth } from "../Service/auth";

const BarChart = ({id}) => {
  const { allUser } = useAuth();

  // Create an array of unique categories
  const allCategories = [
    ...new Set(
      allUser.flatMap((user) => user.viewMovies.map((movie) => movie.category))
    ),
  ];

  // Prepare the data for the chart
  const userNames = allUser.map((user) => user._id);
  const categoryCounts = allCategories.map(() => allUser.map((user) => 0)); // Initialize count for each category for each user

  // Fill the categoryCounts array with the number of movies viewed per category for each user
  allUser.forEach((user, userIndex) => {
    user.viewMovies.forEach((movie) => {
      const categoryIndex = allCategories.indexOf(movie.category);
      if (categoryIndex !== -1) {
        categoryCounts[categoryIndex][userIndex] += 1; // Increment the counter for the correct category
      }
    });
  });

  // Prepare the chart data
  const chartData = {
    labels: userNames, // User names as labels
    datasets: allCategories.map((category, categoryIndex) => ({
      label: category,
      data: categoryCounts[categoryIndex],
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.6)`, // Random color for each category
    })),
  };

  return <Bar data={chartData} />;
};

export default BarChart;
