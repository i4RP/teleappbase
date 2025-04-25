'use client'

import React, { useState } from 'react';
import { useDepositAndApproveUSDT, useUseGameCoin } from '../hooks/useGameCoin';

export default function GameCoinActions() {
  const [amount, setAmount] = useState('1000000'); // 単位：最小単位（例：6桁 = 1.0）
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { depositAndApproveUSDT, isPending: isDepositPending, isSuccess: isDepositSuccess } = useDepositAndApproveUSDT();
  const { useGameCoin: executeGameCoin, isPending: isUsePending, isSuccess: isUseSuccess } = useUseGameCoin();

  const handleDeposit = async () => {
    try {
      setError('');
      setSuccessMessage('');
      await depositAndApproveUSDT(BigInt(amount));
      setSuccessMessage('USDTの入金とGameCoinの発行に成功しました！');
    } catch (err: any) {
      setError(err.message || 'USDTの入金に失敗しました');
    }
  };

  const handleUse = async () => {
    try {
      setError('');
      setSuccessMessage('');
      await executeGameCoin(BigInt(amount));
      setSuccessMessage('GameCoinの使用に成功しました！');
    } catch (err: any) {
      setError(err.message || 'GameCoinの使用に失敗しました');
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">GameCoin操作</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">数量（最小単位）</label>
        <div className="flex">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 p-2 border rounded-l"
            placeholder="1000000 = 1.0 GameCoin"
          />
          <button
            onClick={() => setAmount('1000000')}
            className="bg-gray-200 px-3 py-2 rounded-r text-sm"
          >
            1.0
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">1,000,000 = 1.0 GameCoin（6桁精度）</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleDeposit}
          disabled={isDepositPending}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium"
        >
          {isDepositPending ? '処理中...' : 'USDT入金'}
        </button>
        
        <button
          onClick={handleUse}
          disabled={isUsePending}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium"
        >
          {isUsePending ? '処理中...' : 'GameCoin使用'}
        </button>
      </div>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-lg mt-4">
          <p className="font-medium">エラー</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="p-3 bg-green-100 text-green-800 rounded-lg mt-4">
          <p className="font-medium">成功</p>
          <p className="text-sm">{successMessage}</p>
        </div>
      )}
    </div>
  );
}
