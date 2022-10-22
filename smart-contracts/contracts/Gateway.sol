// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IGateway.sol";

contract Gateway is IGateway {
    address public immutable token;

    event TransferSuccessful(address sender, address recipient, uint256 amount);
    event TransferFailed(address sender, address recipient, uint256 amount);

    constructor(address _token) {
        token = _token;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        bool success = IERC20(token).transferFrom(sender, recipient, amount);
        if (success) {
            emit TransferSuccessful(sender, recipient, amount);
        } else {
            emit TransferFailed(sender, recipient, amount);
        }
    }
}
