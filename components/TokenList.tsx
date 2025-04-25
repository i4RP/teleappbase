'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { formatUnits } from 'viem'
import { sepolia } from 'viem/chains'
import Image from 'next/image'
import { SEPOLIA_USDT_ADDRESS } from '@/config'

interface Token {
  symbol: string
  name: string
  balance: string
  formattedBalance: string
  decimals: number
  address?: string
  iconPath: string
}

interface TokenListProps {
  onSelectToken: (token: Token) => void
  onUpdateTotalBalance?: (total: string) => void
}

export default function TokenList({ onSelectToken, onUpdateTotalBalance }: TokenListProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [totalBalanceUSD, setTotalBalanceUSD] = useState<string>("0.00")
  const isSepoliaNetwork = chainId === sepolia.id

  const mainnetUsdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

  const mainnetUsdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

  const sepoliaUsdtAddress = SEPOLIA_USDT_ADDRESS || '0xAA26ff5dd04368916806d3cBf985fF41e023BF48'

  const { data: nativeBalance } = useBalance({
    address,
    chainId: chainId,
  })

  const { data: usdtBalance } = useBalance({
    address,
    token: isSepoliaNetwork ? sepoliaUsdtAddress as `0x${string}` : mainnetUsdtAddress as `0x${string}`,
    chainId: chainId,
  })

  const { data: usdcBalance } = useBalance({
    address,
    token: mainnetUsdcAddress as `0x${string}`,
    chainId: chainId,
  })

  const formatEthBalance = (balance: bigint, decimals: number): string => {
    if (!balance) return "0";
    const formatted = formatUnits(balance, decimals);
    const floatVal = parseFloat(formatted);
    if (floatVal.toString().includes("e")) {
      return floatVal.toFixed(18).replace(/\.?0+$/, "");
    }
    return floatVal.toPrecision(8).replace(/\.?0+$/, "");
  };

  const ETH_PRICE_USD = 3500; // テスト環境でも同じ価格を使用

  const calculateTotalBalanceUSD = (tokenList: Token[]): string => {
    let total = 0;

    tokenList.forEach(token => {
      if (token.symbol === 'ETH' || token.symbol === 'SepoliaETH') {
        const ethValue = parseFloat(token.formattedBalance) * ETH_PRICE_USD;
        total += ethValue;
      } else if (token.symbol === 'USDT' || token.symbol === 'USDC') {
        total += parseFloat(token.formattedBalance);
      }
    });

    return total.toFixed(2);
  };

  useEffect(() => {
    const fetchTokens = async () => {
      if (!isConnected || !address) {
        setTokens([])
        setTotalBalanceUSD("0.00")
        if (onUpdateTotalBalance) onUpdateTotalBalance("0.00")
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        const tokenList: Token[] = []

        if (nativeBalance) {
          const formattedEthBalance = formatEthBalance(nativeBalance.value, nativeBalance.decimals)
          const symbol = isSepoliaNetwork ? 'SepoliaETH' : nativeBalance.symbol
          const name = isSepoliaNetwork ? 'Sepolia Ether' : 'Ethereum'

          tokenList.push({
            symbol: symbol,
            name: name,
            balance: nativeBalance.value.toString(),
            formattedBalance: formattedEthBalance,
            decimals: nativeBalance.decimals,
            iconPath: '/images/tokens/eth.png'
          })
        }

        if (usdtBalance) {
          tokenList.push({
            symbol: 'USDT',
            name: 'Tether USD',
            balance: usdtBalance.value.toString(),
            formattedBalance: usdtBalance.formatted,
            decimals: usdtBalance.decimals,
            address: isSepoliaNetwork ? sepoliaUsdtAddress : mainnetUsdtAddress,
            iconPath: '/images/tokens/usdt.png'
          })
        }

        if (usdcBalance && !isSepoliaNetwork) {
          tokenList.push({
            symbol: 'USDC',
            name: 'USD Coin',
            balance: usdcBalance.value.toString(),
            formattedBalance: usdcBalance.formatted,
            decimals: usdcBalance.decimals,
            address: mainnetUsdcAddress,
            iconPath: '/images/tokens/usdc.png'
          })
        }

        setTokens(tokenList)

        const totalUSD = calculateTotalBalanceUSD(tokenList);
        setTotalBalanceUSD(totalUSD);
        if (onUpdateTotalBalance) onUpdateTotalBalance(totalUSD);
      } catch (error) {
        console.error('Failed to fetch tokens:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [address, isConnected, nativeBalance, usdtBalance, usdcBalance, chainId, onUpdateTotalBalance, isSepoliaNetwork, sepoliaUsdtAddress, mainnetUsdtAddress, mainnetUsdcAddress])

  if (!isConnected) {
    return null
  }

  if (loading) {
    return <div className="mt-4 text-center">トークンを読み込み中...</div>
  }

  if (tokens.length === 0) {
    return <div className="mt-4 text-center">トークンがありません</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">保有トークン</h2>
      <div className="space-y-3">
        {tokens.map((token, index) => (
          <div
            key={index}
            className="p-4 bg-white border border-gray-100 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50 shadow-sm"
            onClick={() => onSelectToken(token)}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                <Image
                  src={token.iconPath}
                  alt={token.symbol}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{token.symbol}</div>
                <div className="text-sm text-gray-500">{token.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{token.formattedBalance}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
