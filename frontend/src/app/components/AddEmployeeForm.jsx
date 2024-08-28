import React, { useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

const AddEmployeeForm = () => {
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [salary, setSalary] = useState("");

  const handleAddEmployee = (e) => {
    e.preventDefault();
    write?.();
  };

  return (
    <form
      onSubmit={handleAddEmployee}
      className="mx-auto my-5 space-y-4 w-[400px]"
    >
      <div>
        <label
          htmlFor="employeeAddress"
          className="block text-sm font-medium text-white"
        >
          Employee Address
        </label>
        <input
          type="text"
          id="employeeAddress"
          value={employeeAddress}
          onChange={(e) => setEmployeeAddress(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="0x..."
          required
        />
      </div>
      <div>
        <label
          htmlFor="salary"
          className="block text-sm font-medium text-white"
        >
          Salary (ETH)
        </label>
        <input
          type="number"
          step="0.01"
          id="salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="0.0"
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Employee
      </button>
    </form>
  );
};

export default AddEmployeeForm;
