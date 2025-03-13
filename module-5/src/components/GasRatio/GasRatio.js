import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import alchemy from '../../utils/alchemy';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const GasRatioChart = () => {
	const [series, setSeries] = useState([]);
	const [labels, setLabels] = useState([]);

	useEffect(() => {
		const fetchBlockData = async () => {
			const currentBlock = await alchemy.core.getBlockNumber();
			const blockPromises = [];

			for (let i = 0; i < 10; i++) {
				blockPromises.push(alchemy.core.getBlock(currentBlock - i));
			}

			const blocks = await Promise.all(blockPromises);
			const gasRatios = blocks.map((block) =>
				parseFloat(((block.gasUsed / block.gasLimit) * 100).toFixed(2))
			);
			const blockLabels = blocks.map((block) => block.number);

			setSeries([{ data: gasRatios }]);
			setLabels(blockLabels);
		};

		fetchBlockData();
	}, []);

	const options = {
		chart: {
			type: 'bar',
			height: 350,
		},
		title: {
			text: 'Gas Ratio (%) of Last 10 Blocks',
			style: {
				fontSize: '16px',
				fontWeight: 'bold',
			},
		},
		xaxis: {
			categories: labels,
			labels: {
				style: {
					fontSize: '14px',
				},
			},
		},
		yaxis: {
			min: 0,
			max: 100,
			labels: {
				style: {
					fontSize: '12px',
				},
			},
		},
		plotOptions: {
			bar: {
				dataLabels: {
					position: 'top',
				},
			},
		},
		dataLabels: {
			enabled: true,
			formatter: function (val) {
				return val + '%';
			},
			offsetY: -20,
			style: {
				fontSize: '12px',
				colors: ['#304758'],
			},
		},
	};

	return <Chart options={options} series={series} type="bar" height={350} />;
};

export default GasRatioChart;
