// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {Batch} from "../src/Batch.sol";

contract BatchTest is Test {
    Batch batch;

    function setUp() external {
        batch = new Batch();
    }

   function testOwnerIsDeployer() external {
        assertEq(batch.owner(), address(this));
    }
}
