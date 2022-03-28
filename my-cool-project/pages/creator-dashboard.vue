<template>
    <div>
        <div v-if="loadingState === 'loaded' || !nfts.length"    class="">
            <h1 className="py-10 px-20 text-3xl">No assets owned</h1>
        </div>
        <div class="flex justify-center">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                <div  v-for="(nft, i) in nfts" :key="i" 
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    <div :key="i" class="border shadow-transparent rounded-xl overflow-hidden">
                        <img :src="`${nft.image}`" width="500" height="500" alt="Pic of the author" />
              
                        <div class="p-4 bg-black">
                            <p class="text-2xl mb-4 font-bold text-white">{{nft.price}} ETH</p>
                            <button class="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                                    onclick="() =>{buyNFT(nft)}">Buy NFT</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { nftAdress, nftMarketAddress } from '../config'
import '@/assets/css/main.css'
import { ethers } from 'ethers'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { EtherscanProvider } from '@ethersproject/providers'
import axios from 'axios';
import Web3Modal from 'web3modal'

export default {
  name: 'CreatorDashBoardPage',
  data () {
    return {
      currentAccount: null,
      contractAddress: 'set this to your contract address, if ss)',
      nfts: [],
      loadingState: 'not-loaded'

    }
  },
  async fetch () {
      await this.loadNFTs()
  },
  methods: {
    async loadNFTs () {
    //   const we3Modal = new Web3Modal()
    //   const connection = await web3Modal.connect()
      const provider = await new ethers.providers.JsonRpcProvider()
    //   const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()


    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider)
    const tokenContract = new ethers.Contract(nftAdress, NFT.abi, provider)
    // Return array of unsold market items
    const data = await marketContract.fetchMyNFTs()
    console.log(63, data)
    const items = await Promise.all(data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        console.log(69, tokenUri)
        const meta = await axios.get(tokenUri)
        // console.log(71, meta.data.image)
        const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        //   name: meta.data.name,
        //   description: meta.data.description
        }
        return item
      }))
      this.nfts = items
      this.loadingSate = 'loaded'
    },
  }
}
</script>