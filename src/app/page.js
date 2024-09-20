'use client';
import { useEffect } from "react";
import DraggableBackground from '../components/draggable';

// Function to connect to solana Wallet
async function getAccount() {
  try {
    // Connect to the wallet and request the testnet network
    await window.solana.connect({ network: 'testnet' });
    if (window.solana.isConnected) {
      window.location.href = "/main";
    }
  } catch (error) {
    console.error("Error connecting to Solana Wallet:", error);
  }
}

export default function Landing() {
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Attempt to connect to solana Wallet
        await window.solana.connect();
        // If connected, redirect to the main page
        if (window.solana.isConnected) {
          window.location.href = "/main";
        }
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    };

    // Wait until solana Wallet object is available
    if (window.solana) {
      setTimeout(checkConnection, 100);
    }
  }, []);

  return (
    <main>
      <DraggableBackground />
      <div className="flex flex-col justify-center items-center h-screen">
        <button className="p-[3px] relative" onClick={getAccount}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
            Connect with Phantom Wallet
          </div>
        </button>
      </div>
    </main>
  );
}
