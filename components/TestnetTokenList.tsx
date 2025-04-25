"use client";

import { useBalance, useAccount } from 'wagmi';
import { sepolia } from 'viem/chains';
import React from 'react';

const testTokens = [
  {
    symbol: 'ETH',
    name: 'Sepolia ETH',
    address: undefined, // Native ETH
    decimals: 18,
  },
  {
    symbol: 'USDT',
    name: 'Sepolia USDT',
    address: '0xAA26ff5dd04368916806d3cBf985fF41e023BF48',
    decimals: 6,
  },
];

export default function TestnetTokenList() {
  const { address, isConnected } = useAccount();

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold mb-2 text-gray-600">Testnet Tokens (Sepolia)</h3>
      <div className="space-y-2">
        {testTokens.map((token) => {
          const { data: balance } = useBalance({
            address,
            token: token.address as `0x${string}` | undefined,
            chainId: sepolia.id,
            query: {
              enabled: isConnected && !!address,
            },
          });

          return (
            <div
              key={token.symbol}
              className="flex items-center justify-between bg-gray-100 rounded-lg p-3 text-sm"
            >
              <span>{token.name}</span>
              <span>{balance ? `${parseFloat(balance.formatted).toFixed(4)} ${token.symbol}` : '0.0000'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
