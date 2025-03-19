
// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "./BatchPay.sol";

error AddressAlreadyExists();

contract FactoryContract {
    event FactoryCreated(address indexed company, address payrollContract);

    mapping(address => address) public companyPayroll; // CEO address -> Payroll contract address

    function createPayrollContract() external {
        if (companyPayroll[msg.sender] != address(0)) {
            revert AddressAlreadyExists();
        }

        BatchPay batch = new BatchPay(msg.sender);
        companyPayroll[msg.sender] = address(batch);

        emit FactoryCreated(msg.sender, address(batch));
    }

        function getCompanyPayroll(address _company) external view returns (address) {
        return companyPayroll[_company];
    }
}
