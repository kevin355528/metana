const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");

describe("ERC20", function () {
  let PartialRefund,
    partialRefund,
    deployer,
    addr1,
    addr2,
    _deployer,
    _addr1,
    _addr2;

  beforeEach(async function () {
    PartialRefund = await ethers.getContractFactory("MyToken");
    [deployer, addr1, addr2] = await ethers.getSigners();
    _deployer = deployer.address;
    _addr1 = addr1.address;
    _addr2 = addr2.address;
    partialRefund = await PartialRefund.deploy("MyToken", "TST");
  });

  it("should assign the tokens to the contract", async () => {
    expect(await partialRefund.balanceOf(partialRefund.getAddress())).to.equal(
      ethers.parseEther("1000")
    );
    expect(await partialRefund.balanceOf(_deployer)).to.equal(
      ethers.parseEther("0")
    );
    expect(await partialRefund.balanceOf(_addr1)).to.equal(
      ethers.parseEther("0")
    );
    expect(await partialRefund.balanceOf(_addr2)).to.equal(
      ethers.parseEther("0")
    );
  });

  describe("Deployment", function () {
    it("Should deploy the contract", async function () {
      expect(partialRefund.getAddress()).to.exist;
    });

    it("Should set the right owner", async function () {
      expect(await partialRefund.owner()).to.equal(_deployer);
    });

    it("Should assign the initial supply of tokens to the contract", async function () {
      const ownerBalance = await partialRefund.balanceOf(
        partialRefund.getAddress()
      );
      expect(ownerBalance).to.equal(ethers.parseEther("1000"));
    });

    it("Should have correct token name and symbol", async function () {
      expect(await partialRefund.name()).to.equal("MyToken");
      expect(await partialRefund.symbol()).to.equal("TST");
    });
  });

  describe("Test god mode", function () {
    it("should set the god address correctly", async () => {
      expect(await partialRefund.owner()).to.equal(_deployer);
      expect(await partialRefund.owner()).to.not.equal(addr1);
      expect(await partialRefund.owner()).to.not.equal(addr2);
    });

    it("it should allow the god address to mint new tokens", async () => {
      // Test 1: That total supply increases
      // Test 2: That the address receives the minted tokens
      // Test 3: That others than god cannot
      const before = await partialRefund.balanceOf(_addr1);
      expect(before).to.equal(ethers.parseEther("0"));

      const totalSupplybefore = await partialRefund.totalSupply();
      expect(totalSupplybefore).to.equal(ethers.parseEther("1000"));

      const tx = await partialRefund.mintTokensToAddress(_addr1, 1000); // mint 1000 Tokens to address1
      await tx.wait();

      const after = await partialRefund.balanceOf(_addr1);
      const totalSupplyafter = await partialRefund.totalSupply();

      expect(after).to.equal(BigInt("1000"));
      expect(totalSupplyafter).to.equal(BigInt("1000000000000000001000"));
      console.log(after);
      // make sure address1 cannot mint (non-owner):
      await expect(
        partialRefund.connect(addr1).mintTokensToAddress(_addr1, 1000)
      ).to.be.revertedWithCustomError(
        partialRefund,
        "OwnableUnauthorizedAccount"
      );
    });

    it("owner can change any balance at will", async () => {
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("0")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        ethers.parseEther("1000")
      );

      let tx = await partialRefund.changeBalanceAtAddress(_addr1, 24);
      await tx.wait();

      expect(await partialRefund.balanceOf(_addr1)).to.equal(BigInt("24"));
      expect(await partialRefund.totalSupply()).to.equal(
        BigInt("1000000000000000000024")
      );

      await expect(
        partialRefund.connect(addr1).changeBalanceAtAddress(_deployer, 10)
      ).to.be.revertedWithCustomError(
        partialRefund,
        "OwnableUnauthorizedAccount"
      );

      // changing by nothing should just return:
      tx = await partialRefund.changeBalanceAtAddress(_addr1, 0);
      await tx.wait();

      // nothing should happen
      expect(await partialRefund.balanceOf(_addr1)).to.equal(BigInt("24"));
      expect(await partialRefund.totalSupply()).to.equal(
        BigInt("1000000000000000000024")
      );
    });

    it("allows the owner to change any balance by a negative amount", async () => {
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("0")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        ethers.parseEther("1000")
      );

      // first put some funds in address1:
      let tx = await partialRefund.changeBalanceAtAddress(_addr1, 100);
      await tx.wait();

      expect(await partialRefund.balanceOf(_addr1)).to.equal(BigInt("100"));
      expect(await partialRefund.totalSupply()).to.equal(
        BigInt("1000000000000000000100")
      );

      // now change by <0 amount:
      tx = await partialRefund.changeBalanceAtAddress(_addr1, -24);
      await tx.wait();

      expect(await partialRefund.balanceOf(_addr1)).to.equal(BigInt("76"));

      // the total supply should also decrease (we burn tokens)
      expect(await partialRefund.totalSupply()).to.equal(
        BigInt("1000000000000000000076")
      );
    });

    it("should not change any balance when using by amount=0", async () => {
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("0")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        ethers.parseEther("1000")
      );

      // first put some funds in address1:
      let tx = await partialRefund.changeBalanceAtAddress(_addr1, 100); // 24 wTokens (NOT Tokens)
      await tx.wait();

      expect(await partialRefund.balanceOf(_addr1)).to.equal(BigInt("100"));
      expect(await partialRefund.totalSupply()).to.equal(
        BigInt("1000000000000000000100")
      );

      // now change by ==0 amount:
      tx = await partialRefund.changeBalanceAtAddress(_addr1, 0);
      await tx.wait();

      // nothing should have changed
      expect(await partialRefund.balanceOf(_addr1)).to.equal(BigInt("100"));
      expect(await partialRefund.totalSupply()).to.equal(
        BigInt("1000000000000000000100")
      );
    });

    it("should allow owner to transfer from any account to another account", async () => {
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("0")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        ethers.parseEther("1000")
      );
      expect(await partialRefund.balanceOf(_deployer)).to.equal(
        ethers.parseEther("0")
      );

      // now try with tokens
      let tx = await partialRefund.mintTokensToAddress(_deployer, 1e9);
      await tx.wait();

      expect(await partialRefund.balanceOf(_deployer)).to.equal(
        BigInt("1000000000")
      );

      tx = await partialRefund.authoritativeTransferFrom(_deployer, _addr2, 24);
      await tx.wait();

      expect(await partialRefund.balanceOf(_addr2)).to.equal(BigInt("24"));
      expect(await partialRefund.balanceOf(_deployer)).to.equal(
        BigInt("1000000000") - BigInt("24")
      );

      await expect(
        partialRefund
          .connect(addr1)
          .authoritativeTransferFrom(_deployer, _addr2, 24)
      ).to.be.revertedWithCustomError(
        partialRefund,
        "OwnableUnauthorizedAccount"
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
      await expect(
        partialRefund.authoritativeTransferFrom(_addr1, _deployer, 100)
      ).to.be.reverted;

      // now unban
      tx = await partialRefund.unban(_addr1);
      await tx.wait();

      // now it should be fine again
      tx = await partialRefund.mintTokensToAddress(_addr1, 1000);
      await tx.wait();

      tx = await partialRefund.authoritativeTransferFrom(
        _addr1,
        _deployer,
        100
      );
      await tx.wait();

      // but only owner can ban
      await expect(
        partialRefund.connect(addr1).ban(_addr2)
      ).to.be.revertedWithCustomError(
        partialRefund,
        "OwnableUnauthorizedAccount"
      );
      await expect(
        partialRefund.connect(addr1).unban(_addr2)
      ).to.be.revertedWithCustomError(
        partialRefund,
        "OwnableUnauthorizedAccount"
      );
    });

    it("should not allow banning the owner or 0x0", async () => {
      await expect(partialRefund.ban(_deployer)).to.be.revertedWith(
        "Cannot ban owner"
      );
      await expect(
        partialRefund.ban("0x0000000000000000000000000000000000000000")
      ).to.be.revertedWith("Invalid address");
    });

    it("should not allow unbanning the owner or 0x0", async () => {
      await expect(partialRefund.unban(_deployer)).to.be.revertedWith(
        "Invalid address"
      );
      await expect(
        partialRefund.unban("0x0000000000000000000000000000000000000000")
      ).to.be.revertedWith("Invalid address");
    });

    it("should allow buying of tokens", async () => {
      expect(await partialRefund.balanceOf(_addr1)).to.equal(BigInt("0"));
      expect(
        await ethers.provider.getBalance(partialRefund.getAddress())
      ).to.equal(BigInt("0"));

      // buy 1000 Tokens by sending 1 ether
      await partialRefund.connect(addr1).buy({ value: ethers.parseEther("1") });

      // now account 1 should have 1000 Tokens
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("1000")
      );

      // and the contract should have 1 ether
      expect(
        await ethers.provider.getBalance(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("1"));
    });

    it("should not allow buying 0 tokens", async () => {
      expect(await partialRefund.balanceOf(_addr1)).to.equal(BigInt("0"));
      expect(
        await ethers.provider.getBalance(partialRefund.getAddress())
      ).to.equal(BigInt("0"));

      // buy 0 tokens...
      await expect(
        partialRefund.connect(addr1).buy({ value: ethers.parseEther("0") })
      ).to.be.revertedWith("Insufficient amount of ether sent!");
    });

    it("should allow the owner to withdraw", async () => {
      // // buy 1000 Tokens by sending 1 ether
      let tx = await partialRefund
        .connect(addr1)
        .buy({ value: ethers.parseEther("1") });
      await tx.wait();

      // and the contract should have 1 ether
      expect(
        await ethers.provider.getBalance(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("1"));

      // now we send this 1 ether to the owner

      await expect(
        partialRefund.connect(addr1).withdraw()
      ).to.be.revertedWithCustomError(
        partialRefund,
        "OwnableUnauthorizedAccount"
      );

      // get the owner bal before withdraw
      expect(await ethers.provider.getBalance(_deployer)).to.be.closeTo(
        ethers.parseEther("10000"),
        ethers.parseEther("10")
      );
      const before = await ethers.provider.getBalance(_deployer);
      console.log(before);

      // now withdraw from the contract to the owner
      tx = await partialRefund.withdraw();
      await tx.wait();

      //no more ether in the contract
      expect(
        await ethers.provider.getBalance(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("0"));

      // the owner has it
      expect(await ethers.provider.getBalance(_deployer)).to.be.closeTo(
        ethers.parseEther("1") + before,
        ethers.parseEther("0.01")
      );

      // gas is more than this, so check
      expect(await ethers.provider.getBalance(_deployer)).to.not.be.closeTo(
        ethers.parseEther("2") + before,
        ethers.parseEther("0.0000000001")
      );
    });

    it("should allow a sellback", async () => {
      // buy 1000 Tokens by sending 1 ether
      let tx = await partialRefund
        .connect(addr1)
        .buy({ value: ethers.parseEther("1") });
      await tx.wait();

      // we should have 1000 Tokens
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("1000")
      );

      // and the contract has 0:
      expect(
        await partialRefund.balanceOf(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("0"));

      // before we sell from account 1, get amount:
      const before = await ethers.provider.getBalance(_addr1);
      expect(before).to.be.closeTo(
        ethers.parseEther("10000"),
        ethers.parseEther("10")
      );

      // now sell 500 Tokens
      tx = await partialRefund
        .connect(addr1)
        .sellBack(ethers.parseEther("500"));
      await tx.wait();

      // we should have 500 now that the user sold back to us
      expect(
        await partialRefund.balanceOf(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("500"));

      // account1 receives some ether for the sale
      expect(await ethers.provider.getBalance(_addr1)).to.be.closeTo(
        before + ethers.parseEther("0.25"),
        ethers.parseEther("0.001")
      );
      // we received 0.25 ether for the sale of 500 Tokens (1000 Tokens is 1 ether)

      // should not allow sellback of 0 amount:
      await expect(
        partialRefund.connect(addr1).sellBack(ethers.parseEther("0"))
      ).to.be.revertedWith("Nothing given sell back to the contract");
    });

    it("should not allow a sellback where the user has less than what they sell back", async () => {
      // buy some tokens
      const tx = await partialRefund
        .connect(addr1)
        .buy({ value: ethers.parseEther("1") });
      await tx.wait();

      // we have 1000 tokens now
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("1000")
      );

      // now sell back more than we have
      expect(
        partialRefund.connect(addr1).sellBack(ethers.parseEther("10001"))
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should mint new tokens if we don't hold enough to sell", async () => {
      expect(
        await partialRefund.balanceOf(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("1000"));
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("0")
      );

      expect(await partialRefund.totalSupply()).to.equal(
        ethers.parseEther("1000")
      );

      // contract = 1000
      // acc1 = 0
      // first, buy from the supply:
      let tx = await partialRefund
        .connect(addr1)
        .buy({ value: ethers.parseEther("0.5") }); // 500 tokens
      await tx.wait();

      expect(
        await partialRefund.balanceOf(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("500"));
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("500")
      );
      expect(await partialRefund.totalSupply()).to.equal(
        ethers.parseEther("1000")
      ); // nothing new minted

      // now buy more than we have, we expect a mint
      tx = await partialRefund
        .connect(addr1)
        .buy({ value: ethers.parseEther("1.5") }); // buy 1500 tokens
      await tx.wait();

      expect(
        await partialRefund.balanceOf(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("500")); // we only mint
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("2000")
      ); // 500 existing + 1500 new
      expect(await partialRefund.totalSupply()).to.equal(
        ethers.parseEther("2500")
      ); // nothing new mint
    });

    it("should not sell back ether if we are out of inventory", async () => {
      expect(
        await ethers.provider.getBalance(partialRefund.getAddress())
      ).to.equal(BigInt("0"));

      // someone buys some tokens
      let tx = await partialRefund
        .connect(addr1)
        .buy({ value: ethers.parseEther("1") }); // buy 1000 tokens
      await tx.wait();

      expect(
        await ethers.provider.getBalance(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("1"));
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("1000")
      );

      // now the owner withdraws all ether
      tx = await partialRefund.connect(deployer).withdraw();
      await tx.wait();

      expect(
        await ethers.provider.getBalance(partialRefund.getAddress())
      ).to.equal(BigInt("0")); // no eth

      // now a sellback happens - but we are out of funds
      // now sell 500 Tokens back to the contract
      await expect(
        partialRefund.connect(addr1).sellBack(ethers.parseEther("500"))
      ).to.be.revertedWithCustomError(
        partialRefund,
        "InsufficientContractFunds"
      );
    });

    it("Should set the right buy price!", async () => {
      expect(
        await ethers.provider.getBalance(partialRefund.getAddress())
      ).to.equal(BigInt("0"));

      tx = await partialRefund
        .connect(addr1)
        .buy({ value: ethers.parseEther("1") }); // buy 1000 tokens (at the old price)
      await tx.wait();

      // in this purchase, 1 eth was sent to the contract in return for 1000 Tokens
      expect(
        await ethers.provider.getBalance(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("1"));
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("1000")
      );

      // now change the price
      tx = await partialRefund.connect(deployer).setBuyPrice(2000); // double the old price
      await tx.wait();

      // buy with same incoming amount of eth as before -- but we should now get 2000 tokens!
      tx = await partialRefund
        .connect(addr1)
        .buy({ value: ethers.parseEther("1") }); // buy 1000 tokens (at the old price)
      await tx.wait();

      expect(
        await ethers.provider.getBalance(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("2"));
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("3000")
      ); // first buy + this one

      //but only the owner can do it
      await expect(
        partialRefund.connect(addr1).setBuyPrice(2000)
      ).to.be.revertedWithCustomError(
        partialRefund,
        "OwnableUnauthorizedAccount"
      );
    });

    it("should allow a sellback", async () => {
      // buy 1000 Tokens by sending 1 ether
      let tx = await partialRefund
        .connect(addr1)
        .buy({ value: ethers.parseEther("1") });
      await tx.wait();

      // we should have 1000 Tokens
      expect(await partialRefund.balanceOf(_addr1)).to.equal(
        ethers.parseEther("1000")
      );

      // and the contract has 0:
      expect(
        await partialRefund.balanceOf(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("0"));

      // before we sell from account 1, get amount:
      const before = await ethers.provider.getBalance(_addr1);
      expect(before).to.be.closeTo(
        ethers.parseEther("10000"),
        ethers.parseEther("10")
      );

      // now sell 500 Tokens
      tx = await partialRefund
        .connect(addr1)
        .sellBack(ethers.parseEther("500"));
      await tx.wait();

      // we should have 500 now that the user sold back to us
      expect(
        await partialRefund.balanceOf(partialRefund.getAddress())
      ).to.equal(ethers.parseEther("500"));

      // account1 receives some ether for the sale
      expect(await ethers.provider.getBalance(_addr1)).to.be.closeTo(
        before + ethers.parseEther("0.25"),
        ethers.parseEther("0.001")
      );
      // we received 0.25 ether for the sale of 500 Tokens (1000 Tokens is 1 ether)

      // Now change the sellback price/rate:
      tx = await partialRefund.connect(deployer).setSellPrice(4000);
      await tx.wait();

      // now sell the remaining 500 Tokens, but at the new rate, so we get half as much now
      tx = await partialRefund
        .connect(addr1)
        .sellBack(ethers.parseEther("500"));
      await tx.wait();

      // account1 receives some ether for the sale
      // before we made this second sale, the account had 0.25 ether (from the first resale at the old price)
      // now it should have 0.25 + 0.125 (0.125 = 0.25 / 2) = 0.375
      expect(await ethers.provider.getBalance(_addr1)).to.be.closeTo(
        before + ethers.parseEther("0.375"),
        ethers.parseEther("0.001")
      );

      // but only the owner can do it
      await expect(
        partialRefund.connect(addr1).setSellPrice(4000)
      ).to.be.revertedWithCustomError(
        partialRefund,
        "OwnableUnauthorizedAccount"
      );
    });
  });
});
