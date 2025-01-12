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
      // try {
      //   const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      //   const response = await axios.get(`${baseUrl}/getVaccinationData`);
      //   const data = response.data;
      //   const vaccineCounts = {};
      //   data.forEach((item) => {
      //     const { vaccine_name, vaccinaction_id, date_administered } = item;
      //     if (!vaccine_name) return;
      //     if (date_administered === "0000-00-00" || !date_administered) {
      //       vaccineCounts[vaccine_name] = vaccineCounts[vaccine_name] || 0;
      //     } else if (vaccinaction_id) {
      //       vaccineCounts[vaccine_name] =
      //         (vaccineCounts[vaccine_name] || 0) + 1;
      //     }
      //   });
      //   const predefinedColors = [
      //     "#5DADE2",
      //     "#F5B041",
      //     "#C0392B",
      //     "#28B463",
      //     "#E67E22",
      //     "#AF7AC5",
      //     "#48C9B0",
      //     "#F1948A",
      //     "#BB8FCE",
      //   ];
      //   const numberOfVaccines = Object.keys(vaccineCounts).length;
      //   const generateColor = (index) => {
      //     const hue = (index * 137.5) % 360;
      //     return `hsl(${hue}, 70%, 50%)`;
      //   };
      //   const colors = Array.from(
      //     { length: numberOfVaccines },
      //     (_, index) => predefinedColors[index] || generateColor(index)
      //   );
      //   setChartData({
      //     x: Object.values(vaccineCounts),
      //     y: Object.keys(vaccineCounts),
      //     colors,
      //   });
      // } catch (error) {
      //   console.error("Error fetching vaccination data:", error);
      // }
      // try {
      //   const response = await axios.get(
      //     `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/getVaccinationData`
      //   );
      //   const data = response.data;
      //   // Count the number of doses administered for each child and vaccine
      //   const doseCounts = data.reduce((acc, item) => {
      //     if (!item.child_id || !item.vaccine_id) return acc;
      //     const key = `${item.child_id}-${item.vaccine_id}`;
      //     if (!acc[key]) {
      //       acc[key] = 0;
      //     }
      //     acc[key] += 1;
      //     return acc;
      //   }, {});
      //   // Filter out incomplete vaccinations
      //   const completedVaccinations = data.filter((item) => {
      //     if (!item.child_id || !item.vaccine_id) return false;
      //     const key = `${item.child_id}-${item.vaccine_id}`;
      //     const dosesRequired = item.doses_required;
      //     return doseCounts[key] >= dosesRequired;
      //   });
      //   // Count the number of completed vaccinations for each vaccine
      //   const vaccineCounts = completedVaccinations.reduce((acc, item) => {
      //     if (!item.vaccine_name) return acc;
      //     if (!acc[item.vaccine_name]) {
      //       acc[item.vaccine_name] = 0;
      //     }
      //     acc[item.vaccine_name] += 1;
      //     return acc;
      //   }, {});
      //   const predefinedColors = [
      //     "#5DADE2",
      //     "#F5B041",
      //     "#C0392B",
      //     "#28B463",
      //     "#E67E22",
      //     "#AF7AC5",
      //     "#48C9B0",
      //     "#F1948A",
      //     "#BB8FCE",
      //   ];
      //   const numberOfVaccines = Object.keys(vaccineCounts).length;
      //   const generateColor = (index) => {
      //     const hue = (index * 137.5) % 360;
      //     return `hsl(${hue}, 70%, 50%)`;
      //   };
      //   const colors = Array.from(
      //     { length: numberOfVaccines },
      //     (_, index) => predefinedColors[index] || generateColor(index)
      //   );
      //   setChartData({
      //     x: Object.values(vaccineCounts),
      //     y: Object.keys(vaccineCounts),
      //     colors,
      //   });
      // } catch (error) {
      //   console.error("Error fetching vaccination data:", error);
      // }

      // best

      // try {
      //   const response = await axios.get(
      //     `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/getVaccinationData`
      //   );
      //   const data = response.data;
      //   // Count the number of doses administered for each child and vaccine
      //   const doseCounts = data.reduce((acc, item) => {
      //     if (!item.child_id || !item.vaccine_id) return acc;
      //     const key = `${item.child_id}-${item.vaccine_id}`;
      //     if (!acc[key]) {
      //       acc[key] = 0;
      //     }
      //     acc[key] += 1;
      //     return acc;
      //   }, {});
      //   // Filter out incomplete vaccinations and ensure no extra doses are counted
      //   const completedVaccinations = data.filter((item) => {
      //     if (!item.child_id || !item.vaccine_id) return false;
      //     const key = `${item.child_id}-${item.vaccine_id}`;
      //     const dosesRequired = item.doses_required;
      //     return doseCounts[key] >= dosesRequired;
      //   });
      //   // Ensure each child is counted only once per vaccine
      //   const uniqueVaccinations = completedVaccinations.reduce((acc, item) => {
      //     const key = `${item.child_id}-${item.vaccine_id}`;
      //     if (!acc[key]) {
      //       acc[key] = item;
      //     }
      //     return acc;
      //   }, {});
      //   // Count the number of completed vaccinations for each vaccine
      //   const vaccineCounts = Object.values(uniqueVaccinations).reduce(
      //     (acc, item) => {
      //       if (!item.vaccine_name) return acc;
      //       if (!acc[item.vaccine_name]) {
      //         acc[item.vaccine_name] = 0;
      //       }
      //       acc[item.vaccine_name] += 1;
      //       return acc;
      //     },
      //     {}
      //   );
      //   const predefinedColors = [
      //     "#5DADE2",
      //     "#F5B041",
      //     "#C0392B",
      //     "#28B463",
      //     "#E67E22",
      //     "#AF7AC5",
      //     "#48C9B0",
      //     "#F1948A",
      //     "#BB8FCE",
      //   ];
      //   const numberOfVaccines = Object.keys(vaccineCounts).length;
      //   const generateColor = (index) => {
      //     const hue = (index * 137.5) % 360;
      //     return `hsl(${hue}, 70%, 50%)`;
      //   };
      //   const colors = Array.from(
      //     { length: numberOfVaccines },
      //     (_, index) => predefinedColors[index] || generateColor(index)
      //   );
      //   setChartData({
      //     x: Object.values(vaccineCounts),
      //     y: Object.keys(vaccineCounts),
      //     colors,
      //   });
      // } catch (error) {
      //   console.error("Error fetching vaccination data:", error);
      // }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/getVaccinationData`
        );
        const data = response.data;

        // Initialize vaccine counts with all vaccines
        const vaccineCounts = data.reduce((acc, item) => {
          if (!item.vaccine_name) return acc;
          if (!acc[item.vaccine_name]) {
            acc[item.vaccine_name] = 0;
          }
          return acc;
        }, {});

        // Count the number of doses administered for each child and vaccine
        const doseCounts = data.reduce((acc, item) => {
          if (!item.child_id || !item.vaccine_id) return acc;
          const key = `${item.child_id}-${item.vaccine_id}`;
          if (!acc[key]) {
            acc[key] = 0;
          }
          acc[key] += 1;
          return acc;
        }, {});

        // Filter out incomplete vaccinations and ensure no extra doses are counted
        const completedVaccinations = data.filter((item) => {
          if (!item.child_id || !item.vaccine_id) return false;
          const key = `${item.child_id}-${item.vaccine_id}`;
          const dosesRequired = item.doses_required;
          return doseCounts[key] >= dosesRequired;
        });

        // Ensure each child is counted only once per vaccine
        const uniqueVaccinations = completedVaccinations.reduce((acc, item) => {
          const key = `${item.child_id}-${item.vaccine_id}`;
          if (!acc[key]) {
            acc[key] = item;
          }
          return acc;
        }, {});

        // Update the counts for completed vaccinations
        Object.values(uniqueVaccinations).forEach((item) => {
          if (item.vaccine_name) {
            vaccineCounts[item.vaccine_name] += 1;
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
