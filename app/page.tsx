"use client";
export const runtime = 'edge'

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import TokenList from "@/components/TokenList";
import SendModal from "@/components/SendModal";
import Image from "next/image";

interface Token {
  symbol: string;
  name: string;
  balance: string;
  formattedBalance: string;
  decimals: number;
  address?: string;
  iconPath?: string;
}

type TabType = 'wallet' | 'gameToken';

export default function Home() {
  const { isConnected, address } = useAccount();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('wallet');
  const [totalWalletBalance, setTotalWalletBalance] = useState<string>("0.00");

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token);
  };

  const closeModal = () => {
    setSelectedToken(null);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const updateTotalBalance = (total: string) => {
    setTotalWalletBalance(total);
  };

  // モーダル表示中にスクロールを防ぐ
  useEffect(() => {
    if (selectedToken) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedToken]);

  return (
    <main className="min-h-screen px-4 py-0 pb-12 flex-1 flex flex-col items-center bg-gray-100">
      <div className="max-w-md w-full">
        {/* ウォレット接続 */}
        {!isConnected ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mt-4">
            <h3 className="text-sm font-semibold bg-gray-100 p-2 text-center">1:Connect your wallet</h3>
            <div className="flex justify-center items-center p-4">
              <appkit-button />
            </div>
          </div>
        ) : (
          <>
            {/* タブUI */}
            <div className="mt-4 mb-4">
              <div className="flex rounded-lg overflow-hidden bg-gray-700">
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === 'wallet' ? 'bg-gray-600 text-white' : 'text-gray-300'
                  }`}
                  onClick={() => handleTabChange('wallet')}
                >
                  Wallet
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === 'gameToken' ? 'bg-gray-600 text-white' : 'text-gray-300'
                  }`}
                  onClick={() => handleTabChange('gameToken')}
                >
                  Game Token
                </button>
              </div>
            </div>

            {/* 残高表示 */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-4 text-center">
              <h2 className="text-lg text-gray-500 mb-2">
                {activeTab === 'wallet' ? 'Wallet Balance' : 'BCM Balance'}
              </h2>
              <p className="text-3xl font-bold">
                ${activeTab === 'wallet' ? totalWalletBalance : '0.00'}
              </p>
            </div>

            {/* ネットワークとアドレス表示 */}
            <div className="flex justify-between mb-4 gap-2">
              <div className="flex-1 bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
                <div className="flex items-center">
                  <Image
                    src="/images/tokens/eth.png"
                    alt="Ethereum"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span>Ethereum</span>
                </div>
              </div>
              <div className="flex-1 bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                    <span className="text-xs text-teal-500">👤</span>
                  </div>
                  <span className="text-sm truncate">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}</span>
                </div>
              </div>
            </div>

            {/* コンテンツ表示（タブに応じて切り替え） */}
            {activeTab === 'wallet' ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <TokenList onSelectToken={handleSelectToken} onUpdateTotalBalance={updateTotalBalance} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-xl font-bold mb-4">Game Tokens</h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* NFTのプレースホルダー */}
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">NFT {item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-500 mt-4">
                  NFTデータは後ほど実装予定
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* モーダル */}
      {selectedToken && (
        <div className="fixed inset-0 z-50">
          <SendModal token={selectedToken} onClose={closeModal} />
        </div>
      )}
    </main>
  );
}
