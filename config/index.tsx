import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, scroll, morph, berachainTestnetbArtio, mantle, soneium, zircuit, rootstock, abstract, viction, monadTestnet, celo, apeChain} from '@reown/appkit/networks'
import { sepolia } from 'viem/chains'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, sepolia, arbitrum, scroll, morph, berachainTestnetbArtio, mantle, soneium, zircuit, rootstock, abstract, viction, monadTestnet, celo, apeChain]

const combinedStorage = createStorage({
  storage: {
    getItem: (key) => {
      const cookieValue = cookieStorage.getItem(key);
      if (cookieValue !== null) return cookieValue;

      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    },
    setItem: (key, value) => {
      cookieStorage.setItem(key, value);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    },
    removeItem: (key) => {
      cookieStorage.removeItem(key);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    },
  },
})

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: combinedStorage,
  ssr: true,
  networks,
  projectId
})

export const config = wagmiAdapter.wagmiConfig
