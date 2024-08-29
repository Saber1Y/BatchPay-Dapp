// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Batch {
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
    
    function removeEmployee(address _employee) external onlyOwner {
        delete employeesSalaries[_employee];

        for (uint256 i = 0; i < employees.length; i++) {
            if (employees[i] == _employee) {
                employees[i] = employees[employees.length - 1];
                employees.pop();
                break;
            }
        }
    }

    function payEmployees() external onlyOwner {
        for (uint256 i = 0; i < employees.length; i++) {
            address employee = employees[i];
            uint256 salary = employeesSalaries[employee];

            if (address(this).balance < salary) {
                revert NotEnoughFunds();
            }

            (bool success, ) = payable(employee).call{ value:salary }("");

            if (!success) {
                revert TransactionFailed();      
            }           
        }
    }


    function depositFunds() external payable onlyOwner {}

    function getEmployeesList() external view returns (uint256) {
        return employees.length;
    }

    function getEmployeesSalaries(address _employee) external view returns (uint256) {
        return employeesSalaries[_employee];
    }
}