const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("erc1155", function () {
  let erc1155, Erc1155, owner, addr1, addr2, MINTER_ROLE;

  beforeEach(async function () {
    erc1155 = await ethers.getContractFactory("erc1155");
    [owner, addr1, addr2] = await ethers.getSigners();
    Erc1155 = await erc1155.deploy();
    MINTER_ROLE = await Erc1155.MINTER_ROLE();
  });

  describe("Minting", function () {
    it("Should allow anyone to mint token 0", async function () {
      await Erc1155.connect(addr1).mint(addr1.address, 0, 1);
      const balance = await Erc1155.balanceOf(addr1.address, 0);
      expect(balance).to.equal(1);
    });

    it("Should allow anyone to mint token 1", async function () {
      await Erc1155.connect(addr1).mint(addr1.address, 1, 1);
      const balance = await Erc1155.balanceOf(addr1.address, 1);
      expect(balance).to.equal(1);
    });

    it("Should allow anyone to mint token 2", async function () {
      await Erc1155.connect(addr1).mint(addr1.address, 2, 1);
      const balance = await Erc1155.balanceOf(addr1.address, 2);
      expect(balance).to.equal(1);
    });

    it("Should enforce a 1-minute cooldown between mints for token 0", async function () {
      await Erc1155.connect(addr1).mint(addr1.address, 0, 1);
      await expect(
        Erc1155.connect(addr1).mint(addr1.address, 0, 1)
      ).to.be.revertedWith("ERC1155__CooldownNotElapsed");
    });

    it("Should enforce a 1-minute cooldown between mints for token 1", async function () {
      await Erc1155.connect(addr1).mint(addr1.address, 1, 1);
      await expect(
        Erc1155.connect(addr1).mint(addr1.address, 1, 1)
      ).to.be.revertedWith("ERC1155__CooldownNotElapsed");
    });

    it("Should enforce a 1-minute cooldown between mints for token 2", async function () {
      await Erc1155.connect(addr1).mint(addr1.address, 2, 1);
      await expect(
        Erc1155.connect(addr1).mint(addr1.address, 2, 1)
      ).to.be.revertedWith("ERC1155__CooldownNotElapsed");
    });

    it("Should not allow minting token 3 by non-forging contract", async function () {
      await expect(
        Erc1155.connect(addr1).mint(addr1.address, 3, 1)
      ).to.be.revertedWith("ERC1155__NotAMinter");
    });

    it("Should not allow minting token 4 by non-forging contract", async function () {
      await expect(
        Erc1155.connect(addr1).mint(addr1.address, 4, 1)
      ).to.be.revertedWith("ERC1155__NotAMinter");
    });

    it("Should not allow minting token 5 by non-forging contract", async function () {
      await expect(
        Erc1155.connect(addr1).mint(addr1.address, 5, 1)
      ).to.be.revertedWith("ERC1155__NotAMinter");
    });

    it("Should not allow minting token 6 by non-forging contract", async function () {
      await expect(
        Erc1155.connect(addr1).mint(addr1.address, 6, 1)
      ).to.be.revertedWith("ERC1155__NotAMinter");
    });
  });

  describe("Trading", function () {
    beforeEach(async function () {
      // Giving the MINTER_ROLE to owner to mint tokens [3-6]
      await Erc1155.grantRole(Erc1155.MINTER_ROLE(), owner.address);
    });

    it("Should allow trading token 3 for token 0", async function () {
      await Erc1155.connect(owner).mint(owner.address, 3, 10);
      await Erc1155.connect(owner).tradeToken(3, 0, 5);
      const balanceToken3 = await Erc1155.balanceOf(owner.address, 3);
      const balanceToken0 = await Erc1155.balanceOf(owner.address, 0);
      expect(balanceToken3).to.equal(5);
      expect(balanceToken0).to.equal(5);
    });

    it("Should allow trading token 3 for token 1", async function () {
      await Erc1155.connect(owner).mint(owner.address, 3, 10);
      await Erc1155.connect(owner).tradeToken(3, 1, 5);
      const balanceToken3 = await Erc1155.balanceOf(owner.address, 3);
      const balanceToken1 = await Erc1155.balanceOf(owner.address, 1);
      expect(balanceToken3).to.equal(5);
      expect(balanceToken1).to.equal(5);
    });

    it("Should allow trading token 3 for token 2", async function () {
      await Erc1155.connect(owner).mint(owner.address, 3, 10);
      await Erc1155.connect(owner).tradeToken(3, 2, 5);
      const balanceToken3 = await Erc1155.balanceOf(owner.address, 3);
      const balanceToken2 = await Erc1155.balanceOf(owner.address, 2);
      expect(balanceToken3).to.equal(5);
      expect(balanceToken2).to.equal(5);
    });

    it("Should allow trading token 4 for token 0", async function () {
      await Erc1155.connect(owner).mint(owner.address, 4, 10);
      await Erc1155.connect(owner).tradeToken(4, 0, 5);
      const balanceToken4 = await Erc1155.balanceOf(owner.address, 4);
      const balanceToken0 = await Erc1155.balanceOf(owner.address, 0);
      expect(balanceToken4).to.equal(5);
      expect(balanceToken0).to.equal(5);
    });

    it("Should allow trading token 4 for token 1", async function () {
      await Erc1155.connect(owner).mint(owner.address, 4, 10);
      await Erc1155.connect(owner).tradeToken(4, 1, 5);
      const balanceToken4 = await Erc1155.balanceOf(owner.address, 4);
      const balanceToken1 = await Erc1155.balanceOf(owner.address, 1);
      expect(balanceToken4).to.equal(5);
      expect(balanceToken1).to.equal(5);
    });

    it("Should allow trading token 4 for token 2", async function () {
      await Erc1155.connect(owner).mint(owner.address, 4, 10);
      await Erc1155.connect(owner).tradeToken(4, 2, 5);
      const balanceToken4 = await Erc1155.balanceOf(owner.address, 4);
      const balanceToken2 = await Erc1155.balanceOf(owner.address, 2);
      expect(balanceToken4).to.equal(5);
      expect(balanceToken2).to.equal(5);
    });

    it("Should allow trading token 5 for token 0", async function () {
      await Erc1155.connect(owner).mint(owner.address, 5, 10);
      await Erc1155.connect(owner).tradeToken(5, 0, 5);
      const balanceToken5 = await Erc1155.balanceOf(owner.address, 5);
      const balanceToken0 = await Erc1155.balanceOf(owner.address, 0);
      expect(balanceToken5).to.equal(5);
      expect(balanceToken0).to.equal(5);
    });

    it("Should allow trading token 5 for token 1", async function () {
      await Erc1155.connect(owner).mint(owner.address, 5, 10);
      await Erc1155.connect(owner).tradeToken(5, 1, 5);
      const balanceToken5 = await Erc1155.balanceOf(owner.address, 5);
      const balanceToken1 = await Erc1155.balanceOf(owner.address, 1);
      expect(balanceToken5).to.equal(5);
      expect(balanceToken1).to.equal(5);
    });

    it("Should allow trading token 5 for token 2", async function () {
      await Erc1155.connect(owner).mint(owner.address, 5, 10);
      await Erc1155.connect(owner).tradeToken(5, 2, 5);
      const balanceToken5 = await Erc1155.balanceOf(owner.address, 5);
      const balanceToken2 = await Erc1155.balanceOf(owner.address, 2);
      expect(balanceToken5).to.equal(5);
      expect(balanceToken2).to.equal(5);
    });

    it("Should allow trading token 6 for token 0", async function () {
      await Erc1155.connect(owner).mint(owner.address, 6, 10);
      await Erc1155.connect(owner).tradeToken(6, 0, 5);
      const balanceToken6 = await Erc1155.balanceOf(owner.address, 6);
      const balanceToken0 = await Erc1155.balanceOf(owner.address, 0);
      expect(balanceToken6).to.equal(5);
      expect(balanceToken0).to.equal(5);
    });

    it("Should allow trading token 6 for token 1", async function () {
      await Erc1155.connect(owner).mint(owner.address, 6, 10);
      await Erc1155.connect(owner).tradeToken(6, 1, 5);
      const balanceToken6 = await Erc1155.balanceOf(owner.address, 6);
      const balanceToken1 = await Erc1155.balanceOf(owner.address, 1);
      expect(balanceToken6).to.equal(5);
      expect(balanceToken1).to.equal(5);
    });

    it("Should allow trading token 6 for token 0", async function () {
      await Erc1155.connect(owner).mint(owner.address, 6, 10);
      await Erc1155.connect(owner).tradeToken(6, 1, 5);
      const balanceToken6 = await Erc1155.balanceOf(owner.address, 6);
      const balanceToken1 = await Erc1155.balanceOf(owner.address, 1);
      expect(balanceToken6).to.equal(5);
      expect(balanceToken1).to.equal(5);
    });

    it("Should Revert trading Token 3 for token 4", async function () {
      await Erc1155.connect(owner).mint(owner.address, 3, 10);
      expect(Erc1155.connect(owner).tradeToken(3, 4, 5)).to.be.revertedWith(
        "ERC1155__InvalidTokenForTrade"
      );
    });

    it("Should not allow trading token 0 for token 1", async function () {
      await Erc1155.connect(owner).mint(owner.address, 0, 10);
      await expect(
        Erc1155.connect(owner).tradeToken(0, 1, 5)
      ).to.be.revertedWith("ERC1155__InvalidTokenForTrade");
    });

    it("Should not allow trading token 0 for token 2", async function () {
      await Erc1155.connect(owner).mint(owner.address, 0, 10);
      await expect(
        Erc1155.connect(owner).tradeToken(0, 2, 5)
      ).to.be.revertedWith("ERC1155__InvalidTokenForTrade");
    });

    it("Should not allow trading token 1 for token 0", async function () {
      await Erc1155.connect(owner).mint(owner.address, 1, 10);
      await expect(
        Erc1155.connect(owner).tradeToken(1, 0, 5)
      ).to.be.revertedWith("ERC1155__InvalidTokenForTrade");
    });

    it("Should not allow trading token 1 for token 2", async function () {
      await Erc1155.connect(owner).mint(owner.address, 1, 10);
      await expect(
        Erc1155.connect(owner).tradeToken(1, 2, 5)
      ).to.be.revertedWith("ERC1155__InvalidTokenForTrade");
    });

    it("Should not allow trading token 2 for token 0", async function () {
      await Erc1155.connect(owner).mint(owner.address, 2, 10);
      await expect(
        Erc1155.connect(owner).tradeToken(2, 0, 5)
      ).to.be.revertedWith("ERC1155__InvalidTokenForTrade");
    });

    it("Should not allow trading token 2 for token 1", async function () {
      await Erc1155.connect(owner).mint(owner.address, 2, 10);
      await expect(
        Erc1155.connect(owner).tradeToken(2, 1, 5)
      ).to.be.revertedWith("ERC1155__InvalidTokenForTrade");
    });

    it("Should revert on attempting to trade a non-existent token", async function () {
      await expect(
        Erc1155.connect(owner).tradeToken(7, 0, 5)
      ).to.be.revertedWith("ERC1155__InvalidTokenForTrade");
    });
  });
  describe("Burning", function () {
    beforeEach(async function () {
      // Grant MINTER_ROLE to owner
      await Erc1155.grantRole(Erc1155.MINTER_ROLE(), owner.address);

      // Mint tokens 0-6 to owner, since we are only testing the burn functionality, we assume the user already has the token they want to burn.
      for (let i = 0; i <= 6; i++) {
        await Erc1155.mint(owner.address, i, 10);
      }
    });

    it("Should allow to burn token 0", async function () {
      await Erc1155.burn(owner.address, 0, 5);
      const balance = await Erc1155.balanceOf(owner.address, 0);
      expect(balance).to.equal(5);
    });

    it("Should allow to burn token 1", async function () {
      await Erc1155.burn(owner.address, 1, 5);
      const balance = await Erc1155.balanceOf(owner.address, 1);
      expect(balance).to.equal(5);
    });

    it("Should allow to burn token 2", async function () {
      await Erc1155.burn(owner.address, 2, 5);
      const balance = await Erc1155.balanceOf(owner.address, 2);
      expect(balance).to.equal(5);
    });

    it("Should allow to burn token 3", async function () {
      await Erc1155.burn(owner.address, 3, 5);
      const balance = await Erc1155.balanceOf(owner.address, 3);
      expect(balance).to.equal(5);
    });

    it("Should allow to burn token 4", async function () {
      await Erc1155.burn(owner.address, 4, 5);
      const balance = await Erc1155.balanceOf(owner.address, 4);
      expect(balance).to.equal(5);
    });

    it("Should allow to burn token 5", async function () {
      await Erc1155.burn(owner.address, 5, 5);
      const balance = await Erc1155.balanceOf(owner.address, 5);
      expect(balance).to.equal(5);
    });

    it("Should allow to burn token 6", async function () {
      await Erc1155.burn(owner.address, 6, 5);
      const balance = await Erc1155.balanceOf(owner.address, 6);
      expect(balance).to.equal(5);
    });

    it("Should revert if burning more than balance", async function () {
      await expect(Erc1155.burn(owner.address, 3, 15)).to.be.reverted;
    });
  });

  describe("setForgingContract", function () {
    it("Should allow admin to set the forging contract", async function () {
      const forgingContractAddress = addr2.address; // for simplicity in this test
      await Erc1155.setForgingContract(forgingContractAddress);

      // Validate that the new forging contract has the MINTER_ROLE
      expect(await Erc1155.hasRole(MINTER_ROLE, forgingContractAddress)).to.be
        .true;
    });

    it("Should allow admin to update the forging contract", async function () {
      const oldForgingContract = addr2.address;
      const newForgingContract = addr1.address;

      await Erc1155.setForgingContract(oldForgingContract);
      await Erc1155.setForgingContract(newForgingContract);

      // Validate that the old forging contract no longer has the MINTER_ROLE
      expect(await Erc1155.hasRole(MINTER_ROLE, oldForgingContract)).to.be
        .false;

      // Validate that the new forging contract has the MINTER_ROLE
      expect(await Erc1155.hasRole(MINTER_ROLE, newForgingContract)).to.be.true;
    });

    it("Should not allow non-admin to set the forging contract", async function () {
      const forgingContractAddress = addr2.address;

      await expect(
        Erc1155.connect(addr1).setForgingContract(forgingContractAddress)
      ).to.be.revertedWith("ERC1155__NotAnAdmin");
    });
  });

  describe("Utility and Getters", function () {
    it("Should retrieve the last mint timestamp for a specific token and user", async function () {
      await Erc1155.connect(addr1).mint(addr1.address, 0, 1);
      const lastMintTime = await Erc1155.getLastMintTimestamp(addr1.address, 0);
      console.log("Last Mint Time: ", lastMintTime.toString());
      const currentBlockTime = (await ethers.provider.getBlock("latest"))
        .timestamp;
      expect(Number(lastMintTime)).to.be.closeTo(currentBlockTime, 2);
    });
  });
});
