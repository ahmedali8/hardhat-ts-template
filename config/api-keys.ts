import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

import { NetworkName } from "./networks";

dotenvConfig({ path: resolve(__dirname, "../.env") });

export const API_KEYS: string | Record<string, string> | undefined = {
  // ETHEREUM
  [NetworkName.MAINNET]: process.env.ETHERSCAN_API_KEY || "",
  [NetworkName.KOVAN]: process.env.ETHERSCAN_API_KEY || "",
  [NetworkName.GOERLI]: process.env.ETHERSCAN_API_KEY || "",
  [NetworkName.RINKEBY]: process.env.ETHERSCAN_API_KEY || "",
  [NetworkName.ROPSTEN]: process.env.ETHERSCAN_API_KEY || "",

  // BINANCE SMART CHAIN
  [NetworkName.BSC]: process.env.BSCSCAN_API_KEY || "",
  [NetworkName.BSC_TESTNET]: process.env.BSCSCAN_API_KEY || "",

  // MATIC/POLYGON
  [NetworkName.POLYGON_MAINNET]: process.env.POLYGONSCAN_API_KEY || "",
  [NetworkName.POLYGON_MUMBAI]: process.env.POLYGONSCAN_API_KEY || "",

  // OPTIMISM
  [NetworkName.OPTIMISM_MAINNET]: process.env.OPTIMISM_API_KEY || "",
  [NetworkName.OPTIMISM_KOVAN]: process.env.OPTIMISM_API_KEY || "",

  // ARBITRUM
  [NetworkName.ARBITRUM_MAINNET]: process.env.ARBISCAN_API_KEY || "",
  [NetworkName.ARBITRUM_RINKEBY]: process.env.ARBISCAN_API_KEY || "",

  // AVALANCHE
  [NetworkName.AVALANCHE_MAINNET]: process.env.SNOWTRACE_API_KEY || "",
  [NetworkName.FUJI_AVALANCHE]: process.env.SNOWTRACE_API_KEY || "",

  // FANTOM
  [NetworkName.FANTOM_MAINNET]: process.env.FANTOM_API_KEY || "",
  [NetworkName.FANTOM_TESTNET]: process.env.FANTOM_API_KEY || "",
};
