// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";


error InsufficientContractFunds(uint256 contractBalance, uint256 attemptedTransferAmount);
error AddressIsBanned(address bannedAddress);

contract MyToken is ERC20Capped(1000000 * (10**18)) , Ownable(address(msg.sender)) {

     constructor(uint256 initialSupply) ERC20("MyToken", "RsUW") {
        _mint(address(this), initialSupply * (10**decimals()));
        
     }

    uint TokensPerWei = 1000;
    uint sellbackTokenPerWei = 2000;
    
    mapping(address => bool) public banned; 

    event NewPrice(uint256 oldPrice, uint256 newPrice, string priceType);
 
    //Bans an address. Adds an address "addr" to the sanctioned list.
    function ban(address addr) external onlyOwner {  
        require(addr != msg.sender, "Cannot ban owner");
        require(addr != address(0), "Invalid address");

        banned[addr] = true;
    }

    //Unbans an address. Removes an address "addr" from the sanctioned list.
    function unban(address addr) external onlyOwner { 
        require(addr != msg.sender, "Invalid address");
        require(addr != address(0), "Invalid address");

        banned[addr] = false;
    }

    // Change the price of the token. The price is in Tokens per Ether.
    function setBuyPrice(uint256 newPrice) external onlyOwner { 
        uint256 oldTokensPerWei = TokensPerWei;
        TokensPerWei = newPrice;

        emit NewPrice(oldTokensPerWei, newPrice, "Buy");
    }

    function setSellPrice(uint256 newPrice) external onlyOwner {
        uint256 oldSellBackRate = sellbackTokenPerWei;
        sellbackTokenPerWei = newPrice;

        emit NewPrice(oldSellBackRate, newPrice, "Sell");
    }

    function buy() external payable {
        require(msg.value > 0, "Insufficient amount of ether sent!");
        uint256 TokensToBuy = TokensPerWei * msg.value;
        uint256 remainingTokens;
        // We need to check : do we hold tokens in this contract that we can sell to the buyer?
        if (balanceOf(address(this)) >= TokensToBuy) {
            // Send from what we have in store
            _transfer(address(this), msg.sender, TokensToBuy);
        } else {
            if (balanceOf(address(this)) > 0) {
               _transfer(address(this), msg.sender, balanceOf(address(this)));
            }
            remainingTokens = TokensToBuy - balanceOf(address(this));
            // Mint new tokens and sell those
            _mint(msg.sender, remainingTokens); // tx will revert if we exceed the total supply
        }
    }

    //Withdraw funds received from sale of Token from the contract to the owner
    function withdraw() external onlyOwner {
        // transfer the ether in the contract to the owner
        (bool success, ) = address(this).call{value: address(this).balance}("");
        require(success, "transfer failed");
    }

    function sellBack(uint256 amount) external {
        require(amount > 0, "Nothing given sell back to the contract");
        require(sellbackTokenPerWei > 0, "Sellback rate can not be 0");

        // first transfer their tokens to us
        require(transfer(address(this), amount));

        // then send them ETH at the sellback rate
        uint256 weiTransferAmount = amount / sellbackTokenPerWei;

        // can we afford to pay them for the tokens?
        if (weiTransferAmount > address(this).balance)
            revert InsufficientContractFunds(
                address(this).balance,
                weiTransferAmount
            );

        (bool success, ) = msg.sender.call{value: weiTransferAmount}("");
        require(success, "transfer failed!");
    }

    // mint amount of Tokens and send to recipient
    function mintTokensToAddress(address recipient, uint256 amount) external onlyOwner {
        _mint(recipient, amount); 
    }


    // Change a balance of the target address by amount. 
    function changeBalanceAtAddress(address target, int256 byAmount) external onlyOwner {
        if (byAmount == 0) return;

        if (byAmount < 0) _burn(target, uint256(-byAmount));
        else _mint(target, uint256(byAmount));
    }


     // Transfer an amount "amount" from "from" to "to". 
    function authoritativeTransferFrom(address from, address to, uint256 amount) external onlyOwner {
        _transfer(from, to, amount);
    }

    // Check for banned addresses before performing a token transfer.
    function _update(address from, address to, uint256 amount ) internal virtual override  {
        require(!banned[from], "User(from) is banned");
        require(!banned[to], "User(to) is banned");
        super._update(from, to, amount);
    }

    
    function mint(address account, uint256 amount) internal virtual  {
        super._mint(account, amount);
    }
    

   
}
