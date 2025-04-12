'use client'
import { useState } from 'react'
import { formatEther } from 'viem'
import { useWatchContractEvent } from 'wagmi'

type ContractEvent = {
  eventName: 'EmployeePaid' | 'EmployeeAdded'
  args: {
    employee?: `0x${string}`
    amount?: bigint
  }
  transactionHash: string
}

export default function TransactionHistory({ 
  abi, 
  contractAddress 
}: { 
  abi: any
  contractAddress: `0x${string}` 
}) {
  const [events, setEvents] = useState<ContractEvent[]>([])

  // Debug logs
//   console.log('TransactionHistory mounted', { abi, contractAddress })

  useWatchContractEvent({
    abi,
    address: contractAddress,
    eventName: ["EmployeePaid", "EmployeeAdded"],
    onLogs: (logs) => {
      console.log('New logs received:', logs)
      setEvents(prev => [
        ...prev,
        ...logs.map(log => ({
          ...log,
          eventName: log.eventName as 'EmployeePaid' | 'EmployeeAdded',
          args: {
            employee: log.args?.employee,
            amount: log.args?.amount || (log.args as any)?.netAmount
          }
        }))
      ])
    },
    onError: (error) => {
      console.error('Event error:', error)
    },
    poll: true,
  })

  const formatAddress = (address?: `0x${string}`) => {
    if (!address) return 'Unknown'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-3">Transaction History</h3>
      
      {events.length === 0 ? (
        <p className="text-gray-500">No transactions yet</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event, index) => (
            <li key={`${event.transactionHash}-${index}`} className="p-3 bg-white rounded shadow-sm">
              {event.eventName === "EmployeePaid" ? (
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    Paid {formatEther(event.args.amount || 0n)} ETH to {formatAddress(event.args.employee)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">+</span>
                  <span>
                    Added employee {formatAddress(event.args.employee)}
                  </span>
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                TX: {event.transactionHash.slice(0, 10)}...
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}