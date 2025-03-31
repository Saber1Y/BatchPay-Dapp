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
    mapping(address => bool) private isEmployees; // mapping to check if addr exists
    address[] public employees;

    uint256 public transactionFeeBps = 100; // 100 = 1%
    uint256 public totalFeesCollected;     // Tracks the total fees collected

    event EmployeePaid(address indexed employee, uint256 netAmount, uint256 feeAmount);
    event EmployeeAdded(address indexed employee, uint256 amount);
    event EmployeeRemoved(address indexed employee, uint256 amount);
    event FeeCollected(address indexed owner, uint256 feeAmount);
    event FundsDeposited(address indexed user, uint256 amount);

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotAuthorized();
        }
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    function addEmployee(address _employee, uint256 _salary) external onlyOwner {
        if (isEmployees[_employee]) {
            revert EmployeeAlreadyExists();
        }
        if (_salary == 0) {
            revert InvalidSalary();
        }
        employees.push(_employee);
        employeesSalaries[_employee] = _salary;
        isEmployees[_employee] = true;
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
                isEmployees[_employee] = false;
                emit EmployeeRemoved(_employee, _salary);
                break;
            }
        }
    }

function payEmployees() external onlyOwner {

    for (uint256 i = 0; i < employees.length; i++) {
        address employee = employees[i];
        uint256 salary = employeesSalaries[employee];

        // Skip if no salary or if employee is not registered
        if (salary == 0 || !isEmployees[employee]) {
            continue;
        }

        // Calculate fee (1% fee: transactionFeeBps is 100)
        uint256 fee = (salary * transactionFeeBps) / 10000;
        uint256 netSalary = salary - fee;

        // Check if contract has enough balance for the full salary
   uint256 totalRequired = salary + fee;
if (address(this).balance < totalRequired) {
    revert NotEnoughFunds();
}



        // Transfer fee to owner
        (bool feeSent, ) = payable(owner).call{value: fee}("");
        require(feeSent, "Fee transfer failed");

        // Update total fees collected before attempting the transfer

        totalFeesCollected += fee; //get number of collated fees

        emit FeeCollected(owner, fee);

        // Transfer net salary to employee
        (bool salarySent, ) = payable(employee).call{value: netSalary}("");
        require(salarySent, "Salary transfer failed");

        emit EmployeePaid(employee, netSalary, fee);
    }
}

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function depositFunds() external payable onlyOwner {}

    function getEmployeesList() external view returns (uint256) {
        return employees.length;
    }

    function getOwnersBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getEmployeesSalaries(address _employee) external view returns (uint256) {
        return employeesSalaries[_employee];
    }
}
