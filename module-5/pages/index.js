import Head from 'next/head';
import ERC20Volume from '../src/components/ERC20Volume/ERC20Volume';
import BaseFee from '../src/components/BaseFee/BaseFee';
import GasRatio from '../src/components/GasRatio/GasRatio';

export default function Home() {
	return (
		<div className="container mx-auto p-4">
			<Head>
				<title>Alchemy Charts</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="my-4">
				<h1 className="text-2xl font-bold mb-4">Alchemy Charts</h1>

				<div className="my-4">
					<ERC20Volume />
				</div>

				<div className="my-4">
					<BaseFee />
				</div>

				<div className="my-4">
					<GasRatio />
				</div>
			</main>
		</div>
	);
}
