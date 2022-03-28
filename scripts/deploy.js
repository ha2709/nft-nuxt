// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
// const { nftmarketaddress } = require("../front_end/config");
const fs = require('fs');
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();

  await nftMarket.deployed();
  const marketAddress = nftMarket.address;

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketAddress);

  await nft.deployed();

  console.log(marketAddress,"NFT deployed to:", nft.address);
  let config = `
export const nftMarketAddress = '${nftMarket.address}'
export const nftAdress = '${nft.address}'
`

let data = JSON.stringify(config)
fs.writeFileSync('./front_end/config.js', JSON.parse(data))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
