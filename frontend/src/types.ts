interface ContractEvent {
    eventName: string;
    args: {
      employee?: string;
      amount?: bigint;
      netAmount?: bigint;
      feeAmount?: bigint;
      newSalary?: bigint;
      // Add other event args as needed
    };
    transactionHash: string;
    blockNumber: bigint;
    eventType?: string;
  }