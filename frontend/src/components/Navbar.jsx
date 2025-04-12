import React from 'react';
import { useBalance } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = ({ contractAddress, abi }) => {

    const {data: contractBalance} = useBalance({
        address: contractAddress,
        watch: true,
    })

  return (
         <nav className="bg-white border-gray-200 dark:bg-gray-900">
                  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap cursor-pointer dark:text-white">
                      BatchPay
                    </span>

                    <div>
                    <p className="text-xl font-semibold text-white">
      {contractBalance ? `${contractBalance.formatted} ${contractBalance.symbol}` : "Loading..."}
    </p>
                    </div>
                 
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                      <ConnectButton />
                    </div>
                  </div>
                </nav>
 
  )
}

export default Navbar
