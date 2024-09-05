'use client'
import { useEffect } from "react";
import DraggableBackground from '../components/draggable';
// import logo from '../app/logo_copy.jpg';
async function getAccount() {
  await window.solana.connect();
  if(window.solana.isConnected) {
    window.location.href = "/main";
  }
}

export default function Landing() {

  useEffect(() => {
    const checkConnection = async () => {
        try {
            // Attempt to connect
            window.solana.connect();
            
            // If not connected, redirect to the home page
            if (window.solana.isConnected) {
                window.location.href = "/main";
            }
        } catch (err) {
            
        }
    };

    // Delay check until Phantom wallet object is available
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
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
          Connect with Phantom
          </div>
        </button>
      </div>
    </main>
  );
}
