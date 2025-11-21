import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export function SummaryMetrics({ grandTotals, dataAC }) {
  const totalAC = Array.isArray(dataAC)
    ? dataAC.reduce((sum, item) => sum + (Number(item.AC) || 0), 0)
    : 0;

  const totalFC = grandTotals?.Total || 0;
  const totalSum = totalFC + totalAC;

  // เตรียมข้อมูลสำหรับ Pie Chart
  const chartData = {
    labels: [
      `Total FC (${totalFC.toLocaleString()})`,
      `Total AC (${totalAC.toLocaleString()})`,
    ],
    datasets: [
      {
        data: [totalFC, totalAC],
        backgroundColor: [
          "rgba(244, 63, 94, 0.7)", // Pink/Red for FC
          "rgba(59, 130, 246, 0.7)", // Blue for AC
        ],
        borderColor: ["rgba(244, 63, 94, 1)", "rgba(59, 130, 246, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
            boxWidth: 10,
            padding: 10
        }
      },
      title: {
          display: true,
          text: `Grand Total (FC + AC): ${totalSum.toLocaleString()} unit`,
          font: {
              size: 14,
              weight: 'bold'
          }
      }
    },
  };

  return (
    <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 shadow-lg w-full">
      <h3 className="text-center text-xl font-bold text-pink-800 mb-4 border-b pb-2">
        FC vs AC Comparison
      </h3>
      <div className="flex justify-center">
        <div className="w-64 h-64">
          <Pie
            options={options}
            data={chartData}
          />
        </div>
      </div>
    </div>
  );
}
