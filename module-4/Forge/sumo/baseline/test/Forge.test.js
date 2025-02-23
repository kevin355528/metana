const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Forge", function () {
  let erc1155, Erc1155;
  let forge, Forge;
  let owner, addr1, addr2;

  beforeEach(async function () {
    // Deploy erc1155 contract
    erc1155 = await ethers.getContractFactory("erc1155");
    [owner, addr1, addr2] = await ethers.getSigners();
    Erc1155 = await erc1155.deploy();

    // Deploy forge contract
    forge = await ethers.getContractFactory("Forge");
    Forge = await forge.deploy(Erc1155.getAddress());

    // Set the forging contract in the ERC1155 contract
    await Erc1155.setForgingContract(Forge.getAddress());
  });

  describe("Forging Tokens", function () {
    describe("ForgeToken3", () => {
      it("Should forge Token 3 by burning Token 0 and 1", async function () {
        // Mint tokens for the user
        await Erc1155.mint(addr1.address, 0, 10);
        await Erc1155.mint(addr1.address, 1, 10);

        // Forge Token 3
        await Forge.connect(addr1).forgeToken3(5);

        // Check resulting balances
        expect(await Erc1155.balanceOf(addr1.address, 0)).to.equal(5);
        expect(await Erc1155.balanceOf(addr1.address, 1)).to.equal(5);
        expect(await Erc1155.balanceOf(addr1.address, 3)).to.equal(5);
      });
      it("Should revert if trying to forge Token 3 with insufficient Token 0 balance", async function () {
        await Erc1155.mint(owner.address, 1, 5); // Mint some of Token 1 for balance
        expect(Forge.connect(owner).forgeToken3(5)).to.be.revertedWith(
          "__InsufficientToken0"
        );
      });

      it("Should revert if trying to forge Token 3 with insufficient Token 1 balance", async function () {
        await Erc1155.mint(owner.address, 0, 5); // Mint some of Token 0 for balance
        expect(Forge.connect(owner).forgeToken3(5)).to.be.revertedWith(
          "__InsufficientToken1"
        );
      });
    });

    describe("ForgeToken4", () => {
      it("Should forge Token 4 by burning Token 1 and 2", async function () {
        // Mint tokens for the user
        await Erc1155.mint(addr1.address, 1, 10);
        await Erc1155.mint(addr1.address, 2, 10);

        // Forge Token 4
        await Forge.connect(addr1).forgeToken4(5);

        // Check resulting balances
        expect(await Erc1155.balanceOf(addr1.address, 1)).to.equal(5);
        expect(await Erc1155.balanceOf(addr1.address, 2)).to.equal(5);
        expect(await Erc1155.balanceOf(addr1.address, 4)).to.equal(5);
      });

      it("Should revert if trying to forge Token 4 with insufficient Token 1 balance", async function () {
        await Erc1155.mint(owner.address, 2, 5); // Mint some of Token 1 for balance
        expect(Forge.connect(owner).forgeToken4(5)).to.be.revertedWith(
          "Forge__InsufficientToken1"
        );
      });

      it("Should revert if trying to forge Token 4 with insufficient Token 1 balance", async function () {
        await Erc1155.mint(owner.address, 1, 5); // Mint some of Token 0 for balance
        expect(Forge.connect(owner).forgeToken4(5)).to.be.revertedWith(
          "__InsufficientToken2"
        );
      });
    });

    describe("forgeToken5", () => {
      it("Should forge Token 5 by burning Token 0 and 2", async function () {
        // Mint tokens for the user
        await Erc1155.mint(addr1.address, 0, 10);
        await Erc1155.mint(addr1.address, 2, 10);

        // Forge Token 5
        await Forge.connect(addr1).forgeToken5(5);

        // Check resulting balances
        expect(await Erc1155.balanceOf(addr1.address, 0)).to.equal(5);
        expect(await Erc1155.balanceOf(addr1.address, 2)).to.equal(5);
        expect(await Erc1155.balanceOf(addr1.address, 5)).to.equal(5);
      });
      it("Should revert if trying to forge Token 5 with insufficient Token 0 balance", async function () {
        await Erc1155.mint(owner.address, 2, 5); // Mint some of Token 1 for balance
        expect(Forge.connect(owner).forgeToken5(5)).to.be.revertedWith(
          "__InsufficientToken0"
        );
      });

      it("Should revert if trying to forge Token 5 with insufficient Token 2 balance", async function () {
        await Erc1155.mint(owner.address, 0, 5); // Mint some of Token 0 for balance
        expect(Forge.connect(owner).forgeToken5(5)).to.be.revertedWith(
          "Forge__InsufficientToken2"
        );
      });
    });

    describe("forgeToken6", () => {
      it("Should forge Token 6 by burning Token 0 and 1", async function () {
        // Mint tokens for the user
        await Erc1155.mint(addr1.address, 0, 10);
        await Erc1155.mint(addr1.address, 1, 10);
        await Erc1155.mint(addr1.address, 2, 10);

        // Forge Token 3
        await Forge.connect(addr1).forgeToken6(5);

        // Check resulting balances
        expect(await Erc1155.balanceOf(addr1.address, 0)).to.equal(5);
        expect(await Erc1155.balanceOf(addr1.address, 1)).to.equal(5);
        expect(await Erc1155.balanceOf(addr1.address, 2)).to.equal(5);
        expect(await Erc1155.balanceOf(addr1.address, 6)).to.equal(5);
      });

      it("Should revert if trying to forge Token 6 with insufficient Token 0 balance", async function () {
        await Erc1155.mint(owner.address, 1, 5);
        await Erc1155.mint(owner.address, 2, 5);
        expect(Forge.connect(owner).forgeToken6(5)).to.be.revertedWith(
          "__InsufficientToken0"
        );
      });

      it("Should revert if trying to forge Token 6 with insufficient Token 1 balance", async function () {
        await Erc1155.mint(owner.address, 0, 5);
        await Erc1155.mint(owner.address, 2, 5);
        expect(Forge.connect(owner).forgeToken6(5)).to.be.revertedWith(
          "__InsufficientToken1"
        );
      });

      it("Should revert if trying to forge Token 6 with insufficient Token 1 balance", async function () {
        await Erc1155.mint(owner.address, 0, 5);
        await Erc1155.mint(owner.address, 1, 5);
        expect(Forge.connect(owner).forgeToken6(5)).to.be.revertedWith(
          "__InsufficientToken2"
        );
      });
    });
  });
});
