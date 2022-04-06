import { ethers } from "hardhat";

import { deployContract } from "../utils/contracts";
import { toWei } from "../utils/format";
import { getExtraGasInfo } from "../utils/misc";
import { verifyContract } from "../utils/verify";

async function main() {
  const { chainId } = await ethers.provider.getNetwork();
  const [owner] = await ethers.getSigners();

  const args = [
    "testing new created token",
    "TCT",
    toWei("6000000"),
    owner.address,
  ];
  const contract = await deployContract({
    signer: owner,
    contractName: "TestingContract",
    args: args,
  });

  /*
  // If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const contract = await deployContract({
    signer: owner,
    contractName: "TestingContract",
    args: args,
    overrides: {
      value: toWei("1"), // send 1 ether
    },
  });
  */

  /*
  // Mint 100 tokens for user
  const [_, user] = await ethers.getSigners();
  const tx = await contract.connect(user).mint(user.address, toWei("100"));
  const extraGasInfo = await getExtraGasInfo(tx);
  console.log("Minting: ", extraGasInfo);
  */

  // You don't want to verify on localhost
  try {
    if (chainId != 31337 && chainId != 1337) {
      await verifyContract({
        contractName: "TestingContract",
        contractAddress: contract.address,
        args: args,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
