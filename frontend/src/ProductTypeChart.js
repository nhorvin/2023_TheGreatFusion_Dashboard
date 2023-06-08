import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';

const ProductTypeChart = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [csvData, setCsvData] = useState(null);
    
    // ---------------- Upload CSV file ----------------
    const handleFileUpload = () => {
        if (csvData) {
          Papa.parse(csvData, {
            header: true,
            complete: function (results) {
              const data = results.data;
              const chartData = {};
              const labels = [];
              const counts = {};
      
              data.forEach(entry => {
                const year = entry['Year'];
                const category = entry['prod_category'];
      
                // Voeg het jaar toe aan de labels-array als het nog niet bestaat
                if (!labels.includes(year)) {
                  labels.push(year);
                }
      
                // Verhoog de telling voor de categorie in het betreffende jaar
                if (!counts[year]) {
                  counts[year] = {};
                }
                if (!counts[year][category]) {
                  counts[year][category] = 0;
                }
                counts[year][category]++;
              });
      
              // Maak datasets voor elke categorie
              const datasets = Object.keys(counts).map(category => {
                const data = labels.map(year => counts[year][category] || 0);
                return {
                  label: category,
                  data: data,
                };
              });
      
              chartData.labels = labels;
              chartData.datasets = datasets;
      
              setChartData(chartData);
            },
          });
        }
      };
    
    // ---------------- Handle files ----------------  
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        if (file) {
          const reader = new FileReader();
          
          reader.onload = function (e) {
            setCsvData(e.target.result);
          };
          
          reader.readAsText(file);
        }
    };

    // ---------------- Return as HTML items ----------------  
    return (
    <div className="producttype">
    <h1>Grafiek</h1>
      <div className="chart-producttype">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Grafiek genereren</button>
        {chartData.labels && (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
      );
    
};

export default ProductTypeChart;