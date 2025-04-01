// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./BatchPay.sol";

error AddressAlreadyExists();
error UnAuthorized();
error InvalidAddress();
contract FactoryContract {
    address public admin;

    event FactoryCreated(
        address indexed company,
        address payrollContract,
        uint256 timestamp
    );

    constructor() {
        admin = msg.sender;
    }

    mapping(address => bool) public approvedCompanies;
    mapping(address => address) public companyPayroll; // CEO address -> Payroll contract address

    function approveCompany(address _company) external {
        if (msg.sender != admin) revert UnAuthorized();
        if (_company == address(0)) revert InvalidAddress();
        approvedCompanies[_company] = true;
    }

    function createPayrollContract() external {
        if (!approvedCompanies[msg.sender]) revert UnAuthorized();
        if (companyPayroll[msg.sender] != address(0)) {
            revert AddressAlreadyExists();
        }

        BatchPay batch = new BatchPay(msg.sender);
        companyPayroll[msg.sender] = address(batch);

        emit FactoryCreated(msg.sender, address(batch), block.timestamp);
    }

    function getCompanyPayroll(
        address _company
    ) external view returns (address) {
        return companyPayroll[_company];
    }
}
