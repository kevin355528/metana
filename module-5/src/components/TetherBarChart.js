import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useTetherBarChart } from '@/hooks/useTetherBarChart';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
);

export default function TetherBarChart() {
  const { data } = useTetherBarChart();
  const [barData, setBarData] = useState(updateBarData());

  const options = {
    indexAxis: "y",
    scales: {
      x: {
        title: {
          display: true,
          text: "Total Transaction Amount",
        },
      },
      y: {
        title: {
          display: true,
          text: "Block Number",
        },
      },
    },
  };

  function updateBarData(newData = []) {
    const labels = newData.length === 0 ? [] : newData.map((d) => d.blockNum);
    const yData =
      newData.length === 0 ? [] : newData.map((d) => d.transactionSum);

    return {
      labels,
      datasets: [
        {
          axis: "y",
          label: "Tether Transactions By Block",
          data: yData,
          fill: true,
          backgroundColor: ["#E74C3C"],
        },
      ],
    };
  }

  useEffect(() => {
    setBarData(updateBarData(data));
  }, [data]);

  return <Bar options={options} data={barData} />;
}
