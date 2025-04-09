import { useState } from "react";
import React from 'react'

const TransactionHistory = () => {
    const [events, setEvents] = useState<Array<any>>([]);

    const renderEvent = (event: any) => {
      switch (event.eventType || event.eventName) {
        case "EmployeePaid":
          return (
            <li key={event.transactionHash} className="py-2">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>
                  Paid <span className="font-mono">{event.args.employee.slice(0, 6)}...{event.args.employee.slice(-4)}</span>: 
                  <span className="font-bold ml-1">{formatEther(event.args.netAmount)} ETH</span>
                  <span className="text-gray-400 ml-2">(Fee: {formatEther(event.args.feeAmount)} ETH)</span>
                </span>
              </div>
            </li>
          );
  
        case "EmployeeAdded":
          return (
            <li key={event.transactionHash} className="py-2">
              <div className="flex items-center">
                <UserAddIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span>
                  Added employee <span className="font-mono">{event.args.employee.slice(0, 6)}...{event.args.employee.slice(-4)}</span>
                  <span className="text-gray-400 ml-2">(Salary: {formatEther(event.args.amount)} ETH)</span>
                </span>
              </div>
            </li>
          );
  
        // Add cases for other event types...
  
        default:
          return null;
      }
    };
    
        return (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <ul className="space-y-2">
              {events.length > 0 ? (
                [...events].reverse().map(renderEvent)
              ) : (
                <li className="text-gray-400">No transactions yet</li>
              )}
            </ul>
          </div>
        );
      };


export default TransactionHistory
