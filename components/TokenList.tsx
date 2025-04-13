'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { formatUnits } from 'viem'
import Image from 'next/image'

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
}

export default function TokenList({ onSelectToken }: TokenListProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)

  const { data: nativeBalance } = useBalance({
    address,
  })

  const { data: usdtBalance } = useBalance({
    address,
    token: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`,
  })

  const { data: usdcBalance } = useBalance({
    address,
    token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
  })

  const formatEthBalance = (balance: bigint, decimals: number): string => {
    const formatted = formatUnits(balance, 9)
    return parseFloat(formatted).toString()
  }

  useEffect(() => {
    const fetchTokens = async () => {
      if (!isConnected || !address) {
        setTokens([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        const tokenList: Token[] = []
        
        if (nativeBalance) {
          const formattedEthBalance = formatEthBalance(nativeBalance.value, nativeBalance.decimals)
          
          tokenList.push({
            symbol: nativeBalance.symbol,
            name: nativeBalance.symbol,
            balance: nativeBalance.value.toString(),
            formattedBalance: formattedEthBalance,
            decimals: nativeBalance.decimals,
            iconPath: '/images/tokens/eth.png'
          })
        }
        
        if (usdtBalance) {
          tokenList.push({
            symbol: usdtBalance.symbol,
            name: 'Tether USD',
            balance: usdtBalance.value.toString(),
            formattedBalance: usdtBalance.formatted,
            decimals: usdtBalance.decimals,
            address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            iconPath: '/images/tokens/usdt.png'
          })
        }
        
        if (usdcBalance) {
          tokenList.push({
            symbol: usdcBalance.symbol,
            name: 'USD Coin',
            balance: usdcBalance.value.toString(),
            formattedBalance: usdcBalance.formatted,
            decimals: usdcBalance.decimals,
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            iconPath: '/images/tokens/usdc.png'
          })
        }
        
        setTokens(tokenList)
      } catch (error) {
        console.error('Failed to fetch tokens:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [address, isConnected, nativeBalance, usdtBalance, usdcBalance, chainId])

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
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">保有トークン</h2>
      <div className="space-y-2">
        {tokens.map((token, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectToken(token)}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                <img 
                  src={token.iconPath} 
                  alt={token.symbol} 
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
