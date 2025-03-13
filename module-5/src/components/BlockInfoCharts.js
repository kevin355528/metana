import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useBlock } from '@/hooks/useBlock';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from "chart.js";
import styles from "../styles/Home.module.css";

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
);

export default function BlockInfoCharts() {
  const { data } = useBlock();
  const [baseFeeData, setBaseFeeData] = useState(updateBaseFeeData());
  const [gasRatioData, setGasRatioData] = useState(updateGasRatioData());

  // Chart Axis Y Labels
  const baseFeeYLabel = "Base Fee (Gwei)";
  const gasRatioYLabel = "GasUsed to GasLimit %";

  function createOptions(yLabel) {
    return {
      scales: {
        x: {
          title: {
            display: true,
            text: "Block Number",
          },
        },
        y: {
          title: {
            display: true,
            text: yLabel,
          },
        },
      },
    };
  }

  function updateBaseFeeData(newData = []) {
    const chartTitle = "Base Fee (Gwei) By Block";
    const barColor = "#2ECC71";
    const labels = newData.length === 0 ? 
      [] : newData.map((d) => d.number);
    const xData = newData.length === 0 ? 
      [] : newData.map((d) => Number(d.baseFeePerGas) / Math.pow(10, 9));

      return _updateBarData(chartTitle, barColor, labels, xData)
  }

  function updateGasRatioData(newData = []) {
    const chartTitle = "GasUsed to GasLimit % By Block";
    const barColor = "#3498DB";
    const labels = newData.length === 0 ? 
      [] : newData.map((d) => d.number);
    const xData = newData.length === 0 ? 
      [] : newData.map((d) =>  (Number(d.gasUsed / d.gasLimit) * 100).toFixed(2));

      return _updateBarData(chartTitle, barColor, labels, xData)
  }

  function _updateBarData(title, barColor, labels, xData) {
    return {
      labels,
      datasets: [
        {
          axis: "x",
          label: title,
          data: xData,
          fill: true,
          backgroundColor: [barColor],
        },
      ],
    };
  }

  useEffect(() => {
    setBaseFeeData(updateBaseFeeData(data));
    setGasRatioData(updateGasRatioData(data));
  }, [data]);

  return (<div className={styles.blockInfoContainer}>
    <Bar options={createOptions(baseFeeYLabel)} data={baseFeeData} />
    <Bar options={createOptions(gasRatioYLabel)} data={gasRatioData} />
  </div>);
}
