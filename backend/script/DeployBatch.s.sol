// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Script} from "forge-std/Script.sol";
import {Batch} from "../src/Batch.sol";

contract DeployBatch is Script {
    function run() external returns (Batch) {
        vm.startBroadcast();
        Batch batch = new Batch();
        vm.stopBroadcast();
        return batch;
    }
}
