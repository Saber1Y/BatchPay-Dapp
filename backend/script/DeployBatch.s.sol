// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {BatchPay} from "../src/BatchPay.sol";

contract DeployBatch is Script {
    function run() external returns (BatchPay) {

        vm.startBroadcast(); // Starts sending transactions from deployer wallet
        
        address owner = msg.sender;
        BatchPay batch = new BatchPay(owner); // Deploys the BatchPay contract

        vm.stopBroadcast(); // Stops broadcasting transactions

        return batch; // Returns the deployed contract instance
    }
}