import React, { useState } from "react";
import Papa from "papaparse";
import { Chart, registerables } from "chart.js";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const Klant = () => {
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

      // Extract unique company countries from the data
      const countries = Array.from(new Set(parsedData.map((row) => row.retailer_country)));

      // Calculate the count of products made for each country
      const productCountByCountry = countries.map((country) => {
        const filteredData = parsedData.filter((row) => row.retailer_country === country);
        const productCount = filteredData.length;
        return productCount;
      });

      // Create a new chart instance
      const ctx = document.getElementById("chart").getContext("2d");
      const newChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: countries,
          datasets: [
            {
              label: "Product Count",
              data: productCountByCountry,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
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

  const handlevier = () => {
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
  
      // Filter out rows with empty 'retailer_company' value
    const filteredData = parsedData.filter((row) => row.retailer_company !== "");

    // Extract unique company names from the filtered data
    const companies = Array.from(new Set(filteredData.map((row) => row.retailer_company)));

    // Calculate the amount of products sold for each company
    const productCountByCompany = companies.map((company) => {
      const filteredCompanyData = filteredData.filter((row) => row.retailer_company === company);
      const productCount = filteredCompanyData.length;
      return {
        company,
        productCount,
      };
    });
  
      // Sort the companies by product count in descending order
      productCountByCompany.sort((a, b) => b.productCount - a.productCount);
  
      // Take only the top 20 companies
      const top20Companies = productCountByCompany.slice(0, 20);
  
      // Extract the company names and product counts for the chart
      const labels = top20Companies.map((company) => company.company);
      const data = top20Companies.map((company) => company.productCount);
  
      // Create a new chart instance
      const ctx = document.getElementById("chart").getContext("2d");
      const newChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Product Count",
              data: data,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              precision: 0,
            },
          },
        },
      });
  
      // Set the new chart instance to the state
      setChartInstance(newChartInstance);
    };
    reader.readAsText(file);
  };

  
  return (
    <div>
      <label htmlFor="csvInput" style={{ display: "block" }}>
        enter CSV asdasdasFile
      </label>
      <input onChange={handleFileChange} id="csvInput" name="file" type="file" />
      <div>
        <button onClick={handleParse}>Product Count</button>
        <button onClick={handlevier}>vraag 5</button>
      </div>
      <div style={{ marginTop: "3rem" }}>
        {error ? (
          error
        ) : (
          <canvas id="chart" style={{ maxWidth: "2000px" }}></canvas>
        )}
      </div>
    </div>
  );
};

export default Klant;