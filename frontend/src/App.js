import React, { useState } from "react";
import Papa from "papaparse";
import {Chart , registerables} from "chart.js";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const App = () => {
  // This state will store the parsed data
  const [data, setData] = useState([]);

  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  const [chartInstance, setChartInstance] = useState(null);

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");

    // Check if the user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extension, if it is not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct, set the state
      setFile(inputFile);
    }
  };

  const handleParse = () => {
    Chart.register(...registerables);
    // If the user clicks the parse button without
    // a file, we show an error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows the user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on the reader when the file
    // loads, we parse it and set the data.
    reader.onload = ({ target }) => {
        const csv = Papa.parse(target.result, { header: true });
        const parsedData = csv?.data;
        const columns = Object.keys(parsedData[0]);
        setData(parsedData);

        // Destroy the previous chart instance if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }
      
        // Extract unique years from the data
        const years = Array.from(new Set(parsedData.map((row) => row.Year)));
      
        // Calculate total revenue for each year
        const revenueByYear = years.map((year) => {
          const filteredData = parsedData.filter((row) => row.Year === year);
          const revenue = filteredData.reduce((total, row) => total + parseFloat(row.omzet), 0);
          return revenue;
        });
      
        // Create a new chart instance
        const ctx = document.getElementById("chart").getContext("2d");
        const newChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: years,
            datasets: [{
              label: 'Revenue',
              data: revenueByYear,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            }],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      
        // Set the new chart instance to the state
        setChartInstance(newChartInstance);
      };
      reader.readAsText(file);
      
  };

  // Function to generate a random color value
  const getRandomColor = () => Math.floor(Math.random() * 256);

  return (
    <div>
      <label htmlFor="csvInput" style={{ display: "block" }}>
        Enter CSV File
      </label>
      <input onChange={handleFileChange} id="csvInput" name="file" type="file" />
      <div>
        <button onClick={handleParse}>Revenue</button>
      </div>
      <div style={{ marginTop: "3rem" }}>
        {error ? (
          error
        ) : (
          <canvas id="chart" style={{ maxWidth: "600px" }}></canvas>
        )}
      </div>
    </div>
  );
};

export default App;
