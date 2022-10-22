pragma solidity ^0.8.2;

contract GatewayRegistry {
    address public owner;
    mapping(address => address) public gateways;

    modifier onlyOwner() {
        require(msg.sender == owner, "FORBIDDEN");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    function setOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }
}
