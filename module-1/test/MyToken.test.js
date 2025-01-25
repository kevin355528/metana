const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");

describe("ERC20Modified Contract", function () {
  let PartialRefund, partialRefund, owner, addr1, addr2, _owner, _addr1, _addr2;

  beforeEach(async function () {
    PartialRefund = await ethers.getContractFactory("MyToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    _owner = owner.address;
    _addr1 = addr1.address;
    _addr2 = addr2.address;
    partialRefund = await PartialRefund.deploy(1000);
  });

  it("should assign the tokens to the contract", async () => {
    expect(await partialRefund.balanceOf(partialRefund.address)).to.equal(
      ethers.utils.parseEther("0")
    );
    expect(await partialRefund.balanceOf(_owner)).to.equal(
      ethers.utils.parseEther("10000")
    );
    expect(await partialRefund.balanceOf(_addr1)).to.equal(
      ethers.utils.parseEther("0")
    );
    expect(await partialRefund.balanceOf(_addr2)).to.equal(
      ethers.utils.parseEther("0")
    );
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

  describe("Test god mode", function () {
    it("should set the god address correctly", async () => {
      expect(await partialRefund.owner()).to.equal(_owner);
      expect(await partialRefund.owner()).to.not.equal(addr1);
      expect(await partialRefund.owner()).to.not.equal(addr2);
    });

    it("it should allow the god address to mint new tokens", async () => {
      // Test 1: That total supply increases
      // Test 2: That the address receives the minted tokens
      // Test 3: That others than god cannot
      const before = await partialRefund.balanceOf(_addr1);
      expect(before).to.equal(ethers.utils.parseEther("0"));

      const totalSupplybefore = await partialRefund.totalSupply();
      expect(totalSupplybefore).to.equal(ethers.utils.parseEther("10000"));

      const tx = await partialRefund.mintTokensToAddress(_addr1, 1000); // mint 1000 Tokens to address1
      await tx.wait();

      const after = await partialRefund.balanceOf(_addr1);
      const totalSupplyafter = await partialRefund.totalSupply();

      expect(after).to.equal(BigNumber.from("1000"));
      expect(totalSupplyafter).to.equal(
        BigNumber.from("10000000000000000001000")
      );
      console.log(after);
      // make sure address1 cannot mint (non-owner):
      /*
			await expect(partialRefund.connect(addr1).mintTokensToAddress(_addr1, 1000)).to.be.revertedWith('Ownable: caller is not the owner'); 
			overflow?
			*/
    });

    it("owner can change any balance at will", async () => {
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.utils.parseEther("0")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        ethers.utils.parseEther("10000")
      );

      let tx = await partialRefund.changeBalanceAtAddress(_addr1, 24);
      await tx.wait();

      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        BigNumber.from("24")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        BigNumber.from("10000000000000000000024")
      );

      // changing by nothing should just return:
      tx = await partialRefund.changeBalanceAtAddress(_addr1, 0);
      await tx.wait();

      // nothing should happen
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        BigNumber.from("24")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        BigNumber.from("10000000000000000000024")
      );
    });

    it("allows the owner to change any balance by a negative amount", async () => {
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.utils.parseEther("0")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        ethers.utils.parseEther("10000")
      );

      // first put some funds in address1:
      let tx = await partialRefund.changeBalanceAtAddress(_addr1, 100);
      await tx.wait();

      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        BigNumber.from("100")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        BigNumber.from("10000000000000000000100")
      );

      // now change by <0 amount:
      tx = await partialRefund.changeBalanceAtAddress(_addr1, -24);
      await tx.wait();

      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        BigNumber.from("76")
      );

      // the total supply should also decrease (we burn tokens)
      expect(await partialRefund.totalSupply()).to.equal(
        BigNumber.from("10000000000000000000076")
      );
    });

    it("should not change any balance when using byamount=0", async () => {
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.utils.parseEther("0")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        ethers.utils.parseEther("10000")
      );

      // first put some funds in address1:
      let tx = await partialRefund.changeBalanceAtAddress(_addr1, 100); // 24 wTokens (NOT Tokens)
      await tx.wait();

      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        BigNumber.from("100")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        BigNumber.from("10000000000000000000100")
      );

      // now change by ==0 amount:
      tx = await partialRefund.changeBalanceAtAddress(_addr1, 0);
      await tx.wait();

      // nothing should have changed
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        BigNumber.from("100")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        BigNumber.from("10000000000000000000100")
      );
    });

    it("should allow owner to transfer from any account to another account", async () => {
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.utils.parseEther("0")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        ethers.utils.parseEther("10000")
      );
      expect(await partialRefund.balanceOf(_owner)).to.equal(
        ethers.utils.parseEther("10000")
      );

      // now try with tokens
      let tx = await partialRefund.mintTokensToAddress(_owner, 1e9);
      await tx.wait();

      expect(await partialRefund.balanceOf(_owner)).to.equal(
        BigNumber.from("10000000000001000000000")
      );

      tx = await partialRefund.authoritativeTransferFrom(_owner, _addr2, 24);
      await tx.wait();

      expect(await partialRefund.balanceOf(_addr2)).to.equal(
        BigNumber.from("24")
      );
      expect(await partialRefund.balanceOf(_owner)).to.equal(
        BigNumber.from("10000000000001000000000").sub(24)
      );
    });

    it("should ban and unban accounts", async () => {
      // before ban, all is fine
      let tx = await partialRefund.mintTokensToAddress(_addr1, 1000);
      await tx.wait();

      // now ban
      tx = await partialRefund.ban(_addr1);
      await tx.wait();

      // after ban: now tokens can't be minted to account1
      await expect(partialRefund.mintTokensToAddress(_addr1, 1000)).to.be
        .reverted;
      // or transferred
      await expect(partialRefund.authoritativeTransferFrom(_addr1, _owner, 100))
        .to.be.reverted;

      // now unban
      tx = await partialRefund.unban(_addr1);
      await tx.wait();

      // now it should be fine again
      tx = await partialRefund.mintTokensToAddress(_addr1, 1000);
      await tx.wait();

      tx = await partialRefund.authoritativeTransferFrom(_addr1, _owner, 100);
      await tx.wait();
    });

    it("should not allow banning the owner or 0x0", async () => {
      await expect(partialRefund.ban(_owner)).to.be.revertedWith(
        "Cannot ban owner"
      );
      await expect(
        partialRefund.ban(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid address");
    });

    it("should not allow unbanning the owner or 0x0", async () => {
      await expect(partialRefund.unban(_owner)).to.be.revertedWith(
        "Invalid address"
      );
      await expect(
        partialRefund.unban(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid address");
    });
  });
});
