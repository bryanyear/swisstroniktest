const hre = require("hardhat");

const { encryptDataField } = require("@swisstronik/utils");  

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;

  const [encryptedData] = await encryptDataField(rpcLink, data);

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = "0x8A364F04e63eABc53597A929F6A956d686EA0680";  

  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory("TestToken");  
  const contract = contractFactory.attach(contractAddress);

  const functionName = "mint";
  const mintTx = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(functionName),
    0
  );

  await mintTx.wait();

  console.log("The receipt: ", mintTx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});