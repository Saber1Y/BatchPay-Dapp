import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  // export const config = createConfig({
  appName: "batch_pay",
  projectId: "batchpay",
  appDescription: "batchpay project",
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
