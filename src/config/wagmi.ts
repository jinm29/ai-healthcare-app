import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  bsc,
  polygon,
  avalanche,
  moonbeam,
  fantom,
  optimism,
  base,
} from 'viem/chains';
import { http } from 'wagmi';

// Custom chains
const evmos = {
  id: 9001,
  name: 'EVMOS',
  nativeCurrency: {
    decimals: 18,
    name: 'EVMOS',
    symbol: 'EVMOS',
  },
  rpcUrls: {
    default: { http: ['https://evmos-evm.publicnode.com'] },
    public: { http: ['https://evmos-evm.publicnode.com'] },
  },
  blockExplorers: {
    default: { name: 'EVMOS Explorer', url: 'https://escan.live' },
  },
} as const;

const pulsechain = {
  id: 369,
  name: 'PulseChain',
  nativeCurrency: {
    decimals: 18,
    name: 'Pulse',
    symbol: 'PLS',
  },
  rpcUrls: {
    default: { http: ['https://rpc.pulsechain.com'] },
    public: { http: ['https://rpc.pulsechain.com'] },
  },
  blockExplorers: {
    default: { name: 'PulseScan', url: 'https://scan.pulsechain.com' },
  },
} as const;

const ethereumPoW = {
  id: 10001,
  name: 'Ethereum PoW',
  nativeCurrency: {
    decimals: 18,
    name: 'ETHW',
    symbol: 'ETHW',
  },
  rpcUrls: {
    default: { http: ['https://mainnet.ethereumpow.org'] },
    public: { http: ['https://mainnet.ethereumpow.org'] },
  },
  blockExplorers: {
    default: { name: 'ETHW Explorer', url: 'https://mainnet.ethwscan.com' },
  },
} as const;

const dogechain = {
  id: 2000,
  name: 'Dogechain',
  nativeCurrency: {
    decimals: 18,
    name: 'Dogecoin',
    symbol: 'DOGE',
  },
  rpcUrls: {
    default: { http: ['https://rpc.dogechain.dog'] },
    public: { http: ['https://rpc.dogechain.dog'] },
  },
  blockExplorers: {
    default: { name: 'Dogechain Explorer', url: 'https://explorer.dogechain.dog' },
  },
} as const;

const okxChain = {
  id: 66,
  name: 'OKX Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'OKT',
    symbol: 'OKT',
  },
  rpcUrls: {
    default: { http: ['https://exchainrpc.okex.org'] },
    public: { http: ['https://exchainrpc.okex.org'] },
  },
  blockExplorers: {
    default: { name: 'OKLink', url: 'https://www.oklink.com/okc' },
  },
} as const;

export const config = getDefaultConfig({
  appName: 'XEN Calendar',
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '2c9e8e45d8e6f4a3b7c1d9e2a5f8b3c7', // Get from https://cloud.walletconnect.com
  chains: [
    mainnet,
    bsc,
    polygon,
    avalanche,
    moonbeam,
    fantom,
    optimism,
    base,
    evmos,
    pulsechain,
    ethereumPoW,
    dogechain,
    okxChain,
  ],
  transports: {
    [mainnet.id]: http('https://ethereum-rpc.publicnode.com', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [bsc.id]: http('https://bsc-rpc.publicnode.com', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [polygon.id]: http('https://polygon-rpc.com', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [avalanche.id]: http('https://avalanche-c-chain-rpc.publicnode.com', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [moonbeam.id]: http('https://moonbeam-rpc.publicnode.com', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [fantom.id]: http('https://fantom-rpc.publicnode.com', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [optimism.id]: http('https://optimism-rpc.publicnode.com', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [base.id]: http('https://base-rpc.publicnode.com', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [evmos.id]: http('https://evmos-evm.publicnode.com', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [pulsechain.id]: http('https://rpc.pulsechain.com', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [ethereumPoW.id]: http('https://mainnet.ethereumpow.org', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [dogechain.id]: http('https://rpc.dogechain.dog', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [okxChain.id]: http('https://exchainrpc.okex.org', {
      batch: true,
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
}); 