<template>
   <div class="home">
      <div v-if="loadingState === 'loaded' || !nfts.length"    class="">
          <h1 className="py-10 px-20 text-3xl">No assets owned</h1>
      </div>
      <div v-else class="container movies">
          <div class="movies-grid" style="max-width: 1600px">
            <div v-for="(nft, i) in nfts" :key="i" class="movie">
              <div :key="i" class="movie-img">
                <img :src="`${nft.image}`" width="200px" height="200px" alt="Pic of the author" />
                <div class="p-4 bg-black">
                  <p class="text-2xl mb-4 font-bold text-white">{{nft.price}} ETH</p>
        
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
var item = {}   
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
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      // const provider = await new ethers.providers.JsonRpcProvider()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const account  = await signer.getAddress()

      const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider)
      const tokenContract = new ethers.Contract(nftAdress, NFT.abi, provider)
      // Return array of unsold market items
      const data = await marketContract.fetchMarketItems()

      console.log(63,data)

      let items =[]
      for (let j = 0; j < data.length; j++) { 
      let i = await data[j]
      // const items = await Promise.all(data.map(async (i) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      console.log(69, i)
      const meta = await axios.get(tokenUri)
      // console.log(71, meta.data.image)
      const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      //  console.log(73, seller === account, seller,typeof seller, typeof account)
      if ( i.seller == account) {
        
        item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          sold: i.sold

        }
        console.log(83, await item)
        await items.push(item)
      // return item
      }

        } 
        console.log(88, items)
        this.nfts = items
        this.loadingSate = 'loaded'
    },
  }
}
</script>