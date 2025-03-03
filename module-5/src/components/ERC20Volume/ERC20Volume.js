import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import alchemy from "../../utils/alchemy";

const USDC_CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ERC20Volume = () => {
  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getLast10BlocksTransfers = async () => {
    let fetchedBlocks = new Set();
    let fetchedTransfers = [];
    let pageKey;

    while (fetchedBlocks.size < 10) {
      const response = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        contractAddresses: [USDC_CONTRACT_ADDRESS],
        excludeZeroValue: true,
        category: ["erc20"],
        maxCount: "0x3e8",
        pageKey,
      });

      fetchedTransfers = [...fetchedTransfers, ...response.transfers];
      response.transfers.forEach((t) => fetchedBlocks.add(t.blockNum));
      pageKey = response.pageKey;

      if (!pageKey) break;
    }

    const last10Blocks = Array.from(fetchedBlocks).slice(-10);
    const transfersInLast10Blocks = fetchedTransfers.filter((t) =>
      last10Blocks.includes(t.blockNum)
    );
    const aggregatedTransfers = last10Blocks.map((blockNum) => ({
      blockNum,
      value: transfersInLast10Blocks
        .filter((t) => t.blockNum === blockNum)
        .reduce((acc, curr) => acc + parseFloat(curr.value), 0),
    }));

    return aggregatedTransfers;
  };

  useEffect(() => {
    (async () => {
      try {
        const fetchedTransfers = await getLast10BlocksTransfers();
        setTransfers(fetchedTransfers);
      } catch (error) {
        console.error("Error fetching USDCtransfers:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const options = {
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false,
      },
    },
    colors: ["#9F7AEA"],
    xaxis: {
      categories: transfers.map((t) => t.blockNum),
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      type: "logarithmic",
      labels: {
        style: {
          fontSize: "12px",
        },
        formatter: (value) => {
          if (value >= 1000000) return `${value / 1000000}M`;
          if (value >= 1000) return `${value / 1000}K`;
          return value;
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "10px", // Adjust this value to fit your preference
      },
    },

    tooltip: {
      y: {
        formatter: (value) => `${value}`,
      },
    },
  };

  const series = [
    {
      name: "USDC Transfers",
      data: transfers.map((t) => t.value),
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-4 shadow-md bg-white rounded">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Chart
            options={options}
            series={series}
            type="bar"
            width="100%"
            height="400"
          />
        )}
      </div>
    </div>
  );
};

export default ERC20Volume;
