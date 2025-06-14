import React, { useState, useEffect } from 'react';
import { WagmiProvider, useConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';
import { Download, Loader2, AlertCircle, Zap, Calendar, Layers, Hash, Package, Flame, Users, Activity, TrendingUp } from 'lucide-react';
import { config } from './config/wagmi';
import { CHAINS } from './config/chains';
import { fetchXenftData, fetchSingleMints, fetchCointoolMints, fetchXenStats, fetchXenftStats } from './utils/blockchain';
import { createCalendarEvents, generateICSFile, downloadICSFile } from './utils/calendar';
import { MintTable } from './components/MintTable';
import { StatsCard } from './components/StatsCard';
import { MatrixCounter } from './components/MatrixCounter';
import { Header } from './components/Header';
import { CalendarEvent } from './types';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

const queryClient = new QueryClient();

function AppContent() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const wagmiConfig = useConfig();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [searchProgress, setSearchProgress] = useState({ current: 0, total: 0, status: '', cointoolProgress: { current: 0, total: 0 } });
  const [stats, setStats] = useState<any>({
    totalXenfts: 0,
    totalCointoolVmus: 0,
    totalSingleMints: 0,
    userXenBurned: BigInt(0),
    activeMints: 0,
    upcomingMints: 0,
    maturedMints: 0,
    xenTotalSupply: BigInt(0),
    xenGlobalRank: 0,
    xenActiveMinters: 0,
    xenActiveStakes: 0,
    xenTotalStaked: BigInt(0),
    xenTotalBurned: BigInt(0),
    chainBreakdown: {},
  });

  const currentChainName = Object.keys(CHAINS).find(
    name => CHAINS[name].chainId === chainId
  );
  const currentChain = currentChainName ? CHAINS[currentChainName] : null;

  // Format XEN amounts
  const formatXenAmount = (amount: bigint): string => {
    const value = Number(amount) / 1e18;
    if (value >= 1e12) return `${(value / 1e12).toFixed(0)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(2);
  };

  const fetchMintsForCurrentChain = async () => {
    if (!address || !chainId) return;

    setLoading(true);
    setSearchProgress({ current: 0, total: chainId === 1 ? 3 : 2, status: 'Starting...', cointoolProgress: { current: 0, total: 0 } });

    try {
      const allXenfts = [];
      const allSingleMints = [];
      const allCointoolMints = [];
      const xenftTokenIds: bigint[] = [];

      // Fetch XenFTs for current chain
      setSearchProgress(prev => ({ ...prev, current: 1, status: 'Fetching XenFTs...' }));
      const xenfts = await fetchXenftData(address, chainId, wagmiConfig);
      allXenfts.push(...xenfts);
      
      // Collect token IDs for stats
      xenfts.forEach(xenft => {
        xenftTokenIds.push(BigInt(xenft.tokenId));
      });

      // Fetch single mints for current chain
      setSearchProgress(prev => ({ ...prev, current: 2, status: 'Fetching single mints...' }));
      const singleMint = await fetchSingleMints(address, chainId, wagmiConfig);
      if (singleMint) {
        allSingleMints.push(singleMint);
      }

      // Fetch Cointool mints (on chains that support it)
      let totalCointoolVmus = 0;
      if (currentChain?.cointoolContract) {
        setSearchProgress(prev => ({ ...prev, current: 3, status: 'Fetching Cointool batches...' }));
        try {
          const cointoolMints = await fetchCointoolMints(address, wagmiConfig, (current, total) => {
            setSearchProgress(prev => ({ 
              ...prev, 
              status: `Fetching Cointool VMUs...`,
              cointoolProgress: { current, total }
            }));
          }, chainId);
          console.log('Cointool mints returned:', cointoolMints);
          allCointoolMints.push(...cointoolMints);
          
          // Calculate total CoinTool VMUs
          cointoolMints.forEach(mint => {
            totalCointoolVmus += mint.count;
          });
        } catch (cointoolError) {
          console.error('Cointool fetch failed:', cointoolError);
          setSearchProgress(prev => ({ ...prev, status: 'Cointool fetch failed - continuing with other mints...' }));
        }
      }

      // Fetch XEN stats
      setSearchProgress(prev => ({ ...prev, status: 'Fetching XEN statistics...' }));
      const xenStats = await fetchXenStats(address, chainId, wagmiConfig);
      const xenftStats = await fetchXenftStats(address, chainId, wagmiConfig, xenftTokenIds);

      // Create calendar events
      setSearchProgress(prev => ({ ...prev, status: 'Creating calendar events...', cointoolProgress: { current: 0, total: 0 } }));
      const calendarEvents = createCalendarEvents(allXenfts, allSingleMints, allCointoolMints);
      console.log('Total calendar events created:', calendarEvents.length);
      console.log('Events by type:', {
        xenft: calendarEvents.filter(e => e.type === 'xenft').length,
        single: calendarEvents.filter(e => e.type === 'single').length,
        cointool: calendarEvents.filter(e => e.type === 'cointool').length
      });
      setEvents(calendarEvents);
      
      // Calculate stats
      const now = new Date();
      const upcomingMints = calendarEvents.filter(e => e.start > now).length;
      const maturedMints = calendarEvents.filter(e => e.start <= now).length;
      
      // Get raw values from blockchain data
      const userXenBurned = xenStats?.userBurns || BigInt(0);
      const totalSupply = xenStats?.totalSupply || BigInt(0);
      const totalStaked = xenStats?.totalXenStaked || BigInt(0);
      
      // Calculate total burned (this would need a separate contract call in reality)
      // For now, we'll use the xenftStats totalBurned as a proxy
      const totalBurned = xenftStats?.totalBurned || BigInt(0);
      
      // Chain breakdown
      const chainBreakdown: Record<string, number> = {};
      chainBreakdown[Object.keys(CHAINS).find(name => CHAINS[name].chainId === chainId) || 'Unknown'] = calendarEvents.length;
      
      setStats({
        totalXenfts: allXenfts.length,
        totalCointoolVmus,
        totalSingleMints: allSingleMints.length,
        userXenBurned,  // Store raw BigInt
        activeMints: calendarEvents.length,
        upcomingMints,
        maturedMints,
        xenTotalSupply: totalSupply,  // Store raw BigInt
        xenGlobalRank: xenStats?.globalRank || 0,
        xenActiveMinters: xenStats?.activeMinters || 0,
        xenActiveStakes: xenStats?.activeStakes || 0,
        xenTotalStaked: totalStaked,  // Store raw BigInt
        xenTotalBurned: totalBurned,  // Store raw BigInt
        chainBreakdown,
        xenStats,
        xenftStats
      });
      
      setSearchProgress(prev => ({ ...prev, status: 'Complete!' }));
    } catch (error) {
      console.error('Error fetching mints:', error);
      setSearchProgress(prev => ({ ...prev, status: 'Error occurred' }));
    } finally {
      setLoading(false);
    }
  };

  const handleExportCalendar = () => {
    const icsContent = generateICSFile(events);
    downloadICSFile(icsContent, 'xen-mints.ics');
  };

  // Reset stats when switching chains
  const resetStats = () => {
    setStats({
      totalXenfts: 0,
      totalCointoolVmus: 0,
      totalSingleMints: 0,
      userXenBurned: BigInt(0),
      activeMints: 0,
      upcomingMints: 0,
      maturedMints: 0,
      xenTotalSupply: BigInt(0),
      xenGlobalRank: 0,
      xenActiveMinters: 0,
      xenActiveStakes: 0,
      xenTotalStaked: BigInt(0),
      xenTotalBurned: BigInt(0),
      chainBreakdown: {},
    });
    setEvents([]);
  };

  useEffect(() => {
    if (isConnected && currentChain) {
      // Reset stats when switching chains
      resetStats();
      // Don't auto-fetch, let user click scan button
    }
  }, [isConnected, chainId]);

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Header />

      {/* Mobile Disclaimer */}
      <div className="lg:hidden bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-amber-200">
                <span className="font-medium">Desktop Recommended:</span> This app is optimized for desktop use. Some features may be limited on mobile devices.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {isConnected ? (
          <>
            {/* Instructions Hero Section */}
            <div className="relative mb-8 lg:mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl lg:rounded-3xl blur-2xl" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl px-3 py-6 sm:px-4 sm:py-8 lg:px-8 lg:py-10 text-center">
                <div className="max-w-5xl mx-auto">
                  <div className="mb-6 lg:mb-8">
                    <img 
                      src="/hero.png" 
                      alt="ClaimXen.com - Track XEN Mints" 
                      className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl mx-auto rounded-xl lg:rounded-2xl shadow-2xl border border-white/10"
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Track Your XEN Mints</h2>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 lg:mb-10 leading-relaxed max-w-4xl mx-auto px-2 sm:px-4">
                    Connect your wallet and hit the <span className="text-green-400 font-semibold">Scan</span> button to discover all your VMUs across the network. 
                    Then use <span className="text-purple-400 font-semibold">Export Calendar</span> to download an .ics file and import it into 
                    <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors ml-1">Google Calendar</a> 
                    to never miss a maturity date.
                  </p>
                  <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-sm lg:text-base text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span>Connect Wallet</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-600 rounded-full hidden sm:block" />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <span>Scan Network</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-600 rounded-full hidden sm:block" />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span>Export Calendar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mb-6 lg:mb-8">
              {/* Global XEN Statistics - First */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-xl lg:rounded-2xl blur-xl" />
                <div className="relative bg-gray-900/40 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-700/50 mb-4 lg:mb-6">
                  <div className="flex items-center gap-3 mb-3 lg:mb-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <h3 className="text-xs lg:text-sm font-semibold text-blue-300 uppercase tracking-wider">Global XEN Statistics</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-blue-500/30 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-medium">Total Supply</p>
                      {stats.xenTotalSupply === BigInt(0) && !isConnected ? (
                        <div className="h-8 bg-gray-700/50 rounded animate-pulse"></div>
                      ) : (
                        <p className="text-2xl font-bold text-blue-300">
                          {formatXenAmount(stats.xenTotalSupply)}
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-teal-500/30 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-medium">Total Staked</p>
                      <p className="text-2xl font-bold text-teal-300">
                        {formatXenAmount(stats.xenTotalStaked)}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-purple-500/30 transition-all group relative">
                      <p className="text-xs text-gray-400 mb-2 font-medium flex items-center gap-1">
                        Global Rank
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </p>
                      <p className="text-2xl font-bold text-purple-300">
                        #{stats.xenGlobalRank?.toLocaleString() || '0'}
                      </p>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        Current global rank for new mints
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-indigo-500/30 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-medium">Active Stakes</p>
                      <p className="text-2xl font-bold text-indigo-300">
                        {stats.xenActiveStakes?.toLocaleString() || '0'}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-cyan-500/30 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-medium">Active Minters</p>
                      <p className="text-2xl font-bold text-cyan-300">
                        {stats.xenActiveMinters?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your XEN Portfolio - Second */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl lg:rounded-2xl blur-xl" />
                <div className="relative bg-gray-900/40 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4 lg:mb-5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <h3 className="text-xs lg:text-sm font-semibold text-green-300 uppercase tracking-wider">Your XEN Portfolio</h3>
                  </div>
                  
                  {/* Portfolio Stats - Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-purple-500/40 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-medium">XENFTs</p>
                      <p className="text-2xl font-bold text-purple-300">{stats.totalXenfts}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-blue-500/40 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-medium">Vanilla Mints</p>
                      <p className="text-2xl font-bold text-blue-300">{stats.totalSingleMints}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-cyan-500/40 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-medium">CoinTool VMUs</p>
                      <p className="text-2xl font-bold text-cyan-300">{stats.totalCointoolVmus}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-orange-500/40 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-medium">XEN Burned</p>
                      <p className="text-2xl font-bold text-orange-300">
                        {formatXenAmount(stats.userXenBurned)}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-white/40 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-medium">Total Mints</p>
                      <p className="text-2xl font-bold text-white">{stats.activeMints}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-gray-500/40 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-medium">Upcoming</p>
                      <p className="text-2xl font-bold text-gray-300">{stats.upcomingMints}</p>
                    </div>
                  </div>


                </div>
              </div>
            </div>

            {/* Quick Actions Section */}
            {isConnected && (
              <div className="relative mb-6 lg:mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl lg:rounded-2xl blur-xl" />
                <div className="relative bg-gray-900/40 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                    <h3 className="text-xs lg:text-sm font-semibold text-indigo-300 uppercase tracking-wider">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <button className="flex items-center gap-2 p-3 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/30 hover:border-indigo-500/40 transition-all text-left">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-white">Quick Scan</p>
                        <p className="text-xs text-gray-400">Scan current chain</p>
                      </div>
                    </button>
                    <button className="flex items-center gap-2 p-3 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/30 hover:border-purple-500/40 transition-all text-left">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-white">Export All</p>
                        <p className="text-xs text-gray-400">Download calendar</p>
                      </div>
                    </button>
                    <button className="flex items-center gap-2 p-3 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/30 hover:border-green-500/40 transition-all text-left">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-white">Refresh</p>
                        <p className="text-xs text-gray-400">Update data</p>
                      </div>
                    </button>
                    <button className="flex items-center gap-2 p-3 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/30 hover:border-blue-500/40 transition-all text-left">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-white">Settings</p>
                        <p className="text-xs text-gray-400">Preferences</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Network & Scan Section */}
            <div className="relative mb-6 lg:mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl lg:rounded-2xl blur-2xl" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl lg:rounded-2xl p-4 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                  <div>
                    <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Current Network</h2>
                    <p className="text-2xl font-semibold text-white">
                      {currentChain?.name || 'Unknown Chain'}
                    </p>
                    {currentChain?.cointoolContract && (
                      <p className="text-xs text-gray-500 mt-1">CoinTool supported</p>
                    )}
                  </div>

                  {currentChain ? (
                    <button
                      onClick={fetchMintsForCurrentChain}
                      disabled={loading}
                      className="group relative w-full lg:w-auto px-6 lg:px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-green-500/25"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur-md group-hover:blur-lg transition-all opacity-50" />
                      <div className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Scanning...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            <span className="hidden sm:inline">Scan {currentChain.name}</span>
                            <span className="sm:hidden">Scan</span>
                          </>
                        )}
                      </div>
                    </button>
                  ) : (
                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400">Unsupported network</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* CoinTool Progress */}
                {currentChain?.cointoolContract && searchProgress.cointoolProgress.total > 0 && loading && (
                  <div className="mt-6">
                    <MatrixCounter
                      current={searchProgress.cointoolProgress.current}
                      total={searchProgress.cointoolProgress.total}
                      label="CoinTool VMU Progress"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Mints Table Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl lg:rounded-2xl blur-3xl" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl lg:rounded-2xl p-4 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-semibold text-white mb-1">XEN Mints</h2>
                    <p className="text-sm text-gray-400">Track and manage your mints across all protocols</p>
                  </div>
                  {events.length > 0 && (
                    <button
                      onClick={handleExportCalendar}
                      className="group relative w-full sm:w-auto px-4 lg:px-6 py-2.5 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-600/30 hover:border-purple-500/50 transition-all"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        <span className="font-medium">Export Calendar</span>
                      </div>
                    </button>
                  )}
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                      <Loader2 className="relative w-12 h-12 text-green-400 animate-spin" />
                    </div>
                    <p className="mt-4 text-gray-400">{searchProgress.status}</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400">
                      {currentChain ? (
                        <>Click "Scan {currentChain.name}" to load your mints</>
                      ) : (
                        <>Connect to a supported network to view mints</>
                      )}
                    </p>
                  </div>
                ) : (
                  <MintTable events={events} onRefresh={fetchMintsForCurrentChain} />
                )}
              </div>
            </div>

            {/* Recent Activity Feed */}
            {isConnected && events.length > 0 && (
              <div className="relative mt-6 lg:mt-8">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl lg:rounded-2xl blur-xl" />
                <div className="relative bg-gray-900/40 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <h3 className="text-xs lg:text-sm font-semibold text-emerald-300 uppercase tracking-wider">Recent Activity</h3>
                  </div>
                  <div className="space-y-3">
                    {events.slice(0, 3).map((event, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg border border-gray-700/20">
                        <div className={`w-2 h-2 rounded-full ${
                          event.type === 'xenft' ? 'bg-purple-400' : 
                          event.type === 'single' ? 'bg-blue-400' : 'bg-cyan-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                                                     <p className="text-sm font-medium text-white truncate">
                             {event.type === 'xenft' ? 'XENFT' : 
                              event.type === 'single' ? 'Vanilla Mint' : 'CoinTool VMU'} 
                             {event.type === 'xenft' && event.title.includes('#') && ` ${event.title.split(' ')[1]}`}
                           </p>
                          <p className="text-xs text-gray-400">
                            Matures {event.start.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {Math.ceil((event.start.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                                 </div>
               </div>
             )}

            {/* Affiliate Banner */}
            <div className="relative mt-8 lg:mt-12">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-xl lg:rounded-2xl blur-xl" />
              <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl lg:rounded-2xl p-6 lg:p-8">
                <div className="text-center mb-6">
                  <h3 className="text-lg lg:text-xl font-bold text-white mb-2">Explore More XEN Tools</h3>
                  <p className="text-sm text-gray-400">Discover our partner sites for complete XEN ecosystem management</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* MintXen.com */}
                  <a 
                    href="https://mintxen.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                                         <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 via-blue-500/20 via-cyan-400/20 via-green-500/20 via-yellow-400/20 via-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                                                 <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500/50 via-purple-500/50 via-blue-500/50 via-cyan-400/50 via-green-500/50 via-yellow-400/50 to-orange-500/50 shadow-lg shadow-purple-500/25">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                                                 <h4 className="text-xl font-bold">
                           <span className="text-red-400">M</span>
                           <span className="text-orange-400">i</span>
                           <span className="text-yellow-400">n</span>
                           <span className="text-green-400">t</span>
                           <span className="text-blue-400">X</span>
                           <span className="text-indigo-400">e</span>
                           <span className="text-purple-400">n</span>
                           <span className="text-pink-400">.</span>
                           <span className="text-cyan-400">c</span>
                           <span className="text-lime-400">o</span>
                           <span className="text-rose-400">m</span>
                         </h4>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        Advanced XEN minting platform with batch operations, gas optimization, and smart contract interactions.
                      </p>
                                             <div className="flex items-center gap-2 text-xs text-gray-400">
                         <span className="px-2 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full border border-purple-400/30">Batch Minting</span>
                         <span className="px-2 py-1 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-full border border-blue-400/30">Gas Optimization</span>
                       </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </a>

                  {/* BurnXen.com */}
                  <a 
                    href="https://burnxen.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl p-6 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
                  >
                                         <div className="absolute inset-0 bg-gradient-to-r from-red-500/15 via-orange-500/15 to-yellow-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                                                 <div className="p-2 rounded-lg bg-gradient-to-r from-red-500/40 via-orange-500/40 to-yellow-500/40">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                          </svg>
                        </div>
                                                 <h4 className="text-xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                           BurnXen.com
                         </h4>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        Maximize your XEN and possible X1 rewards through strategic burning mechanisms via $XBURN and $XLOCK NFT minting.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="px-2 py-1 bg-orange-500/20 rounded-full">XEN Burning</span>
                        <span className="px-2 py-1 bg-red-500/20 rounded-full">XLOCK NFT Creation</span>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </a>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Partner sites • Expand your XEN ecosystem experience
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Not Connected State */
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-3xl" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-12 text-center max-w-md">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Welcome to XEN Calendar</h2>
                <p className="text-gray-400 mb-8">
                  Track and export your XEN mints across all protocols and chains
                </p>
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left side - Project info */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400 mb-2">
                Track XEN mints from XENFTs, single mints, and CoinTool batches
              </p>
              <p className="text-xs text-gray-500">
                Built by TreeCityWes.eth • Powered by blockchain RPC
              </p>
            </div>

            {/* Center - Project Links */}
            <div className="flex items-center gap-8">
              <a
                href="https://xen.network"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors"
              >
                <span>XEN Network</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://hashhead.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors"
              >
                <span>HashHead</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Right side - Social Links */}
            <div className="flex items-center gap-6">
                <a
                  href="https://x.com/treecitywes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  title="X"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://t.me/treecitywes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  title="Telegram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a
                  href="https://github.com/treecitywes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  title="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com/treecitywes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  title="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://buymeacoffee.com/treecitywes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  title="Buy Me a Coffee"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-.766-1.623A4.596 4.596 0 0 0 15.98 3h-6.958A4.596 4.596 0 0 0 5.684 4.126c-.378.46-.647 1.025-.766 1.623L4.786 6.415c-.142.717-.217 1.450-.217 2.189v6.695c0 1.495 1.205 2.701 2.701 2.701h9.460c1.495 0 2.701-1.206 2.701-2.701V8.604c0-.739-.075-1.472-.215-2.189zM12 15.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"/>
                  </svg>
                </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
