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
              // Verwerk de gegevens hier volgens je behoeften
              // Bijvoorbeeld, zet de gegevens om naar het juiste formaat voor Chart.js
              
              // Voorbeeld van gegevensverwerking:
              const chartLabels = results.data.map(entry => entry.label);
              const chartValues = results.data.map(entry => entry.value);
              
              setChartData({
                labels: chartLabels,
                datasets: [
                  {
                    label: 'Data',
                    data: chartValues,
                  },
                ],
              });
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

    
    
};