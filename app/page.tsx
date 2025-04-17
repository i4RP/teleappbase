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
}

export default function Home() {
  const { isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token);
  };

  const closeModal = () => {
    setSelectedToken(null);
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
    <main className="min-h-screen px-8 py-0 pb-12 flex-1 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        {/* ウォレット接続 */}
        <div className="grid bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <h3 className="text-sm font-semibold bg-gray-100 p-2 text-center">Connect your wallet</h3>
          <div className="flex justify-center items-center p-4">
            <appkit-button />
          </div>
        </div>

        {/* ネットワーク選択＆トークンリスト */}
        {isConnected && (
          <>
            <div className="grid bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mt-4">
              <h3 className="text-sm font-semibold bg-gray-100 p-2 text-center">Network selection button</h3>
              <div className="flex justify-center items-center p-4">
                <appkit-network-button />
              </div>
            </div>

            <div className="grid bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mt-4">
              <h3 className="text-sm font-semibold bg-gray-100 p-2 text-center">トークン一覧</h3>
              <div className="p-4">
                <TokenList onSelectToken={handleSelectToken} />
              </div>
            </div>
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
