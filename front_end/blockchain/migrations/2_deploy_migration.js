var NFT = artifacts.require("NFT");
var NFTMarket = artifacts.require("NFTMarket");

module.exports = async function(deployer, accounts) {
  // deployment steps
  
  await deployer.deploy(NFTMarket);
  const deployedMarket = await NFTMarket.deployed();
  const marketAddress = deployedMarket.address;
  await deployer.deploy(NFT, marketAddress);
};