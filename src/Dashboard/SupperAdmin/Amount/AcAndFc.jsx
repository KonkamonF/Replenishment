import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Pie, Bar, Doughnut } from "react-chartjs-2";

export default function AcAndFc() {
  return (
    <>
      <div className="text-[#640037] w-[25%] mx-auto text-3xl font-bold">
        Actual เทียบ Forecast
        <Doughnut
          data={{
            labels: ["Actual", "Forecast"],
            datasets: [
              {
                label: "Actual เทียบ Forecast",
                data: [5000, 7000], //Mapping Data and Labels https://www.youtube.com/watch?v=6q5d3Z1-5kQ
                backgroundColor: ["#3282B8", "#790252"],
                borderRadius: 10,
              },
            ],
          }}
        />
      </div>
    </>
  );
}
