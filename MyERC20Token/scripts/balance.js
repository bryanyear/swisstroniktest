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
  const contractAddress = "0x8A364F04e63eABc53597A929F6A956d686EA0680";  
  const userAddress = "0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1"; 

  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory("TestToken");  
  const contract = contractFactory.attach(contractAddress); 

  try {
    const balanceFunctionName = "balanceOf";
    const balanceFunctionArgs = [userAddress];
    const balanceResponseMessage = await sendShieldedQuery(
      signer.provider,
      contractAddress,
      contract.interface.encodeFunctionData(balanceFunctionName, balanceFunctionArgs)
    );

    const balanceBigInt = contract.interface.decodeFunctionResult(balanceFunctionName, balanceResponseMessage)[0];
    
    const balanceInUnits = Number(balanceBigInt) / (10 ** 18);

    const formattedBalance = balanceInUnits.toString().replace(/(\.[0-9]*[1-9])0+$/, '$1');

    console.log(`Balance of ${userAddress}: ${formattedBalance}`);

    const nameFunctionName = "name";
    const nameResponseMessage = await sendShieldedQuery(
      signer.provider,
      contractAddress,
      contract.interface.encodeFunctionData(nameFunctionName, [])
    );

    const name = contract.interface.decodeFunctionResult(nameFunctionName, nameResponseMessage)[0];
    console.log(`Name: ${name}`);

    const symbolFunctionName = "symbol";
    const symbolResponseMessage = await sendShieldedQuery(
      signer.provider,
      contractAddress,
      contract.interface.encodeFunctionData(symbolFunctionName, [])
    );

    const symbol = contract.interface.decodeFunctionResult(symbolFunctionName, symbolResponseMessage)[0];
    console.log(`Symbol: ${symbol}`);
    
  } catch (error) {
    console.error("Error: ", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});