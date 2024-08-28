// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Batchpay {
    error NotAuthorized();
    error NotEnoughFunds();
    error TransactionFailed();

    address public owner;
    mapping(address => uint256) public employeesSalaries;
    address[] public employees;

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotAuthorized();
        }
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addEmployee(address _employee, uint256 _salary) external onlyOwner {
        employees.push(_employee);
        employeesSalaries[_employee] = _salary;
    }
}