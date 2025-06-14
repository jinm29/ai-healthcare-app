export interface ChainConfig {
  name: string;
  xenftContract: string;
  xenContract: string;
  cointoolContract?: string;
  chainId: number;
}

export const CHAINS: Record<string, ChainConfig> = {
  Ethereum: {
    name: 'Ethereum',
    xenftContract: '0x0a252663DBCc0b073063D6420a40319e438Cfa59',
    xenContract: '0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8',
    cointoolContract: '0x0de8bf93da2f7eecb3d9169422413a9bef4ef628',
    chainId: 1
  },
  BSC: {
    name: 'BSC',
    xenftContract: '0x1Ac17FFB8456525BfF46870bba7Ed8772ba063a5',
    xenContract: '0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e',
    cointoolContract: '0x7ff11e5b256c9EB67F4dEa2FacECEd5De1CD691F',
    chainId: 56
  },
  Polygon: {
    name: 'Polygon',
    xenftContract: '0x726bB6aC9b74441Eb8FB52163e9014302D4249e5',
    xenContract: '0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e',
    cointoolContract: '0xdf6fEE057222d2F7933C215C11e5150bD2efc53E',
    chainId: 137
  },
  Avalanche: {
    name: 'Avalanche',
    xenftContract: '0x94d9E02D115646DFC407ABDE75Fa45256D66E043',
    xenContract: '0xC0C5AA69Dbe4d6DDdfBc89c0957686ec60F24389',
    cointoolContract: '0x9Ec1C3DcF667f2035FB4CD2eB42A1566fd54d2B7',
    chainId: 43114
  },
  'Ethereum POW': {
    name: 'Ethereum POW',
    xenftContract: '0x94d9E02D115646DFC407ABDE75Fa45256D66E043',
    xenContract: '0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e',
    cointoolContract: '0x3f551334112f5E0FC134A9027A2eA2EFebfB6127',
    chainId: 10001
  },
  Moonbeam: {
    name: 'Moonbeam',
    xenftContract: '0x94d9E02D115646DFC407ABDE75Fa45256D66E043',
    xenContract: '0xb564A5767A00Ee9075cAC561c427643286F8F4E1',
    cointoolContract: '0x9Ec1C3DcF667f2035FB4CD2eB42A1566fd54d2B7',
    chainId: 1284
  },
  EVMOS: {
    name: 'EVMOS',
    xenftContract: '0x4c4CF206465AbFE5cECb3b581fa1b508Ec514692',
    xenContract: '0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e',
    cointoolContract: '0x9Ec1C3DcF667f2035FB4CD2eB42A1566fd54d2B7',
    chainId: 9001
  },
  Fantom: {
    name: 'Fantom',
    xenftContract: '0x94d9E02D115646DFC407ABDE75Fa45256D66E043',
    xenContract: '0xeF4B763385838FfFc708000f884026B8c0434275',
    cointoolContract: '0x82487dF5b4cF19DB597A092c8103759466Be9e5a',
    chainId: 250
  },
  Dogechain: {
    name: 'Dogechain',
    xenftContract: '0x94d9E02D115646DFC407ABDE75Fa45256D66E043',
    xenContract: '0x948eed4490833D526688fD1E5Ba0b9B35CD2c32e',
    cointoolContract: '0x9Ec1C3DcF667f2035FB4CD2eB42A1566fd54d2B7',
    chainId: 2000
  },
  'OKX Chain': {
    name: 'OKX Chain',
    xenftContract: '0x1Ac17FFB8456525BfF46870bba7Ed8772ba063a5',
    xenContract: '0x1cC4D981e897A3D2E7785093A648c0a75fAd0453',
    cointoolContract: '0x6f0a55cd633Cc70BeB0ba7874f3B010C002ef59f',
    chainId: 66
  },
  Pulsechain: {
    name: 'Pulsechain',
    xenftContract: '0xfEa13BF27493f04DEac94f67a46441a68EfD32F8',
    xenContract: '0x8a7FDcA264e87b6da72D000f22186B4403081A2a',
    cointoolContract: '0x0de8bf93da2f7eecb3d9169422413a9bef4ef628',
    chainId: 369
  },
  Optimism: {
    name: 'Optimism',
    xenftContract: '0xAF18644083151cf57F914CCCc23c42A1892C218e',
    xenContract: '0xeB585163DEbB1E637c6D617de3bEF99347cd75c8',
    cointoolContract: '0x9Ec1C3DcF667f2035FB4CD2eB42A1566fd54d2B7',
    chainId: 10
  },
  Base: {
    name: 'Base',
    xenftContract: '0x379002701BF6f2862e3dFdd1f96d3C5E1BF450B6',
    xenContract: '0xffcbF84650cE02DaFE96926B37a0ac5E34932fa5',
    cointoolContract: '0x9Ec1C3DcF667f2035FB4CD2eB42A1566fd54d2B7',
    chainId: 8453
  }
}; 