"use client";

import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WagmiProvider, useAccount } from "wagmi";
import batchContract from "../Data/Batch.json";
import AddEmployeeForm from "../components/AddEmployeeForm";
import { config } from "./config";

// const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const contractAddress = "0x8a791620dd6260079bf849dc5567adc3f2fdc318";
const abi = batchContract.abi;

const WalletChecker = ({ onConnect }) => {
  const { isConnected } = useAccount();
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      setShowForm(true);
      onConnect();
    } else {
      setShowForm(false);
      router.push("../");
    }
  }, [isConnected, onConnect, router]);

  return (
    <>
      {showForm && (
        <div className="mt-12">
          <AddEmployeeForm contractAddress={contractAddress} abi={abi} />
        </div>
      )}
    </>
  );
};
export default function Home() {
  const queryClient = new QueryClient();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
              <span className="self-center text-2xl font-semibold whitespace-nowrap cursor-pointer dark:text-white">
                BatchPay
              </span>
              <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <ConnectButton />
              </div>
            </div>
          </nav>

          {!isWalletConnected && (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
              <main className="w-full max-w-screen-lg mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  Revolutionize Employee Payments
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  Welcome to BatchPay, the ultimate decentralized application
                  (DApp) designed to streamline payroll processes and cut down
                  on traditional banking costs. With BatchPay, you can pay your
                  employees in one click, ensuring transparency, security, and
                  efficiency.
                </p>

                <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Why BatchPay?
                  </h2>
                  <ul className="list-disc list-inside text-left text-gray-700 mb-6">
                    <li className="mb-2">
                      <strong>Simplified Payroll:</strong> Manage and pay your
                      entire workforce with a single transaction, reducing
                      manual work and minimizing errors.
                    </li>
                    <li className="mb-2">
                      <strong>Cost-Efficient:</strong> Eliminate the need for
                      third-party payment processors and reduce transaction
                      fees.
                    </li>
                    <li className="mb-2">
                      <strong>Transparent & Secure:</strong> Built on the
                      blockchain, BatchPay ensures that every payment is secure
                      and verifiable.
                    </li>
                    <li className="mb-2">
                      <strong>Empower Your Business:</strong> Gain full control
                      over your payroll with smart contracts, reducing
                      dependence on traditional banking systems.
                    </li>
                  </ul>

                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Become a CEO
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Are you ready to take charge? By becoming a CEO on BatchPay,
                    you can:
                  </p>
                  <ul className="list-disc list-inside text-left text-gray-700 mb-8">
                    <li className="mb-2">Add and Manage Employees</li>
                    <li className="mb-2">Execute Payments</li>
                    <li className="mb-2">Monitor Transactions</li>
                  </ul>
                  <p className="text-lg text-gray-700 mb-6">
                    To get started, simply connect your wallet and take the
                    first step towards revolutionizing your payroll process.
                  </p>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    How It Works
                  </h2>
                  <ol className="list-decimal list-inside text-left text-gray-700 mb-6">
                    <li className="mb-2">Connect Your Wallet</li>
                    <li className="mb-2">Add Employees</li>
                    <li className="mb-2">One-Click Payments</li>
                    <li className="mb-2">Track Payments</li>
                  </ol>
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Ready to Start?
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Take control of your payroll now. Connect your wallet to
                    begin your journey as a BatchPay CEO.
                  </p>
                  <ConnectButton className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200" />
                </div>
              </main>
            </div>
          )}

          <WalletChecker onConnect={() => setIsWalletConnected(true)} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
