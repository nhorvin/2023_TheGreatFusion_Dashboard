import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { Chart, registerables } from "chart.js";
import "chart.js/auto";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const Dashboard = () => {
  // This state will store the parsed data
  const [data, setData] = useState([]);
  // It state will contain the error when correct file extension is not used
  const [error, setError] = useState("");
  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  // Create refs to store chart instances
  const chartRef = useRef(null);
  const chartByMonthRef = useRef(null);

  // Cleanup chart instances on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      if (chartByMonthRef.current) {
        chartByMonthRef.current.destroy();
      }
    };
  }, []);

  // This function will be called when the file input changes
  const handleFileChange = (e) => {
    setError("");
    // Check if the user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      // Check the file extension
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }
      // If input type is correct, set the state
      setFile(inputFile);
    }
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleRevenue = () => {
    Chart.register(...registerables);
    // If the user clicks the parse button without a file, we show an error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows the user to read any file or blob.
    const reader = new FileReader();

    // Event listener on the reader when the file loads, we parse it and set the data.
    reader.onload = ({ target }) => {
      const csv = Papa.parse(target.result, { header: true, dynamicTyping: true });

      const parsedData = csv?.data;
      const columns = Object.keys(parsedData[0]);
      setData(parsedData);

      const colors = [
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 99, 132, 0.5)",
        "rgba(75, 192, 192, 0.5)",
      ];
      // Extract unique years and months from the data
      const years = Array.from(new Set(parsedData.map((row) => row.year)));
      const months = Array.from(
        new Set(parsedData.map((row) => parseInt(row.month, 10)))
      ).sort((a, b) => a - b);

      // Extract unique "filiaal" values from the data
      const filiaalValues = Array.from(
        new Set(parsedData.map((row) => row.filiaal))
      ).filter((value) => value !== undefined);

      // Create datasets for each "filiaal" value (revenue by year)
      const datasets = filiaalValues.map((filiaal, index) => {
        const revenueByYear = years.map((year) => {
          const filteredData = parsedData.filter(
            (row) => row.year === year && row.filiaal === filiaal
          );
          const revenue = filteredData.reduce(
            (total, row) => total + parseFloat(row.Omzet),
            0
          );
          return revenue;
        });

        return {
          label: filiaal,
          data: revenueByYear,
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          borderRadius: 5,
          borderWidth: 1,
        };
      });

      // Create a new chart instance for revenue by year
      const ctx = document.getElementById("chart").getContext("2d");
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      if (chartByMonthRef.current) {
        chartByMonthRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: years,
          datasets: datasets,
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Revenue by Year",
              font: {
                size: 20, // Increase the font size for the title
              },
            },
            legend: {
              labels: {
                font: {
                  size: 14, // Increase the font size for the legend labels
                },
              },
            },
            tooltips: {
              position: "nearest", // Add this line to set the tooltip position
              titleFont: {
                size: 36, // Increase the font size for the tooltip title
              },
              bodyFont: {
                size: 34, // Increase the font size for the tooltip body
              },
            },
          },
        },
      });

      // Add click event listener to the revenue by year chart
      ctx.canvas.onclick = (evt) => {
        const activePoints = chartRef.current.getElementsAtEventForMode(
          evt,
          "nearest",
          { intersect: true },
          true
        );

        if (activePoints.length > 0) {
          const yearIndex = activePoints[0].index;
          const selectedYear = years[yearIndex];

          const datasetsByMonth = filiaalValues.map((filiaal, index) => {
            const revenueByMonth = months.map((month) => {
              const filteredData = parsedData.filter(
                (row) =>
                  row.year === selectedYear &&
                  row.month === month &&
                  row.filiaal === filiaal
              );
              const revenue = filteredData.reduce(
                (total, row) => total + parseFloat(row.Omzet),
                0
              );
              return revenue;
            });

            return {
              label: filiaal,
              data: revenueByMonth,
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length],
              borderRadius: 5,
              borderWidth: 1,
            };
          });

          // Create a new chart instance for revenue by month
          const ctxByMonth = document
            .getElementById("chartByMonth")
            .getContext("2d");
          if (chartByMonthRef.current) {
            chartByMonthRef.current.destroy();
          }
          chartByMonthRef.current = new Chart(ctxByMonth, {
            type: "bar",
            data: {
              labels: months.map((month) => monthNames[month - 1]),
              datasets: datasetsByMonth,
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                title: {
                  display: true,
                  text: `Revenue by Month - ${selectedYear}`,
                  font: {
                    size: 20, // Increase the font size for the title
                  },
                },
                legend: {
                  labels: {
                    font: {
                      size: 14, // Increase the font size for the legend labels
                    },
                  },
                },
                tooltips: {
                  position: "nearest", // Add this line to set the tooltip position
                  titleFont: {
                    size: 36, // Increase the font size for the tooltip title
                  },
                  bodyFont: {
                    size: 34, // Increase the font size for the tooltip body
                  },
                },
              },
            },
          });
        }
      };
    };

    // Read the file as text
    reader.readAsText(file);
  };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleProductSold = () => {
    Chart.register(...registerables);
    // If the user clicks the parse button without a file, we show an error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows the user to read any file or blob.
    const reader = new FileReader();

    // Event listener on the reader when the file loads, we parse it and set the data.
    reader.onload = ({ target }) => {
      const csv = Papa.parse(target.result, { header: true, dynamicTyping: true });

      const parsedData = csv?.data;
      const columns = Object.keys(parsedData[0]);
      setData(parsedData);

      const colors = [
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 99, 132, 0.5)",
        "rgba(75, 192, 192, 0.5)",
      ];

      // Extract unique years and months from the data
      const years = Array.from(new Set(parsedData.map((row) => row.year)));
      const months = Array.from(
        new Set(parsedData.map((row) => parseInt(row.month, 10)))
      ).sort((a, b) => a - b);

      // Extract unique "filiaal" values from the data
      const filiaalValues = Array.from(
        new Set(parsedData.map((row) => row.filiaal))
      ).filter((value) => value !== undefined);

            // Create datasets for each "filiaal" value (total products sold by year)
      const datasets = filiaalValues.map((filiaal, index) => {
        const productsSoldByYear = years.map((year) => {
          const filteredData = parsedData.filter(
            (row) => row.year === year && row.filiaal === filiaal
          );
          const totalQuantity = filteredData.reduce(
            (total, row) => total + parseInt(row.quantity, 10),
            0
          );
          return totalQuantity;
        });

        return {
          label: filiaal,
          data: productsSoldByYear,
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          borderRadius: 5,
          borderWidth: 1,
        };
      });

      // Create a chart using Chart.js or any other charting library of your choice
      // Here's an example using Chart.js
      const ctx = document.getElementById('chart').getContext('2d');
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      if (chartByMonthRef.current) {
        chartByMonthRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: years,
          datasets: datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Total Products Sold',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Year',
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Products Sold by Year",
              font: {
                size: 20, // Increase the font size for the title
              },
            },
          },
        },
      });

      // Add click event listener to the revenue by year chart
      ctx.canvas.onclick = (evt) => {
        const activePoints = chartRef.current.getElementsAtEventForMode(
          evt,
          "nearest",
          { intersect: true },
          true
        );

        if (activePoints.length > 0) {
          const yearIndex = activePoints[0].index;
          const selectedYear = years[yearIndex];

          const datasetsByMonth = filiaalValues.map((filiaal, index) => {
            const ByMonth = months.map((month) => {
              const filteredData = parsedData.filter(
                (row) =>
                  row.year === selectedYear &&
                  row.month === month &&
                  row.filiaal === filiaal
              );
              const totalQuantity = filteredData.reduce(
                (total, row) => total + parseInt(row.quantity, 10),
                0
              );
              return totalQuantity;
            });

            return {
              label: filiaal,
              data: ByMonth,
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length],
              borderRadius: 5,
              borderWidth: 1,
            };
          });

          // Create a new chart instance for revenue by month
          const ctxByMonth = document
            .getElementById("chartByMonth")
            .getContext("2d");
          if (chartByMonthRef.current) {
            chartByMonthRef.current.destroy();
          }
          chartByMonthRef.current = new Chart(ctxByMonth, {
            type: "bar",
            data: {
              labels: months.map((month) => monthNames[month - 1]),
              datasets: datasetsByMonth,
            },
            options: {
                responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                title: {
                  display: true,
                  text: `Products Sold by Month - ${selectedYear}`,
                  font: {
                    size: 20, // Increase the font size for the title
                  },
                },
                tooltips: {
                  position: "nearest", // Add this line to set the tooltip position
                  titleFont: {
                    size: 36, // Increase the font size for the tooltip title
                  },
                  bodyFont: {
                    size: 34, // Increase the font size for the tooltip body
                  },
                },
              },
            },
          });
        }
      };
    };
    // Read the file as text
    reader.readAsText(file);
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleProductKlantLand = () => {
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

    

    const countries = Array.from(new Set(parsedData.map((row) => row.retailer_country)));

    // Calculate the count of products made for each country
    const productCountByCountry = countries.map((country) => {
      const filteredData = parsedData.filter((row) => row.retailer_country === country);
      const productCount = filteredData.length;
      return productCount;
    });
  
    
   
    // Create a new chart instance
    const ctx = document.getElementById("chart").getContext("2d");
    if (chartRef.current) {
        chartRef.current.destroy();
      }
      if (chartByMonthRef.current) {
        chartByMonthRef.current.destroy();
      }

    chartRef.current = new Chart(ctx, {
        maxWidth: 50,
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
        responsive: true,
        scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Total Products Sold',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Country',
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Products Sold by Country",
              font: {
                size: 20, // Increase the font size for the title
              },
            },
          },
      },
    });

    ctx.canvas.onclick = (evt) => {}

    // Set the new chart instance to the state
  };
  reader.readAsText(file);

};

  return (
    <div className="dashboard">
      <label className="titel" htmlFor="csvInput" >
        TheGreatFusion - Dashboard
      </label>
      <div className="csv">
      <input onChange={handleFileChange} id="csvInput" name="file" type="file" />
      </div>
      
      <div className="mvButtons">
        <button onClick={handleRevenue}>Revenue</button>
        <button onClick={handleProductSold}>Products Sold</button>
        <button id="b3" onClick={handleProductKlantLand}>Products Sold by Country</button>
      </div>
      <div id="chartcontainer" style={{ marginTop: "0rem", display: "flex", justifyContent: "space-between" }}>
        {error ? (
          error
        ) : (
          <>
            <canvas className="canvas1" id="chart" style={{maxWidth: "45%" , maxHeight: "1200px", minHeight: "1200px" , margin: "10px"}}></canvas>
            {/* <canvas id="chartProductSoldYear" style={{ maxWidth: "45%", maxHeight: "1200px", minHeight: "1200px"}}></canvas> */}
            <canvas className="canvas2" id="chartByMonth" style={{maxWidth: "45%" , maxHeight: "1200px",minHeight: "1200px", margin: "10px" }}></canvas>
            
            
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
