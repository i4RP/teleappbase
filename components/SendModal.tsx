'use client'

import React, { useState } from 'react'
import { useAccount, useSendTransaction, useWriteContract } from 'wagmi'
import { parseUnits } from 'viem'

interface Token {
  symbol: string
  name: string
  balance: string
  formattedBalance: string
  decimals: number
  address?: string
  iconPath?: string
}

interface SendModalProps {
  token: Token | null
  onClose: () => void
}

export default function SendModal({ token, onClose }: SendModalProps) {
  const { address } = useAccount()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { sendTransaction } = useSendTransaction()
  const { writeContractAsync } = useWriteContract()

  const handleSend = async () => {
    setError('')
    setIsPending(true)
    setIsSuccess(false)

    if (!recipient || !amount || !token) {
      setError('必要な情報が不足しています')
      setIsPending(false)
      return
    }

    try {
      const ethAddress = recipient.startsWith('0x') ? recipient : `0x${recipient}`
      const value = parseUnits(amount, token.decimals)

      if (token.symbol.toLowerCase() === 'eth' || !token.address) {
        // ETH送信
        await sendTransaction({
          to: ethAddress as `0x${string}`,
          value,
        })
      } else {

        // ERC-20送信
        await writeContractAsync({
          address: token.address as `0x${string}`,
          abi: [
            {
              name: 'transfer',
              type: 'function',
              stateMutability: 'nonpayable',
              inputs: [
                { name: 'to', type: 'address' },
                { name: 'value', type: 'uint256' }
              ],
              outputs: [{ name: '', type: 'bool' }]
            }
          ],
          functionName: 'transfer',
          args: [ethAddress as `0x${string}`, value], 
        })


      setIsSuccess(true)
    } catch (error: any) {
      setError(error.message || '送信に失敗しました')
    } finally {
      setIsPending(false)
    }
  }

  if (!token) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-4 mx-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">送信</h2>
          <button onClick={onClose} className="text-gray-500">×</button>
        </div>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 overflow-hidden">
              {token.iconPath ? (
                <img src={token.iconPath} alt={token.symbol} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  {token.symbol.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">{token.symbol}</div>
              <div className="text-sm text-gray-500">残高: {token.formattedBalance}</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">送信先</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={() => setAmount(token.formattedBalance)}
              className="absolute right-2 top-2 text-sm text-blue-500"
            >
              最大
            </button>
          </div>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <button
          onClick={handleSend}
          disabled={isPending || isSuccess}
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium"
        >
          {isPending ? '処理中...' : isSuccess ? '送信完了！' : '送信'}
        </button>
      </div>
    </div>
  )
}
