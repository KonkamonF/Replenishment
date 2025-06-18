import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Pie, Bar, Doughnut } from "react-chartjs-2";

export default function AcAndFc() {
  return (
    <>
      <div className="text-black w-[20%] mx-auto">
        Actual เทียบ Forecast
        <Doughnut
          data={{
            labels: ["Actual", "Forecast"],
            datasets: [
              {
                label: "Actual เทียบ Forecast",
                data: [5000, 7000],
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
