const hre = require("hardhat");

async function main() {
  const contract = await hre.ethers.deployContract("TestToken");   // Swisstronik need to change your name contract deployed

  await contract.waitForDeployment();

  console.log(`TestToken contract deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});