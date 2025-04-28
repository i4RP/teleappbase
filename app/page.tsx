"use client";
import { useEffect } from "react";

export default function Home() {
  // ...既存のコード...

  useEffect(() => {
    // Telegram環境での外部リンク処理をカスタマイズ
    const appkitButton = document.querySelector("appkit-button");
    if (appkitButton && typeof window.Telegram !== "undefined") {
      appkitButton.addEventListener("click", (event) => {
        event.preventDefault();
        const walletConnectLink = "https://metamask.app.link"; // WalletConnect用のリンク
        window.Telegram.WebApp.openLink(walletConnectLink);
      });
    }
  }, []);

  return (
    <main>
      {/* 既存のコード */}
      <appkit-button />
    </main>
  );
}
