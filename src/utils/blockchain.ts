import { ethers } from 'ethers';
import { CHAINS } from '../config/chains';
import xenftAbi from '../abis/xenft_abi.json';
import xenAbi from '../abis/xen_abi.json';
import { XenftData, SingleMintData, CointoolMintData } from '../types';
import { readContract, readContracts } from '@wagmi/core';
import type { Config } from 'wagmi';
import { getPublicClient } from '@wagmi/core';

const COINTOOL_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}, {"internalType": "bytes", "name": "", "type": "bytes"}],
    "name": "map",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export async function fetchXenftData(
  address: string, 
  chainId: number,
  wagmiConfig: Config
): Promise<XenftData[]> {
  // Find chain config by chainId
  const chainName = Object.keys(CHAINS).find(name => CHAINS[name].chainId === chainId);
  if (!chainName) {
    console.error(`Chain with ID ${chainId} not supported`);
    return [];
  }
  
  const chain = CHAINS[chainName];

  try {
    // Read contract using wagmi actions - ownedTokens is a view function that uses msg.sender context
    const tokenIds = await readContract(wagmiConfig, {
      address: chain.xenftContract as `0x${string}`,
      abi: xenftAbi,
      functionName: 'ownedTokens',
      args: [],
      account: address as `0x${string}`,
      chainId,
    }) as bigint[];

    console.log(`Found ${tokenIds.length} XENFTs for ${address} on ${chainName}`);

    const xenfts: XenftData[] = [];

    // Use direct ethers calls to avoid Wagmi's automatic multicall
    const publicClient = getPublicClient(wagmiConfig, { chainId });
    if (!publicClient) {
      console.error('No public client available for chain', chainId);
      return [];
    }

    // Create ethers provider from viem client
    const provider = new ethers.BrowserProvider(publicClient);
    const contract = new ethers.Contract(chain.xenftContract, xenftAbi, provider);

    // Process tokens in small batches to reduce rate limiting
    const BATCH_SIZE = 5; // Process 5 tokens at a time
    const batches = [];
    
    for (let i = 0; i < tokenIds.length; i += BATCH_SIZE) {
      batches.push(tokenIds.slice(i, i + BATCH_SIZE));
    }
    
    console.log(`Processing ${tokenIds.length} XENFTs in ${batches.length} batches of ${BATCH_SIZE}`);
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} tokens)`);
      
      // Process batch in parallel with individual retry logic
      const batchPromises = batch.map(async (tokenId, tokenIndex) => {
        const globalIndex = batchIndex * BATCH_SIZE + tokenIndex + 1;
        console.log(`Processing XENFT ${globalIndex}/${tokenIds.length}: Token ID ${tokenId}`);
        
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            // Direct ethers call - absolutely no gas estimation!
            const tokenUri = await contract.tokenURI(tokenId);
            
            if (tokenUri.startsWith("data:application/json;base64,")) {
              const base64Data = tokenUri.split(",")[1];
              const tokenData = JSON.parse(atob(base64Data));
              
              const getAttribute = (name: string) => {
                const attr = tokenData.attributes?.find((a: any) => a.trait_type === name);
                return attr?.value || "N/A";
              };

              return {
                tokenId: tokenId.toString(),
                name: `${chainName} ${tokenData.name}`,
                chain: chainName,
                class: getAttribute('Class'),
                vmus: getAttribute('VMUs'),
                cRank: getAttribute('cRank'),
                amp: getAttribute('AMP'),
                eaa: getAttribute('EAA (%)'),
                maturityDateTime: getAttribute('Maturity DateTime'),
                term: getAttribute('Term'),
                xenBurned: getAttribute('XEN Burned'),
                category: getAttribute('Category')
              };
            } else {
              console.warn(`Token ${tokenId} has non-base64 tokenURI: ${tokenUri.substring(0, 100)}...`);
              return null;
            }
          } catch (error: any) {
            retryCount++;
            const isRateLimit = error?.message?.includes('429') || 
                               error?.message?.includes('Too Many Requests') ||
                               error?.code === 'NETWORK_ERROR' ||
                               error?.code === 'TIMEOUT';
            
            if (isRateLimit && retryCount < maxRetries) {
              // Exponential backoff: 1s, 2s, 4s
              const delay = Math.pow(2, retryCount) * 1000;
              console.log(`Rate limited on token ${tokenId}, retrying in ${delay}ms (attempt ${retryCount}/${maxRetries})`);
              await new Promise(resolve => setTimeout(resolve, delay));
            } else {
              console.error(`Error fetching token ${tokenId} (attempt ${retryCount}/${maxRetries}):`, error);
              if (retryCount >= maxRetries) {
                console.error(`Failed to fetch token ${tokenId} after ${maxRetries} attempts, skipping`);
                return null;
              }
            }
          }
        }
        return null;
      });
      
      // Wait for batch to complete
      const batchResults = await Promise.all(batchPromises);
      
      // Add successful results to xenfts array
      batchResults.forEach(result => {
        if (result) {
          xenfts.push(result);
        }
      });
      
      // Delay between batches to avoid overwhelming the RPC
      if (batchIndex < batches.length - 1) {
        console.log(`Batch ${batchIndex + 1} complete, waiting 1s before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Successfully processed ${xenfts.length}/${tokenIds.length} XENFTs for ${address} on ${chainName}`);
    return xenfts;
  } catch (error) {
    console.error(`Error fetching XenFTs for chain ${chainId}:`, error);
    return [];
  }
}

export async function fetchSingleMints(
  address: string, 
  chainId: number,
  wagmiConfig: Config
): Promise<SingleMintData | null> {
  const chainName = Object.keys(CHAINS).find(name => CHAINS[name].chainId === chainId);
  if (!chainName) {
    console.error(`Chain with ID ${chainId} not supported`);
    return null;
  }
  
  const chain = CHAINS[chainName];

  try {
    const mintInfo = await readContract(wagmiConfig, {
      address: chain.xenContract as `0x${string}`,
      abi: xenAbi,
      functionName: 'userMints',
      args: [address as `0x${string}`],
      chainId,
    }) as any;
    
    if (mintInfo.user === '0x0000000000000000000000000000000000000000') {
      return null;
    }

    return {
      address,
      chain: chainName,
      term: Number(mintInfo.term),
      maturityTs: Number(mintInfo.maturityTs),
      rank: Number(mintInfo.rank),
      amplifier: Number(mintInfo.amplifier),
      eaaRate: Number(mintInfo.eaaRate)
    };
  } catch (error) {
    console.error(`Error fetching single mint for chain ${chainId}:`, error);
    return null;
  }
}

export async function fetchCointoolMints(
  address: string,
  wagmiConfig: Config,
  onProgress?: (current: number, total: number) => void,
  chainId?: number
): Promise<CointoolMintData[]> {
  // Find chain config by chainId or default to Ethereum
  const chainName = chainId 
    ? Object.keys(CHAINS).find(name => CHAINS[name].chainId === chainId)
    : 'Ethereum';
  
  if (!chainName) {
    console.error(`Chain with ID ${chainId} not supported`);
    return [];
  }
  
  const chain = CHAINS[chainName];
  if (!chain.cointoolContract) {
    console.log(`No CoinTool contract on ${chainName}`);
    return [];
  }

  try {
    const mints: CointoolMintData[] = [];
    const salts = ['0x01', '0x00']; // Common salts used by Cointool

    for (const salt of salts) {
      try {
        console.log(`Checking VMU count for salt ${salt} on ${chainName}...`);
        // Ensure salt is properly formatted as bytes
        const saltBytes = ethers.hexlify(salt);
        
        const totalVmus = await readContract(wagmiConfig, {
          address: chain.cointoolContract as `0x${string}`,
          abi: COINTOOL_ABI,
          functionName: 'map',
          args: [address as `0x${string}`, saltBytes as `0x${string}`],
          chainId: chain.chainId,
        }) as bigint;
        
        console.log(`VMU count for salt ${salt} on ${chainName}:`, totalVmus.toString());
        
        if (totalVmus > BigInt(0)) {
          console.log(`Found ${totalVmus.toString()} VMUs for salt ${salt} on ${chainName}`);
          const vmuData: Record<string, any> = {};
          
          // Process ALL VMUs found
          const totalCount = Number(totalVmus);
          const BATCH_SIZE = 50; // Process 50 at a time for better performance
          
          console.log(`Processing all ${totalCount} VMUs on ${chainName}...`);
          
          // Process VMUs in batches
          for (let i = 1; i <= totalCount; i += BATCH_SIZE) {
            const batchEnd = Math.min(i + BATCH_SIZE - 1, totalCount);
            const proxyAddresses: string[] = [];
            
            // Collect proxy addresses for this batch
            for (let j = i; j <= batchEnd; j++) {
              const proxyAddress = calculateProxyAddress(chain.cointoolContract, saltBytes, j, address);
              if (proxyAddress) {
                proxyAddresses.push(proxyAddress);
              }
            }
            
            try {
              // Execute batch call
              const batchResults = await readContracts(wagmiConfig, {
                contracts: proxyAddresses.map(proxyAddress => ({
                  address: chain.xenContract as `0x${string}`,
                  abi: xenAbi as any,
                  functionName: 'userMints',
                  args: [proxyAddress as `0x${string}`],
                  chainId: chain.chainId,
                })),
              });
              
              // Process batch results
              batchResults.forEach((result, index) => {
                const vmuIndex = i + index;
                const proxyAddress = proxyAddresses[index];
                
                // Debug first few results
                if (vmuIndex <= 3) {
                  console.log(`VMU ${vmuIndex} proxy address:`, proxyAddress);
                  console.log(`VMU ${vmuIndex} result:`, result);
                }
                
                if (result.status === 'success' && result.result) {
                  const mintInfoArray = result.result as any[];
                  
                  if (vmuIndex <= 3) {
                    console.log(`VMU ${vmuIndex} mint info:`, mintInfoArray);
                  }
                  
                  // Parse the array format: [user, term, maturityTs, rank, amplifier, eaaRate]
                  if (mintInfoArray && mintInfoArray.length >= 6) {
                    const user = mintInfoArray[0];
                    const term = Number(mintInfoArray[1]);
                    const maturityTs = Number(mintInfoArray[2]);
                    const rank = Number(mintInfoArray[3]);
                    const amplifier = Number(mintInfoArray[4]);
                    const eaaRate = Number(mintInfoArray[5]);
                    
                    if (user !== '0x0000000000000000000000000000000000000000' && maturityTs > 0) {
                      const maturityDate = new Date(maturityTs * 1000).toISOString().split('T')[0];
                      
                      if (!vmuData[maturityDate]) {
                        vmuData[maturityDate] = {
                          count: 0,
                          term: term,
                          rank: rank,
                          amplifier: amplifier,
                          eaaRate: eaaRate,
                          maturityTs: maturityTs
                        };
                      }
                      vmuData[maturityDate].count++;
                      
                      if (vmuIndex <= 3) {
                        console.log(`VMU ${vmuIndex} added to date ${maturityDate}`);
                      }
                    }
                  }
                }
              });
              
              // Report progress
              if (onProgress) {
                onProgress(batchEnd, totalCount);
              }
              console.log(`Processed ${batchEnd}/${totalCount} VMUs on ${chainName}, found ${Object.keys(vmuData).length} unique dates`);
              
            } catch (error) {
              console.error(`Error processing batch ${i}-${batchEnd} on ${chainName}:`, error);
              // Continue with next batch even if this one fails
            }
            
            // Small delay between batches to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          // Convert to array
          for (const [date, info] of Object.entries(vmuData)) {
            const cointoolMint = {
              proxyAddress: '',
              chain: chainName,
              maturityDate: date,
              maturityTs: info.maturityTs,
              count: info.count,
              term: info.term,
              rank: info.rank,
              amplifier: info.amplifier,
              eaaRate: info.eaaRate
            };
            console.log(`Adding Cointool mint on ${chainName}:`, cointoolMint);
            mints.push(cointoolMint);
          }
          
          console.log(`Processed ${Object.keys(vmuData).length} unique maturity dates for salt ${salt} on ${chainName}:`, Object.keys(vmuData));
        }
      } catch (error) {
        console.error(`Error processing salt ${salt} on ${chainName}:`, error);
      }
    }
    
    console.log(`Final Cointool mints array for ${chainName}:`, mints);
    return mints;
  } catch (error) {
    console.error(`Error fetching Cointool mints on ${chainName}:`, error);
    return [];
  }
}

function calculateProxyAddress(cointoolAddress: string, salt: string, index: number, userAddress: string): string | null {
  try {
    // Ensure addresses are properly formatted
    const formattedUserAddress = ethers.getAddress(userAddress);
    const formattedCointoolAddress = ethers.getAddress(cointoolAddress);
    
    // Create the salt exactly as the contract does: keccak256(abi.encodePacked(_salt, index, msg.sender))
    const derivedSalt = ethers.solidityPackedKeccak256(
      ['bytes', 'uint256', 'address'],
      [salt, index, formattedUserAddress]
    );
    
    // Create the minimal proxy bytecode exactly as in the contract
    const bytecode = ethers.concat([
      '0x3D602d80600A3D3981F3363d3d373d3D3D363d73',
      ethers.zeroPadValue(formattedCointoolAddress, 20),
      '0x5af43d82803e903d91602b57fd5bf3'
    ]);
    
    const bytecodeHash = ethers.keccak256(bytecode);
    
    // Calculate CREATE2 address
    const create2Input = ethers.concat([
      '0xff',
      formattedCointoolAddress,
      derivedSalt,
      bytecodeHash
    ]);
    
    const create2Hash = ethers.keccak256(create2Input);
    
    // Take the last 20 bytes for the address
    const proxyAddress = ethers.getAddress('0x' + create2Hash.slice(-40));
    
    return proxyAddress;
  } catch (error) {
    console.error('Error calculating proxy address:', error);
    return null;
  }
}

export async function fetchXenStats(
  address: string,
  chainId: number,
  wagmiConfig: Config
): Promise<{
  userBurns: bigint;
  totalSupply: bigint;
  globalRank: bigint;
  activeMinters: bigint;
  activeStakes: bigint;
  totalXenStaked: bigint;
} | null> {
  const chainName = Object.keys(CHAINS).find(name => CHAINS[name].chainId === chainId);
  if (!chainName) {
    console.error(`Chain with ID ${chainId} not supported`);
    return null;
  }
  
  const chain = CHAINS[chainName];

  try {
    // Batch read multiple contract values
    const results = await readContracts(wagmiConfig, {
      contracts: [
        {
          address: chain.xenContract as `0x${string}`,
          abi: xenAbi as any,
          functionName: 'userBurns',
          args: [address as `0x${string}`],
          chainId,
        },
        {
          address: chain.xenContract as `0x${string}`,
          abi: xenAbi as any,
          functionName: 'totalSupply',
          args: [],
          chainId,
        },
        {
          address: chain.xenContract as `0x${string}`,
          abi: xenAbi as any,
          functionName: 'globalRank',
          args: [],
          chainId,
        },
        {
          address: chain.xenContract as `0x${string}`,
          abi: xenAbi as any,
          functionName: 'activeMinters',
          args: [],
          chainId,
        },
        {
          address: chain.xenContract as `0x${string}`,
          abi: xenAbi as any,
          functionName: 'activeStakes',
          args: [],
          chainId,
        },
        {
          address: chain.xenContract as `0x${string}`,
          abi: xenAbi as any,
          functionName: 'totalXenStaked',
          args: [],
          chainId,
        },
      ],
    });

    // Extract results
    const [userBurns, totalSupply, globalRank, activeMinters, activeStakes, totalXenStaked] = results.map(r => 
      r.status === 'success' ? r.result as bigint : BigInt(0)
    );

    return {
      userBurns,
      totalSupply,
      globalRank,
      activeMinters,
      activeStakes,
      totalXenStaked,
    };
  } catch (error) {
    console.error(`Error fetching XEN stats for chain ${chainId}:`, error);
    return null;
  }
}

export async function fetchXenftStats(
  address: string,
  chainId: number,
  wagmiConfig: Config,
  tokenIds: bigint[]
): Promise<{
  totalBurned: bigint;
  totalVmus: bigint;
} | null> {
  const chainName = Object.keys(CHAINS).find(name => CHAINS[name].chainId === chainId);
  if (!chainName) {
    console.error(`Chain with ID ${chainId} not supported`);
    return null;
  }
  
  const chain = CHAINS[chainName];

  try {
    if (tokenIds.length === 0) {
      return { totalBurned: BigInt(0), totalVmus: BigInt(0) };
    }

    // Batch read xenBurned and vmuCount for all tokenIds
    const contracts = [];
    for (const tokenId of tokenIds) {
      contracts.push({
        address: chain.xenftContract as `0x${string}`,
        abi: xenftAbi as any,
        functionName: 'xenBurned',
        args: [tokenId],
        chainId,
      });
      contracts.push({
        address: chain.xenftContract as `0x${string}`,
        abi: xenftAbi as any,
        functionName: 'vmuCount',
        args: [tokenId],
        chainId,
      });
    }

    const results = await readContracts(wagmiConfig, { contracts });

    let totalBurned = BigInt(0);
    let totalVmus = BigInt(0);

    // Process results in pairs (xenBurned, vmuCount)
    for (let i = 0; i < results.length; i += 2) {
      if (results[i].status === 'success') {
        totalBurned += results[i].result as bigint;
      }
      if (results[i + 1].status === 'success') {
        totalVmus += results[i + 1].result as bigint;
      }
    }

    return { totalBurned, totalVmus };
  } catch (error) {
    console.error(`Error fetching XENFT stats for chain ${chainId}:`, error);
    return null;
  }
} 