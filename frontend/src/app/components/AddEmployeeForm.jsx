import React, { useState } from "react";
import { useWriteContract } from "wagmi";

const AddEmployeeForm = ({ contractAddress, abi }) => {
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [salary, setSalary] = useState("");

  // Prepare contract write operation
  const { write, isLoading, isSuccess, error } = useWriteContract({
    address: contractAddress,
    abi: abi,
    functionName: "addEmployee",
    args: [employeeAddress, salary],
  });

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const tx = await write?.(); // Execute the write operation
      await tx.wait(); // Wait for the transaction to be mined
      alert("Employee added successfully!");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee.");
    }
  };

  return (
    <form
      onSubmit={handleAddEmployee}
      className="space-y-4 mx-auto my-5 w-[400px]"
    >
      <div>
        <label
          htmlFor="employeeAddress"
          className="block text-[18px] font-medium text-white"
        >
          Employee Address
        </label>
        <input
          type="text"
          id="employeeAddress"
          value={employeeAddress}
          onChange={(e) => setEmployeeAddress(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none"
          placeholder="0x..."
          required
        />
      </div>
      <div>
        <label
          htmlFor="salary"
          className="block text-[18px] font-medium text-white"
        >
          Salary (ETH)
        </label>
        <input
          type="number"
          step="0.01"
          id="salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none "
          placeholder="0.0"
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Employee"}
      </button>
      {error && <p className="text-red-600 mt-2">Error: {error.message}</p>}
    </form>
  );
};

export default AddEmployeeForm;
