import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { useAuth } from "../Service/auth";

const PieChart = ({ id }) => {
  const { allUser } = useAuth();

  // Find the user based on the passed id
  const user = allUser.find((user) => user._id === id);
  if (!user) {
    return <div>No user found with ID {id}</div>;
  }

  // Create an array of unique categories based on the user's viewed movies
  const allCategories = [
    ...new Set(user.viewMovies.map((movie) => movie.category)),
  ];

  // Prepare the data for the chart
  const categoryCounts = allCategories.map(() => 0); // Initialize count for each category

  // Fill the categoryCounts array with the number of movies viewed per category for the user
  user.viewMovies.forEach((movie) => {
    const categoryIndex = allCategories.indexOf(movie.category);
    if (categoryIndex !== -1) {
      categoryCounts[categoryIndex] += 1; // Increment the counter for the correct category
    }
  });

  // Prepare the chart data
  const chartData = {
    labels: allCategories, // Movie categories as labels
    datasets: [
      {
        label: "Movies Viewed by Category",
        data: categoryCounts,
        backgroundColor: allCategories.map(
          () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, 0.6)`
        ), // Random colors for each category
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
