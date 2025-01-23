const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");

describe("ERC20Modified Contract", function () {
  let PartialRefund, partialRefund, owner, addr1, addr2;

  beforeEach(async function () {
    PartialRefund = await ethers.getContractFactory("MyToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    partialRefund = await PartialRefund.deploy(1000);
  });

  describe("Deployment", function () {
    it("Should deploy the contract", async function () {
      expect(partialRefund.address).to.exist;
    });

    it("Should set the right owner", async function () {
      expect(await partialRefund.owner()).to.equal(owner.address);
    });

    it("Should assign the initial supply of tokens to the owner", async function () {
      const ownerBalance = await partialRefund.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.utils.parseEther("10000"));
    });

    it("Should have correct token name and symbol", async function () {
      expect(await partialRefund.name()).to.equal("MyToken");
      expect(await partialRefund.symbol()).to.equal("RsUW");
    });
  });

  describe("Minting Tokens", function () {
    it("Should mint 1000 tokens for 1 Ether", async function () {
      // Mint tokens by sending 1 Ether
      await partialRefund
        .connect(owner)
        .buy({ value: ethers.utils.parseEther("1") });

      const balance = await partialRefund.balanceOf(owner.address);
      expect(balance).to.equal(ethers.utils.parseEther("11000")); // 10,000 initial + 1,000 from minting
    });

    it("Should not allow minting with less than 1 Ether", async function () {
      // Try to mint tokens with less than 1 Ether
      await expect(
        partialRefund
          .connect(addr1)
          .buy({ value: ethers.utils.parseEther("0.5") })
      ).to.be.revertedWith("PartialRefund__IncorrectMintingPrice");
    });

    it("should not allow minting tokens that exceed MAX_SUPPLY", async function () {
      // Minting almost to the max supply, leaving only 10 tokens space
      await partialRefund.adminMint(
        owner.address,
        ethers.utils.parseEther("989990")
      );

      const newBalance = await partialRefund.balanceOf(owner.address);
      expect(newBalance).to.equal(ethers.utils.parseEther("999990")); // Check the balance is 999,990

      // Mint 10 more tokens to reach MAX_SUPPLY
      await partialRefund
        .connect(owner)
        .buy({ value: ethers.utils.parseEther("1") });

      const finalBalance = await partialRefund.balanceOf(owner.address);
      expect(finalBalance).to.equal(ethers.utils.parseEther("1000000")); // Check the balance is 1,000,000

      // Try to mint more tokens again, which should be rejected
      await expect(
        partialRefund
          .connect(owner)
          .buy({ value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("PartialRefund__SaleHasEnded");
    });

    it("Should not allow minting with more than 1 Ether", async function () {
      await expect(
        partialRefund
          .connect(addr1)
          .buy({ value: ethers.utils.parseEther("1.5") })
      ).to.be.revertedWith("PartialRefund__IncorrectMintingPrice");
    });
  });
});
