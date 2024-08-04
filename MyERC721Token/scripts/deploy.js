const hre = require("hardhat");

async function main() {
  const contract = await hre.ethers.deployContract("MyERC721Token");

  await contract.waitForDeployment();

  console.log(`MyERC721Token contract deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});