"use client";
export const runtime = 'edge';

import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { readContract } from 'wagmi/actions';
import TokenList from "@/components/TokenList";
import SendModal from "@/components/SendModal";
import Image from "next/image";
import { sepolia } from "viem/chains";
import { Address } from "viem";
import { config } from "@/config";

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

const GAME_COIN_ADDRESS: Address = "0xYourGameCoinAddress"; // ← 実アドレスに置き換えてください
const GAME_COIN_ABI = [
  {
    type: "function",
    name: "gameCoinBalance",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }]
  }
];

export default function Home() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();

  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('wallet');
  const [totalWalletBalance, setTotalWalletBalance] = useState<string>("0.00");
  const [gameCoinBalance, setGameCoinBalance] = useState<string>("0");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const fallbackAddress: Address = '0x40deA50302F41b7B695135b588B1ce2b5834Ccd3';
  const effectiveAddress: Address = (address || fallbackAddress) as Address;

  const fetchGameCoinBalance = async () => {
    if (!chainId || chainId !== sepolia.id) return;
    try {
      const raw = await readContract(
        config,
        {
          abi: GAME_COIN_ABI,
          address: GAME_COIN_ADDRESS,
          functionName: 'gameCoinBalance',
          args: [effectiveAddress]
        }
      );
      setGameCoinBalance(String(raw));
    } catch (err) {
      console.error("GameCoin取得失敗:", err);
      setGameCoinBalance("0");
    }
  };

  useEffect(() => {
    if (isConnected) {
      console.log("ウォレット接続済み:", address);
    }
    setIsInitialized(true);
  }, [isConnected, address]);

  useEffect(() => {
    document.body.style.overflow = selectedToken ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedToken]);

  useEffect(() => {
    fetchGameCoinBalance();
  }, [address, chainId]);

  useEffect(() => {
    if (activeTab === 'gameToken') {
      fetchGameCoinBalance();
    }
  }, [activeTab]);

  if (!isInitialized) {
    return (
      <main className="min-h-screen px-4 flex items-center justify-center bg-gray-100">
        <p className="text-lg">ウォレット接続状態を確認中...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-0 pb-12 flex-1 flex flex-col items-center bg-gray-100">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mt-4">
          <appkit-button />
          <span className="text-xs text-gray-400 mt-1">ver 9 SEPOLIA</span>
        </div>

        {isConnected && (
          <>
            <div className="mt-4 mb-4">
              <div className="flex rounded-lg overflow-hidden bg-gray-700">
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === 'wallet' ? 'bg-gray-600 text-white' : 'text-gray-300'
                  }`}
                  onClick={() => setActiveTab('wallet')}
                >
                  Wallet
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === 'gameToken' ? 'bg-gray-600 text-white' : 'text-gray-300'
                  }`}
                  onClick={() => setActiveTab('gameToken')}
                >
                  Game Token
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm mb-4 text-center">
              <h2 className="text-lg text-gray-500 mb-2">
                {activeTab === 'wallet' ? 'Wallet Balance' : 'BCM Balance'}
              </h2>
              <p className="text-3xl font-bold">
                {activeTab === 'wallet' ? `$${totalWalletBalance}` : `${gameCoinBalance} BCM`}
              </p>
            </div>

            <div className="flex justify-between mb-4 gap-2">
              <div className="flex-1 bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
                <div className="flex items-center">
                  <Image src="/images/tokens/eth.png" alt="Ethereum" width={24} height={24} className="mr-2" />
                  <span>{chainId === sepolia.id ? 'Sepolia' : 'Ethereum'}</span>
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

            {activeTab === 'wallet' ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <TokenList onSelectToken={setSelectedToken} onUpdateTotalBalance={setTotalWalletBalance} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sepoliaネットワークに接続されています</span>
                </div>
                <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>GameCoin残高: {gameCoinBalance} BCM</span>
                </div>
                <h2 className="text-xl font-bold mb-4">Game Tokens</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">NFT {item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-500 mt-4">NFTデータは後ほど実装予定</p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedToken && (
        <div className="fixed inset-0 z-50">
          <SendModal token={selectedToken} onClose={() => setSelectedToken(null)} />
        </div>
      )}
    </main>
  );
}
