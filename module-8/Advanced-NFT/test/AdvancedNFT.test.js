const { expect } = require('chai');
const { ethers } = require('hardhat');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

describe('AdvancedNFT', function () {
	let advancedNFT;
	let owner;
	let eligibleAddresses;
	let merkleTree;
	let merkleRoot;

	beforeEach(async function () {
		[owner, ...eligibleAddresses] = await ethers.getSigners();

		const leaves = eligibleAddresses.map((addr) => keccak256(addr.address));
		merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
		merkleRoot = merkleTree.getRoot();

		const AdvancedNFT = await ethers.getContractFactory('AdvancedNFT');
		advancedNFT = await AdvancedNFT.deploy(
			'AdvancedNFT',
			'ANFT',
			'0x' + merkleRoot.toString('hex'),
			owner.address
		);
		await advancedNFT.connect(owner).startPublicSale();
	});

	it('Should allow a valid address to mint an NFT', async function () {
		const leaf = keccak256(eligibleAddresses[0].address);
		const proof = merkleTree.getHexProof(leaf);

		await expect(
			advancedNFT.connect(eligibleAddresses[0]).mintWithMerkleProof(proof, 1)
		)
			.to.emit(advancedNFT, 'Transfer')
			.withArgs(ethers.constants.AddressZero, eligibleAddresses[0].address, 1);
	});

	it('Should not allow an invalid address to mint an NFT', async function () {
		const nonEligibleSigner = (await ethers.getSigners())[10];
		const invalidProof = [];

		try {
			await advancedNFT
				.connect(nonEligibleSigner)
				.mintWithMerkleProof(invalidProof, 1);
			expect.fail('Transaction should have failed');
		} catch (error) {
			expect(error.message).to.include('AdvancedNFT__InvalidMerkleProof');
		}
	});

	it('Should prevent an address from minting more than once', async function () {
		const leaf = keccak256(eligibleAddresses[0].address);
		const proof = merkleTree.getHexProof(leaf);

		await advancedNFT
			.connect(eligibleAddresses[0])
			.mintWithMerkleProof(proof, 1);

		try {
			await advancedNFT
				.connect(eligibleAddresses[0])
				.mintWithMerkleProof(proof, 1);
			expect.fail('Transaction should have failed');
		} catch (error) {
			expect(error.message).to.include('AdvancedNFT__TokenAlreadyMinted');
		}
	});

	it('Should record a commit', async function () {
		const secret = ethers.utils.id('123');
		const dataHash = ethers.utils.keccak256(secret);

		const currentBlockNumber = await ethers.provider.getBlockNumber();

		await expect(advancedNFT.connect(eligibleAddresses[0]).commit(dataHash))
			.to.emit(advancedNFT, 'CommitEvent')
			.withArgs(eligibleAddresses[0].address, dataHash, currentBlockNumber + 1);
	});

	it('Should successfully reveal a commit', async function () {
		const secret = ethers.utils.id('123');
		const dataHash = ethers.utils.keccak256(secret);

		await advancedNFT.connect(eligibleAddresses[0]).commit(dataHash);
		await ethers.provider.send('evm_mine', []);

		await expect(
			advancedNFT.connect(eligibleAddresses[0]).reveal(secret)
		).to.emit(advancedNFT, 'RevealEvent');
	});

	it('Should not allow reveal too early', async function () {
		const secret = ethers.utils.id('123');
		const dataHash = ethers.utils.keccak256(secret);

		await advancedNFT.connect(eligibleAddresses[0]).commit(dataHash);

		try {
			await advancedNFT.connect(eligibleAddresses[0]).reveal(secret);
			expect.fail('AdvancedNFT__RevealTooEarly');
		} catch (error) {
			expect(error.message).to.include('AdvancedNFT__RevealTooEarly');
		}
	});

	it('Should not allow reveal too late', async function () {
		const secret = ethers.utils.id('123');
		const dataHash = ethers.utils.keccak256(secret);

		await advancedNFT.connect(eligibleAddresses[0]).commit(dataHash);
		for (let i = 0; i < 251; i++) {
			await ethers.provider.send('evm_mine', []);
		}

		try {
			await advancedNFT.connect(eligibleAddresses[0]).reveal(secret);
			expect.fail('Transaction should have failed');
		} catch (error) {
			expect(error.message).to.include('AdvancedNFT__RevealTooLate');
		}
	});

	it('Should not allow reveal with incorrect data', async function () {
		const secret = ethers.utils.id('123');
		const incorrectSecret = ethers.utils.id('456');
		const dataHash = ethers.utils.keccak256(secret);

		await advancedNFT.connect(eligibleAddresses[0]).commit(dataHash);
		await ethers.provider.send('evm_mine', []);

		try {
			await advancedNFT.connect(eligibleAddresses[0]).reveal(incorrectSecret);
			expect.fail('Transaction should have failed');
		} catch (error) {
			expect(error.message).to.include('AdvancedNFT__InvalidReveal');
		}
	});

	it('Should execute multiple actions in a single transaction using multicall', async function () {
		const leaf = keccak256(eligibleAddresses[0].address);
		const proof = merkleTree.getHexProof(leaf);

		const mintCall1 = advancedNFT.interface.encodeFunctionData(
			'mintWithMerkleProof',
			[proof, 3]
		);
		const mintCall2 = advancedNFT.interface.encodeFunctionData(
			'mintWithMerkleProof',
			[proof, 4]
		);

		await advancedNFT
			.connect(eligibleAddresses[0])
			.multicall([mintCall1, mintCall2]);

		expect(await advancedNFT.ownerOf(3)).to.equal(eligibleAddresses[0].address);
		expect(await advancedNFT.ownerOf(4)).to.equal(eligibleAddresses[0].address);
	});

	it('Should only allow minting in the PublicSale state', async function () {
		await advancedNFT.connect(owner).endSale();

		const leaf = keccak256(eligibleAddresses[0].address);
		const proof = merkleTree.getHexProof(leaf);

		await expect(
			advancedNFT.connect(eligibleAddresses[0]).mintWithMerkleProof(proof, 5)
		).to.be.revertedWith('AdvancedNFT__NotInCorrectSaleState');

		await advancedNFT.connect(owner).startPublicSale();

		await expect(
			advancedNFT.connect(eligibleAddresses[0]).mintWithMerkleProof(proof, 5)
		)
			.to.emit(advancedNFT, 'Transfer')
			.withArgs(ethers.constants.AddressZero, eligibleAddresses[0].address, 5);
	});

	it('Should not allow minting in the SoldOut state', async function () {
		await advancedNFT.connect(owner).endSale();

		const leaf = keccak256(eligibleAddresses[1].address);
		const proof = merkleTree.getHexProof(leaf);

		await expect(
			advancedNFT.connect(eligibleAddresses[1]).mintWithMerkleProof(proof, 6)
		).to.be.revertedWith('AdvancedNFT__NotInCorrectSaleState');
	});

	it('Should allow the owner to withdraw funds to multiple recipients', async function () {
		// Define the transaction object to send Ether to the contract
		const transaction = {
			to: advancedNFT.address,
			value: ethers.utils.parseEther('3'), // Amount of Ether to send
		};

		// Send Ether to the contract
		await owner.sendTransaction(transaction);

		// Define recipients and amounts for withdrawal
		const recipients = [
			eligibleAddresses[1].address,
			eligibleAddresses[2].address,
		];
		const amounts = [
			ethers.utils.parseEther('1'),
			ethers.utils.parseEther('1'),
		];

		// Call the withdraw function
		await advancedNFT.connect(owner).withdrawFunds(recipients, amounts);

		// Verify the balances of the recipients
		const balance1 = await ethers.provider.getBalance(recipients[0]);
		const balance2 = await ethers.provider.getBalance(recipients[1]);

		// Add assertions to check if the balances are as expected
		expect(balance1).to.be.above(ethers.utils.parseEther('1'));
		expect(balance2).to.be.above(ethers.utils.parseEther('1'));
	});
});
