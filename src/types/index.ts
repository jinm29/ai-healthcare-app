export interface XenftData {
  tokenId: string;
  name: string;
  chain: string;
  class: string;
  vmus: string;
  cRank: string;
  amp: string;
  eaa: string;
  maturityDateTime: string;
  term: string;
  xenBurned: string;
  category: string;
}

export interface SingleMintData {
  address: string;
  chain: string;
  term: number;
  maturityTs: number;
  rank: number;
  amplifier: number;
  eaaRate: number;
}

export interface CointoolMintData {
  proxyAddress: string;
  chain: string;
  maturityDate: string;
  maturityTs: number;
  count: number;
  term: number;
  rank: number;
  amplifier: number;
  eaaRate: number;
}

export interface CalendarEvent {
  title: string;
  description: string;
  start: Date;
  end: Date;
  chain: string;
  chainId?: number;
  type: 'xenft' | 'single' | 'cointool';
} 