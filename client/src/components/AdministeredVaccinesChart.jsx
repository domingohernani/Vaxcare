import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const AdministeredVaccinesChart = () => {
  const [chartData, setChartData] = useState({
    x: [],
    y: [],
    colors: [],
  });

  useEffect(() => {
    const fetchVaccinationData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        const response = await axios.get(`${baseUrl}/getVaccinationData`);
        const data = response.data;

        const vaccineCounts = {};

        data.forEach((item) => {
          const { vaccine_name, vaccinaction_id, date_administered } = item;

          if (!vaccine_name) return;
          if (date_administered === "0000-00-00" || !date_administered) {
            vaccineCounts[vaccine_name] = vaccineCounts[vaccine_name] || 0;
          } else if (vaccinaction_id) {
            vaccineCounts[vaccine_name] =
              (vaccineCounts[vaccine_name] || 0) + 1;
          }
        });

        const predefinedColors = [
          "#5DADE2",
          "#F5B041",
          "#C0392B",
          "#28B463",
          "#E67E22",
          "#AF7AC5",
          "#48C9B0",
          "#F1948A",
          "#BB8FCE",
        ];
        const numberOfVaccines = Object.keys(vaccineCounts).length;

        const generateColor = (index) => {
          const hue = (index * 137.5) % 360;
          return `hsl(${hue}, 70%, 50%)`;
        };

        const colors = Array.from(
          { length: numberOfVaccines },
          (_, index) => predefinedColors[index] || generateColor(index)
        );

        setChartData({
          x: Object.values(vaccineCounts),
          y: Object.keys(vaccineCounts),
          colors,
        });
      } catch (error) {
        console.error("Error fetching vaccination data:", error);
      }
    };

    fetchVaccinationData();
  }, []);

  return (
    <Plot
      data={[
        {
          type: "bar",
          x: chartData.x,
          y: chartData.y,
          orientation: "h",
          marker: {
            color: chartData.colors,
          },
        },
      ]}
      layout={{
        title: {
          text: "Number of Administered Vaccines",
          font: {
            family: "Be Vietnam Pro, sans-serif",
            size: 16,
            color: "black",
          },
        },
        xaxis: {
          title: "Number of Doses",
          showticklabels: true,
          automargin: true,
          tickmode: "linear",
          dtick: 1,
        },
        yaxis: {
          showticklabels: true,
        },
        paper_bgcolor: "white",
        plot_bgcolor: "white",
        autosize: true,
        margin: { l: 150, r: 50, t: 100, b: 80 },
      }}
      config={{
        responsive: true,
        displayModeBar: false,
        staticPlot: true,
      }}
      style={{ width: "100%", backgroundColor: "white" }}
    />
  );
};

export default AdministeredVaccinesChart;
