// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {Batch} from "../src/Batch.sol";

contract BatchTest is Test {
    Batch batch;

    uint256 oneEther = 1e18;

    function setUp() external {
        batch = new Batch();
    }

    //Test if owner is actully the real owner
    function testOwnerIsDeployer() external {
        assertEq(batch.owner(), address(this));
    }

    //Test if owner can add employee
    function testOwnerCanAddEmployee() external {
        batch.addEmployee(address(0x123), oneEther);
        assertEq(batch.getEmployeesSalaries(address(0x123)), oneEther);
    }

   //Test addEmployee then remove then confirm zero index address balance
    function testOwnerCanDeleteEmployee() external {
        batch.addEmployee(address(0x123), oneEther);
        batch.removeEmployee(address(0x123));
        assertEq(batch.getEmployeesSalaries(address(0x123)), 0);
    }

    //Test actuall payment by owner and recieving end
    function testOwnerCanMakePayment() public {
        batch.addEmployee(address(0x123), oneEther);
        batch.depositFunds{ value: 1 ether }();

        assertEq(address(batch).balance, 1 ether); //confirm  balance
    }
}
