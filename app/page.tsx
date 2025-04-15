"use client";
export const runtime = 'edge'
import { useState } from "react";
import { useAccount } from "wagmi";
import TokenList from "@/components/TokenList";
import SendModal from "@/components/SendModal";

interface Token {
  symbol: string
  name: string
  balance: string
  formattedBalance: string
  decimals: number
  address?: string
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

  return (
    <main className="min-h-screen px-8 py-0 pb-12 flex-1 flex flex-col items-center">
      <header className="w-full py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/reown-logo.png" alt="logo" className="w-35 h-10 mr-2" />
          <div className="hidden sm:inline text-xl font-bold">Reown - AppKit EVM</div>
        </div>
      </header>
      // <h2 className="my-8 text-2xl font-bold leading-snug text-center">Examples</h2>
      <div className="max-w-4xl">
        <div className="grid bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <h3 className="text-sm font-semibold bg-gray-100 p-2 text-center">Connect your wallet</h3>
          <div className="flex justify-center items-center p-4">
          <appkit-button />
          </div>
        </div>
        <br></br>
        {isConnected && (
          <>
            <div className="grid bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <h3 className="text-sm font-semibold bg-gray-100 p-2 text-center">Network selection button</h3>
              <div className="flex justify-center items-center p-4">
                <appkit-network-button />
              </div>
            </div>

            {/* トークンリスト */}
            <div className="grid bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mt-4">
              <h3 className="text-sm font-semibold bg-gray-100 p-2 text-center">トークン一覧</h3>
              <div className="p-4">
                <TokenList onSelectToken={handleSelectToken} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* モーダルはページ全体の上に重なるように */}
      {selectedToken && (
        <div className="fixed inset-0 z-50">
          <SendModal token={selectedToken} onClose={closeModal} />
        </div>
      )}

    </main>
  );
}
