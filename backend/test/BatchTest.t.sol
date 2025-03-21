// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;


import {BatchPay} from  "../BatchPay";
import {Test} from "forge-std/Test.sol";


contract BatchTest is Test {
    BatchPay batchPay;
    address owner = address(this);

    address employee1 = address(0x123);
    address employee2 = address(0x234);

    function setUp() {
        batchPay = new BatchPay(owner);`
    }
    function testAddEmployee()
}