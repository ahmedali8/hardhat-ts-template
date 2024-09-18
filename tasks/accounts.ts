import { task } from "hardhat/config";

import { fromWei } from "../utils/format";

task("accounts", "Prints the list of accounts").setAction(async (_taskArgs, hre) => {
  const { ethers } = hre;
  const accounts = await ethers.getSigners();

  interface AccountsArray {
    address: string;
    balanceInETH: string;
  }
  const accountsArray: Array<AccountsArray> = [];

  for (const account of accounts) {
    const address = account.address;
    const balance = await ethers.provider.getBalance(address);
    const balanceInETH = fromWei(balance);

    accountsArray.push({
      address,
      balanceInETH,
    });
  }

  console.table(accountsArray);
});
