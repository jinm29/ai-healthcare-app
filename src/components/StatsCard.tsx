import React from 'react';
import { TrendingUp, Flame, Layers, Calendar, Hash, Clock, Activity, Zap, Users, Lock } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  compact?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon,
  trend,
  compact = false
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
      if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
      if (val >= 1e3) return `${(val / 1e3).toFixed(2)}K`;
      return val.toLocaleString();
    }
    return val;
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  };

  if (compact) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-800/50 hover:border-green-500/30 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <div className="text-gray-500">{icon}</div>}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{title}</p>
              <p className="text-lg font-bold text-white">{formatValue(value)}</p>
            </div>
          </div>
          {trend && (
            <div className={`${trendColors[trend]}`}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'neutral' && '→'}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50 hover:border-green-500/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <div className="text-gray-500 group-hover:text-green-400 transition-colors">{icon}</div>}
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h3>
        </div>
        {trend && (
          <div className={`${trendColors[trend]} text-sm`}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trend === 'neutral' && '→'}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{formatValue(value)}</p>
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  );
};

interface XenStatsProps {
  stats: {
    // User-specific stats
    totalXenfts: number;
    totalCointoolVmus: number;
    totalSingleMints: number;
    userXenBurned: string;
    activeMints: number;
    upcomingMints: number;
    maturedMints: number;
    
    // Global XEN stats
    xenTotalSupply: string;
    xenGlobalRank: string;
    xenActiveMinters: string;
    xenActiveStakes: string;
    xenTotalStaked: string;
    
    // Chain breakdown
    chainBreakdown: Record<string, number>;
  };
}

export const XenStats: React.FC<XenStatsProps> = ({ stats }) => {
  return (
    <div className="mb-8">
      {/* Hero Stats Section */}
      <div className="text-center mb-12">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Your XEN Portfolio</h2>
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-green-500/20" />
          <Zap className="w-4 h-4 text-green-400" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-green-500/20" />
        </div>
      </div>
      
      {/* First Row - 2 large cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <StatsCard
          title="Your Active Mints"
          value={stats.activeMints}
          icon={<Clock className="w-8 h-8" />}
          subtitle={`${stats.upcomingMints} upcoming • ${stats.maturedMints} ready to claim`}
          trend="neutral"
        />
        
        <StatsCard
          title="XEN Total Supply"
          value={stats.xenTotalSupply}
          icon={<TrendingUp className="w-8 h-8" />}
          subtitle="Total XEN minted on this chain"
          trend="neutral"
        />
      </div>
      
      {/* Second Row - 3 medium cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatsCard
          title="Your XENFTs"
          value={stats.totalXenfts}
          icon={<Layers className="w-6 h-6" />}
          subtitle="On current chain"
        />
        
        <StatsCard
          title="CoinTool VMUs"
          value={stats.totalCointoolVmus.toLocaleString()}
          icon={<Calendar className="w-6 h-6" />}
          subtitle="Batch mints"
        />
        
        <StatsCard
          title="Single Mints"
          value={stats.totalSingleMints}
          icon={<Hash className="w-6 h-6" />}
          subtitle="Direct claims"
        />
      </div>
      
      {/* Third Row - 2 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatsCard
          title="Your XEN Burned"
          value={stats.userXenBurned}
          icon={<Flame className="w-6 h-6" />}
          subtitle="Total burned by your address"
        />
        
        <StatsCard
          title="Global Rank"
          value={stats.xenGlobalRank}
          icon={<Users className="w-6 h-6" />}
          subtitle="Current global mint rank"
        />
      </div>
      
      {/* Global XEN Stats Section */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 mb-8">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Global XEN Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.xenActiveMinters}</p>
            <p className="text-xs text-gray-500 mt-1">Active Minters</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.xenActiveStakes}</p>
            <p className="text-xs text-gray-500 mt-1">Active Stakes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.xenTotalStaked}</p>
            <p className="text-xs text-gray-500 mt-1">Total XEN Staked</p>
          </div>
        </div>
      </div>
      
      {/* Chain Distribution */}
      {Object.keys(stats.chainBreakdown).length > 0 && (
        <div className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Mints by Chain</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(stats.chainBreakdown).map(([chain, count]) => (
              <div key={chain} className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-colors">
                <p className="text-xs text-gray-500">{chain}</p>
                <p className="text-lg font-semibold text-white mt-1">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 