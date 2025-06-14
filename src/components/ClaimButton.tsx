import React, { useState } from 'react';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { useConfig } from 'wagmi';
import { Zap, Lock, Unlock, Loader2 } from 'lucide-react';
import xenAbi from '../abis/xen_abi.json';
import { CHAINS } from '../config/chains';

interface ClaimButtonProps {
  chainId: number;
  type: 'single' | 'xenft' | 'cointool';
  isMatured: boolean;
  onSuccess?: () => void;
}

export const ClaimButton: React.FC<ClaimButtonProps> = ({ chainId, type, isMatured, onSuccess }) => {
  const wagmiConfig = useConfig();
  const [claiming, setClaiming] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const chainName = Object.keys(CHAINS).find(name => CHAINS[name].chainId === chainId);
  const chain = chainName ? CHAINS[chainName] : null;

  const handleClaim = async () => {
    if (!chain || !isMatured || type !== 'single') return;

    setClaiming(true);
    try {
      const hash = await writeContract(wagmiConfig, {
        address: chain.xenContract as `0x${string}`,
        abi: xenAbi as any,
        functionName: 'claimMintReward',
        args: [],
        chainId,
      });

      setTxHash(hash);
      
      // Wait for transaction
      await waitForTransactionReceipt(wagmiConfig, {
        hash,
        chainId,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Claim failed:', error);
    } finally {
      setClaiming(false);
    }
  };

  if (type !== 'single') {
    return (
      <div className="text-xs text-gray-500 italic">
        {type === 'xenft' ? 'Claim via XENFT' : 'Claim via CoinTool'}
      </div>
    );
  }

  return (
    <button
      onClick={handleClaim}
      disabled={!isMatured || claiming}
      className={`
        relative px-3 py-1.5 rounded-md text-xs font-medium
        transition-all duration-200
        ${isMatured 
          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30' 
          : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50'
        }
        ${claiming ? 'animate-pulse' : ''}
      `}
    >
      <div className="flex items-center gap-1.5">
        {claiming ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Claiming...</span>
          </>
        ) : isMatured ? (
          <>
            <Unlock className="w-3 h-3" />
            <span>Claim</span>
          </>
        ) : (
          <>
            <Lock className="w-3 h-3" />
            <span>Locked</span>
          </>
        )}
      </div>
    </button>
  );
}; 