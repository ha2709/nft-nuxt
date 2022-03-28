<template>
  <div class='home'>
    <nav class="border-b p-6">
      <p class="text-4xl font-bold">Partnerverse NFT Market</p>
      <div class="flex mt-4"></div>
      <NuxtLink class="link" to="/">
         Home
      </NuxtLink >
      <NuxtLink class="link" to="/create-item">
        Sell NFT
      </NuxtLink >
      <NuxtLink class="link" to="/my-asset">
        My NFT
      </NuxtLink >
      <NuxtLink  class="link" to="/creator-dashboard">
        Dashboard
      </NuxtLink >
    </nav>
    <!-- <button id="connect" class='primaryButton' @click='connectWallet'>Connect Wallet</button> -->
    <div>
      <h1>Welcome to Home!</h1>
    </div>
    <div class="flex justify-center">
      <div class="px-4" style="max-width: 1600px">
        <div v-for="(nft, i) in nfts" :key="i" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div :key="i" class="border shadow-transparent rounded-xl overflow-hidden">
            <img :src="`${nft.image}`" width="500" height="500" alt="Pic of the author" />
            <div class="p-4">
              <p class="text-2xl font-semibold" style="height: '64px'">
                {{nft.name}}
              </p>
              <div style="height:70px, overflow:hidden">
                <p class="text-gray-400">{{nft.description}}</p>
              </div>
            </div>
            <div class="p-4 bg-black">
              <p class="text-2xl mb-4 font-bold text-white">{{nft.price}} ETH</p>
              <button class="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                    onclick="() =>{buyNFT(nft)}"
              >Buy NFT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/main.css'
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftAdress, nftMarketAddress } from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
export default {
  name: 'IndexPage',

  data () {
    return {
      currentAccount: null,
      contractAddress: 'set this to your contract address, if ss)',
      nfts: []
    }
  },
  async fetch () {
    await this.loadNFTs()
  },
  methods: {
    async loadNFTs () {
      const provider = await new ethers.providers.JsonRpcProvider()
      const tokenContract = await new ethers.Contract(nftAdress, NFT.abi, provider)
      const marketContract = await new ethers.Contract(nftMarketAddress, Market.abi, provider)

      // Return array of unsold market items
      const data = await marketContract.fetchMarketItems()
      // console.log(78, data)
      const items = await Promise.all(data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        console.log(81, tokenUri)
        const meta = await axios.get(tokenUri)
        console.log(82, meta.data.image)
        const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        }
        return item
      }))
      this.nfts = items
    },
    async buyNFT (nft) {
      const web3modal = new Web3Modal()
      const connection = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      // sign the transaction
      const signer = provider.getSigner()
      const contract = ethers.Contract(nftMarketAddress, Market.abi, signer)
      // set price
      const price = ethers.utils.formatUnits(nft.price.toString(), 'ether')
      const transaction = await contract.createMarketSale(nftAdress, nft.tokenId, {
        value: price
      })
      await transaction.wait()
      this.loadNFTs()
    },
    // async connectWallet () {
    //   // loadNFTs()
    //   try {
    //     if (typeof window !== 'undefined') {
    //       console.log('You are on the browser')
    //       // ✅ Can use window here
    //     } else {
    //       console.log('You are on the server')
    //       // ⛔️ Don't use window here
    //     }

    //     const { ethereum } = window

    //     if (!ethereum) {
    //       alert('Get MetaMask!')
    //       return
    //     }

    //     const accounts = await ethereum.request({
    //       method: 'eth_requestAccounts'
    //     })

    //     // eslint-disable-next-line no-console
    //     console.log('Connected', accounts[0])
    //     document.getElementById('connect').innerHTML = accounts[0]
    //     this.currentAccount = accounts[0]
    //   } catch (error) {
    //     // eslint-disable-next-line no-console
    //     console.log(error)
    //   }
    // }
  }
}
</script>
