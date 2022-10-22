pragma solidity ^0.8.2;

contract GatewayRegistry {
    address public owner;

    mapping(address => address) public gateways;
    address[] public supportedToken;

    modifier onlyOwner() {
        require(msg.sender == owner, "FORBIDDEN");
        _;
    }

    event TokenAdded(address token, address gateway);
    event TokenRemoved(address token);

    constructor(address _owner) {
        owner = _owner;
    }

    function setOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function addToken(address token, address gateway) public onlyOwner {
        supportedToken.push(token);
        gateways[token] = gateway;
        emit TokenAdded(token, gateway);
    }

    function removeToken(address token) public onlyOwner {
        gateways[token] = address(0);

        uint256 element = 0;
        for (uint256 i = 0; i < supportedToken.length - 1; i++) {
            if (supportedToken[i] != token) {
                continue;
            }
            element = i;
            break;
        }

        delete supportedToken[element];
        emit TokenRemoved(token);
    }
}
