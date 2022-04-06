import { getAddress, isAddress } from "@ethersproject/address";
import { TransactionRequest } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import { Signer } from "ethers";
import { task } from "hardhat/config";
import { HardhatEthersHelpers } from "hardhat/types";

type Ethers = typeof import("ethers/lib/ethers") & HardhatEthersHelpers;

const DEBUG = false;

function debug(text: string): void {
  if (DEBUG) {
    console.log(text);
  }
}

const findFirstAddr = async (ethers: Ethers, addr: string): Promise<string> => {
  if (isAddress(addr)) {
    return getAddress(addr);
  }
  const accounts = await ethers.provider.listAccounts();
  if (accounts !== undefined) {
    const temp: string | undefined = accounts.find((f: string) => f === addr);
    if (temp != null && ethers.utils.isAddress(temp)) return temp[0];
  }
  throw new Error(`Could not normalize address: ${addr}`);
};

task("send", "Send ETH")
  .addParam("from", "From address or account index")
  .addOptionalParam("to", "To address or account index")
  .addOptionalParam("amount", "Amount to send in ether")
  .addOptionalParam("data", "Data included in transaction")
  .addOptionalParam("gasPrice", "Price you are willing to pay in gwei")
  .addOptionalParam("gasLimit", "Limit of how much gas to spend")
  .setAction(
    async (
      taskArgs: {
        to?: string;
        from: string;
        amount?: string;
        gasPrice?: string;
        gasLimit?: number;
        data?: any;
      },
      { network, ethers }
    ) => {
      const from = await findFirstAddr(ethers, taskArgs.from);
      debug(`Normalized from address: ${from}`);
      const fromSigner = ethers.provider.getSigner(from);

      let to;
      if (taskArgs.to != null) {
        to = await findFirstAddr(ethers, taskArgs.to);
        debug(`Normalized to address: ${to}`);
      }

      const txRequest: TransactionRequest = {
        from: await fromSigner.getAddress(),
        to,
        value: parseUnits(
          taskArgs.amount != null ? taskArgs.amount : "0",
          "ether"
        ).toHexString(),
        nonce: await fromSigner.getTransactionCount(),
        gasPrice: parseUnits(
          taskArgs.gasPrice != null ? taskArgs.gasPrice : "1.001",
          "gwei"
        ).toHexString(),
        gasLimit: taskArgs.gasLimit != null ? taskArgs.gasLimit : 24000,
        chainId: network.config.chainId,
      };

      if (taskArgs.data != null) {
        txRequest.data = taskArgs.data;
        debug(`Adding data to payload: ${txRequest.data}`);
      }
      debug(`${(txRequest.gasPrice as any) / 1000000000} gwei`);
      debug(JSON.stringify(txRequest, null, 2));

      return await (fromSigner as Signer).sendTransaction(txRequest);
    }
  );
