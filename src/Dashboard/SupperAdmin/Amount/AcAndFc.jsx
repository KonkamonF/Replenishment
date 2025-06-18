import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Pie } from "react-chartjs-2";

export default function AcAndFc() {
  return (
    <>
      <div className="text-black w-[20%]">
        Actual เทียบ Forecast
        <Pie
          data={{
            labels: ["A", "B"],
            datasets: [{ label: "Actual เทียบ Forecast", data: [5000, 2500] }],
          }}
        />
      </div>
    </>
  );
}
