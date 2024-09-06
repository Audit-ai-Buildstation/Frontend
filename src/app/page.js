'use client';
import { useEffect } from "react";
import DraggableBackground from '../components/draggable';

// Function to connect to bitkeep.solana Wallet
async function getAccount() {
  try {
    for (const key in window) {
      if (window.hasOwnProperty(key)) {
        console.log(key);
      }
    }
    // Assuming bitkeep.solana Wallet is injected as `window.bitkeep.solana`
    await window.bitkeep.solana.connect();
    if (window.bitkeep.solana.isConnected) {
      window.location.href = "/main";
    }
  } catch (error) {
    console.error("Error connecting to bitkeep.solana Wallet:", error);
  }
}

export default function Landing() {
  useEffect(() => {
    const checkConnection = async () => {
      try {
        for (const key in window) {
          if (window.hasOwnProperty(key)) {
            console.log(key);
          }
        }
        // Attempt to connect to bitkeep.solana Wallet
        await window.bitkeep.solana.connect();
        console.log("Connected to bitkeep.solana Wallet");
        // If connected, redirect to the main page
        if (window.bitkeep.solana.isConnected) {
          window.location.href = "/main";
        }
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    };

    // Wait until bitkeep.solana Wallet object is available
    if (window.bitkeep.solana) {
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
            Connect with Bitget Wallet
          </div>
        </button>
      </div>
    </main>
  );
}
