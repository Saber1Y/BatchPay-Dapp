import React, { useState, useEffect } from "react";
import {
  useWriteContract,
  useReadContract,
  useWatchContractEvent,
} from "wagmi";

const AddEmployeeForm = ({ contractAddress, abi }) => {
  
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [salary, setSalary] = useState("");
  const [employees, setEmployees] = useState([]);
  // const [events, setEvents] = useState([]);

  // Hook for adding an employee
  const {
    write: addEmployeeWrite,
    isLoading: isAdding,
    error: addError,
  } = useWriteContract({
    address: contractAddress,
    abi: abi,
    functionName: "addEmployee",
    args: [employeeAddress, salary],
    overrides: {
      gasLimit: 1000000,
    },
  });

  // Hook for getting the owner's balance
  const { data: ownerBalance, isLoading: balanceLoading } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: "getOwnersBalance",
  });

  // Hook for removing an employee
  const {
    write: removeEmployeeWrite,
    isLoading: isRemoving,
    error: removeError,
  } = useWriteContract({
    address: contractAddress,
    abi: abi,
    functionName: "removeEmployee",
  });

  const {
    write: makeEmployeePayment,
    isLoading: pendingPayment,
    error: paymentError,
  } = useWriteContract({
    address: contractAddress,
    abi: abi,
    functionName: "payEmployees",
  });

  useEffect(() => {
    if (ownerBalance) {
      console.log("Deployer's balance:", ownerBalance.toString(), "ETH");
    }
  }, [ownerBalance]);

  useEffect(() => {
    const savedEmployees = localStorage.getItem("employees");
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await addEmployeeWrite?.();
      alert("Employee added successfully!");

      const updatedEmployees = [
        ...employees,
        { address: employeeAddress, salary },
      ];
      setEmployees(updatedEmployees);

      // Save to local storage
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));

      setEmployeeAddress("");
      setSalary("");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert(`Failed to add employee: ${error.message || "Unknown error"}`);
    }
  };

  const handleDeleteEmployee = async (indexToDelete) => {
    const employeeToDelete = employees[indexToDelete];

    try {
      await removeEmployeeWrite?.({
        args: [employeeToDelete.address],
      });
      alert("Employee removed successfully on-chain!");
      setEmployees(employees.filter((_, index) => index !== indexToDelete));
    } catch (error) {
      console.error("Error removing employee:", error);
      alert(`Failed to remove employee: ${error.message || "Unknown error"}`);
    }
  };

  const handleModifyEmployee = (indexToModify) => {
    const employeeToModify = employees[indexToModify];
    setEmployeeAddress(employeeToModify.address);
    setSalary(employeeToModify.salary);
    handleDeleteEmployee(indexToModify);
  };

  const handlePaymentEmployee = async () => {
    try {
      await makeEmployeePayment?.();
      alert("Successfully made payment");
    } catch (error) {
      console.error("Error processing payments:", error);
      alert(`Failed to process payments: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="container mx-auto py-4">
      <h2 className="text-xl font-semibold mb-4">Employee List</h2>
      <form onSubmit={handleAddEmployee}>
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
        <div className="my-3">
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
            className="mt-1 block w-full px-3 py-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none"
            placeholder="0.0"
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isAdding}
        >
          {isAdding ? "Adding..." : "Add Employee"}
        </button>
        {addError && (
          <p className="text-red-600 mt-2">Error: {addError.message}</p>
        )}
      </form>

      {employees.length > 0 && (
        <>
          <table className="min-w-full bg-white text-black mt-5 rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
                  Employee Address
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
                  Salary (ETH)
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-3 px-6 text-sm text-gray-900">
                    {employee.address}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    {employee.salary}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    <button
                      onClick={() => handleModifyEmployee(index)}
                      className="text-white bg-blue-500 rounded hover:text-blue-700 mr-2 border px-2 py-2"
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(index)}
                      className="text-white bg-red-500 rounded hover:text-blue-700 mr-2 border px-2 py-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6">
            <button
              onClick={handlePaymentEmployee}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={pendingPayment}
            >
              {pendingPayment ? "Processing..." : "Pay Employees"}
            </button>
            {paymentError && (
              <p className="text-red-600 mt-2">Error: {paymentError.message}</p>
            )}
          </div>
        </>
      )}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Event Log</h3>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
