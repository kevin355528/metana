import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import alchemy from '../../utils/alchemy'; // Adjust the path according to your project structure

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function BaseFeeChart() {
	const [baseFees, setBaseFees] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			let fees = [];
			const latestBlock = await alchemy.core.getBlockNumber();
			for (let i = 0; i < 10; i++) {
				const block = await alchemy.core.getBlock(latestBlock - i);
				fees.push(block.baseFeePerGas);
			}
			setBaseFees(fees.reverse()); // we reverse to get oldest to newest
		};

		fetchData();
	}, []);

	const chartOptions = {
		chart: {
			type: 'line',
		},
		xaxis: {
			categories: Array.from({ length: 10 }, (_, i) => `Block ${i + 1}`),
		},
		yaxis: {
			title: {
				text: 'Base Fee',
			},
		},
		colors: ['#FF4560'],
	};

	return (
		<Chart
			options={chartOptions}
			series={[{ name: 'Base Fee', data: baseFees }]}
			type="line"
		/>
	);
}
