const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedQuery = async (provider, destination, data) => {
  const rpcLink = hre.network.config.url;

  const [encryptedData, usedEncryptionKey] = await encryptDataField(rpcLink, data);

  const response = await provider.call({
    to: destination,
    data: encryptedData,
  });

  return await decryptNodeResponse(rpcLink, response, usedEncryptionKey);
};

async function main() {
  const contractAddress = "0x2573164703CB5aA3bC2469393fBBa55483699c22";

  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory("MyERC721Token"); 
  const contract = contractFactory.attach(contractAddress);

  const functionName = "balanceOf";
  const functionArgs = ["0x4D74813553fc00fdd823E0BC6dB272d8B9BA590F"];
  const responseMessage = await sendShieldedQuery(signer.provider, contractAddress, contract.interface.encodeFunctionData(functionName, functionArgs));

  console.log("Decoded response:", contract.interface.decodeFunctionResult(functionName, responseMessage)[0].toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
