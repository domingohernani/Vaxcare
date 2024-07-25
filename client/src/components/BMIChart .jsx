import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const BMIChart = () => {
  const [data, setData] = useState([]);
  const [layout, setLayout] = useState({});
  const [underweight, setUnderweight] = useState(0);
  const [normal, setNormal] = useState(0);
  const [overweight, setOverweight] = useState(0);
  const [obese, setObese] = useState(0);

  useEffect(() => {
    const fetchBmi = async () => {
      try {
        const response = await axios.get("http://localhost:8800/getBmi");
        const bmiData = response.data;

        // Reset state variables
        setUnderweight(0);
        setNormal(0);
        setOverweight(0);
        setObese(0);

        bmiData.forEach((element) => {
          switch (element.bmi_category) {
            case "Underweight":
              setUnderweight((prevCount) => prevCount + 1);
              break;
            case "Normal":
              setNormal((prevCount) => prevCount + 1);
              break;
            case "Overweight":
              setOverweight((prevCount) => prevCount + 1);
              break;
            case "Obese":
              setObese((prevCount) => prevCount + 1);
              break;
            default:
              break;
          }
        });

        const xArray = ["Underweight", "Normal", "Overweight", "Obese"];
        const yArray = [underweight, normal, overweight, obese];

        const chartData = [
          {
            x: xArray,
            y: yArray,
            type: "bar",
            marker: {
              color: [
                "rgb(59 130 246)",
                "rgb(254 240 138)",
                "rgb(248 113 113)",
                "#183A37",
              ],
            },
          },
        ];

        const chartLayout = {
          title: {
            text: "BMI Tracking Bar Graph",
            font: {
              // family: "Inter, sans-serif",
              // family: 'Syne', sans-serif;
              // family: "Poppins", sans-serif;
              // family: 'Montserrat, sans-serif',
              // family: 'Be Vietnam Pro', sans-serif;
              // family: "Poppins, sans-serif",
              family: "Be Vietnam Pro, sans-serif",
              size: "16",
              color: "black",
            },
          },
        };

        setData(chartData);
        setLayout(chartLayout);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBmi();
  }, [underweight, normal, overweight, obese]); // Include state variables in the dependency array

  return (
    <div className="rounded-md">
      <Plot
        data={data}
        layout={layout}
        config={{
          responsive: true,
          displayModeBar: false,
        }}
        style={{ width: "95%", maxWidth: "100%" }}
      />
    </div>
  );
};

export default BMIChart;
