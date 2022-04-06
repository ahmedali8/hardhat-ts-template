import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chalk from "chalk";
import { Contract, ContractFactory, Signer } from "ethers";
import { ethers } from "hardhat";
import { Libraries } from "hardhat/types";

import { writeFile } from "./files";
import { abiEncodeArgs, fromWei } from "./format";
import { etherBalance, getExtraGasInfo } from "./misc";

const { getContractAt, getContractFactory } = ethers;

export async function getContractIns(
  contractNameOrAbi: string | any[],
  address: string,
  signer: Signer
): Promise<Contract> {
  return await getContractAt(contractNameOrAbi, address, signer);
}

interface DeployContract {
  signer: SignerWithAddress;
  contractName: string;
  args: Array<any>;
  overrides?: {};
  libraries?: Libraries | {};
}

export async function deployContract({
  signer,
  contractName,
  args = [],
  overrides,
  libraries,
}: DeployContract): Promise<Contract> {
  const { chainId, name } = await ethers.provider.getNetwork();
  const ethBalance = await etherBalance(signer.address);

  console.log(
    ` 🛰  Deploying: ${chalk.cyan(
      contractName
    )} to Network: ${name} & ChainId: ${chainId}`
  );
  console.log(
    ` 🎭 Deployer: ${chalk.cyan(signer.address)}, Balance: ${chalk.grey(
      fromWei(ethBalance ?? 0)
    )} ETH`
  );

  const contractArtifacts: ContractFactory = await getContractFactory(
    contractName,
    {
      libraries: libraries,
    }
  );
  const contract = await contractArtifacts
    .connect(signer)
    .deploy(...args, overrides);
  await contract.deployed();

  let extraGasInfo = "";
  if (contract && contract.deployTransaction) {
    extraGasInfo = (await getExtraGasInfo(contract.deployTransaction)) ?? "";
  }

  console.log(
    " 📄",
    chalk.cyan(contractName),
    "deployed to:",
    chalk.magenta(contract.address)
  );
  console.log(" ⛽", chalk.grey(extraGasInfo));

  const encoded = abiEncodeArgs(contract, args);
  if (!encoded || encoded.length <= 2) return contract;
  await writeFile(`artifacts/${contractName}.address`, contract.address);
  await writeFile(`artifacts/${contractName}.args`, encoded.slice(2));

  // await tenderly.persistArtifacts({
  //   name: contractName,
  //   address: contract.address,
  // });

  return contract;
}
