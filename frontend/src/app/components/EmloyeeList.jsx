import React, { useState } from "react";
import useContractRead from "wagmi";

const EmployeeList = ({ contractAddress, abi }) => {
  const [employeeAddress, setEmployeeAddress] = useState("");

  const { data: employeeList } = useContractRead({
    abi: abi,
    address: contractAddress,
    functionName: 'getEmployeesList',
  });

  const { data: employeeSalaries } = useContractRead({
    abi: abi,
    address: contractAddress,
    functionName: 'getEmployeesList',
  });

  return (
  <div>

  </div>
  );
};

export default EmployeeList;
