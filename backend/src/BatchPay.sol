// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract BatchPay {
    error NotAuthorized();
    error NotEnoughFunds();
    error EmployeeAlreadyExists();
    error InvalidSalary();
    error EmployeeNotFound();
    error InvalidAddress();
    error FeeTooHigh();
    error TransferFailed();

    address public owner;
    mapping(address => uint256) public employeesSalaries;
    mapping(address => uint256) private employeeIndex; // Tracks array position
    address[] public employees;

    uint256 public totalFeesCollected;
    uint256 public fixedFee = 0.1 ether;
    uint256 public constant MAX_FEE = 0.5 ether;

    event EmployeePaid(address indexed employee, uint256 netAmount, uint256 feeAmount);
    event EmployeeAdded(address indexed employee, uint256 amount);
    event EmployeeRemoved(address indexed employee);
    event FeeCollected(address indexed owner, uint256 feeAmount);
    event FundsDeposited(address indexed depositor, uint256 amount);
    event SalaryUpdated(address indexed employee, uint256 newSalary);
    event OwnershipTransferred(address indexed newOwner);
    event FeeTransferFailed(address indexed employee, uint256 feeAmount);
event SalaryTransferFailed(address indexed employee, uint256 netAmount);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotAuthorized();
        _;
    }

    constructor(address _owner) {
        if (_owner == address(0)) revert InvalidAddress();
        owner = _owner;
    }

    function addEmployee(address _employee, uint256 _salary) external onlyOwner {
        if (_employee == address(0)) revert InvalidAddress();
        if (employeesSalaries[_employee] != 0) revert EmployeeAlreadyExists();
        if (_salary <= fixedFee) revert InvalidSalary();
        
        employees.push(_employee);
        employeeIndex[_employee] = employees.length - 1;
        employeesSalaries[_employee] = _salary;
        emit EmployeeAdded(_employee, _salary);
    }

    function updateSalary(address _employee, uint256 _newSalary) external onlyOwner {
        if (employeesSalaries[_employee] == 0) revert EmployeeNotFound();
        if (_newSalary <= fixedFee) revert InvalidSalary();
        
        employeesSalaries[_employee] = _newSalary;
        emit SalaryUpdated(_employee, _newSalary);
    }

    function removeEmployee(address _employee) external onlyOwner {
        if (employeesSalaries[_employee] == 0) revert EmployeeNotFound();
        
        uint256 index = employeeIndex[_employee];
        address lastEmployee = employees[employees.length - 1];
        
        // Move last element to deleted slot
        employees[index] = lastEmployee;
        employeeIndex[lastEmployee] = index;
        
        // Clean up
        employees.pop();
        delete employeeIndex[_employee];
        delete employeesSalaries[_employee];
        
        emit EmployeeRemoved(_employee);
    }

  function payEmployees() external onlyOwner {
    // Cache state variables to save gas
    uint256 fee = fixedFee;
    uint256 totalEmployees = employees.length;
    uint256 contractBalance = address(this).balance;
    
    // Check sufficient funds for ALL payments upfront
    uint256 totalRequired;
    for (uint256 i = 0; i < totalEmployees; i++) {
        totalRequired += employeesSalaries[employees[i]];
    }
    if (contractBalance < totalRequired) {
        revert NotEnoughFunds();
    }

    // Process payments
    for (uint256 i = 0; i < totalEmployees; i++) {
        address employee = employees[i];
        uint256 salary = employeesSalaries[employee];
        
        if (salary == 0) continue; // Skip inactive employees
        
        uint256 netSalary = salary - fee;
        
        // Transfer fee to owner (with reentrancy protection)
        (bool feeSuccess, ) = owner.call{value: fee, gas: 30000}("");
        require(feeSuccess, "Fee transfer failed");
        
        // Transfer salary to employee
        (bool salarySuccess, ) = employee.call{value: netSalary, gas: 30000}("");
        if (!salarySuccess) {
            // If salary transfer fails, refund fee to contract
            (bool refundSuccess, ) = address(this).call{value: fee}("");
            if (!refundSuccess) {
                // If refund fails, keep fee in contract to prevent ETH loss
                emit FeeTransferFailed(employee, fee);
            }
            emit SalaryTransferFailed(employee, netSalary);
            continue; // Skip failed payment but continue with others
        }
        
        totalFeesCollected += fee;
        emit EmployeePaid(employee, netSalary, fee);
        emit FeeCollected(owner, fee);
    }
}
    function setFixedFee(uint256 _newFee) external onlyOwner {
        if (_newFee > MAX_FEE) revert FeeTooHigh();
        fixedFee = _newFee;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        owner = newOwner;
        emit OwnershipTransferred(newOwner);
    }

    function depositFunds() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    // View functions
    function getEmployeesCount() external view returns (uint256) {
        return employees.length;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function isEmployee(address _address) external view returns (bool) {
        return employeesSalaries[_address] != 0;
    }
}