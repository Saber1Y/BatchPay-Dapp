// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract BatchPay {
    error NotAuthorized();
    error NotEnoughFunds();
    error TransactionFailed();
    error EmployeeAlreadyExists();
    error InvalidSalary();
    error EmployeeNotFound();

    address public owner;
    mapping(address => uint256) public employeesSalaries;
    mapping(address => bool) private isEmployees; //mapping to check is addr exists
    address[] public employees;


    event EmployeePaid(address indexed employee, uint256 amount);
    event EmployeeAdded(address indexed employee, uint256 amount);
    event EmployeeRemoved(address indexed employee, uint256 amount);

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotAuthorized();
        }
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    function addEmployee(
        address _employee,
        uint256 _salary
    ) external onlyOwner {
        if (isEmployees[_employee]) {
            revert EmployeeAlreadyExists();
        }

        if (_salary == 0) {
            revert InvalidSalary();
        }

        employees.push(_employee);
        employeesSalaries[_employee] = _salary;
        emit EmployeeAdded(_employee, _salary);
    }

    function removeEmployee(address _employee) external onlyOwner {
        if (!isEmployees[_employee]) {
            revert EmployeeNotFound();
        }

        for (uint256 i = 0; i < employees.length; i++) {
            if (employees[i] == _employee) {
                employees[i] = employees[employees.length - 1];
                employees.pop();

                uint256 _salary = employeesSalaries[_employee];
                delete employeesSalaries[_employee];
                emit EmployeeRemoved(_employee, _salary);

                break; // break out of the loop
            }
        }
    }

function payEmployees() external onlyOwner {
    for (uint256 i = 0; i < employees.length; i++) {
        address employee = employees[i];
        uint256 salary = employeesSalaries[employee];

        if (salary == 0 || !isEmployees[employee]) {
            continue; // Skip employees without a salary
        }

        if (address(this).balance < salary) {
            revert NotEnoughFunds();
        }

        (bool success, ) = payable(employee).call{value: salary}("");
        if (success) {
            emit EmployeePaid(employee, salary);
        } else {
            revert TransactionFailed();
        }
    }
}



    function depositFunds() external payable onlyOwner {}

    function getEmployeesList() external view returns (uint256) {
        return employees.length;
    }

    function getOwnersBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getEmployeesSalaries(
        address _employee
    ) external view returns (uint256) {
        return employeesSalaries[_employee];
    }
}
