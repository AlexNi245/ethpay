"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const chai_1 = __importDefault(require("chai"));
const chai_ethers_1 = require("chai-ethers");
chai_1.default.use(chai_ethers_1.chaiEthers);
module.exports = chai_1.default;
