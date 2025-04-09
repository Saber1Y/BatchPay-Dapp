// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {BatchPay} from "../src/BatchPay.sol";
import {Test} from "forge-std/Test.sol";

contract BatchTest is Test {
    BatchPay batchPay; //create a instance of BatchPay contract
    address owner = address(this); //intialized a owner  to whoo


    address employee1 = address(0x123);
    address employee2 = address(0x234);

    event EmployeeAdded(address indexed employee, uint256 amount);
    function setUp() public {
        batchPay = new BatchPay(owner);
    }
    function testIfOwnerIsOwner() public view {
        assertEq(batchPay.owner(), owner, "Owner should be deploof contract");
    }

    function testAddEmployee() public {
        vm.expectEmit(true, true, false, true);
        emit EmployeeAdded(employee1, 1 ether);

        batchPay.addEmployee(employee1, 1 ether);

        assertEq(
            batchPay.getEmployeesSalaries(employee1),
            1 ether,
            "Employee's address should be 1 ether"
        );
    }

    // function testReaddingEmployees() public {
    //     batchPay.addEmployee(employee1, 1 ether);

    //     // Expect the next call to revert with the EmployeeAlreadyExists error
    //     vm.expectRevert(BatchPay.EmployeeAlreadyExists.selector);
    //     batchPay.addEmployee(employee1, 1 ether);
    // }

    function testDepositFunds() public {
        vm.deal(address(batchPay), 5 ether);

        assertEq(
            batchPay.getOwnersBalance(),
            5 ether,
            "Balance should be 5 ether"
        );
    }

    function testPayEmployees() public {
        batchPay.addEmployee(employee1, 1 ether);
        batchPay.addEmployee(employee2, 3 ether);
    }
}
