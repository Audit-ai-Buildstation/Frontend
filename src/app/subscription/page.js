'use client';
import { Cluster, clusterApiUrl, Connection, PublicKey, Keypair } from '@solana/web3.js';
import { encodeURL, createQR } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { useRef, useState, useEffect } from 'react';
import { BackgroundBeamsWithCollision } from '../../components/background-beams';
import Sidebar from '../../components/sidebar-export';	

async function confirmAmount(donationAmount, walletAddress, setQrCode, token) {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const recipient = new PublicKey('DUjGzZUsjkTpUZFWDnxFnzJGXHdBmAN8UUifyi717Ncs');
  const amount = new BigNumber(donationAmount);
  const reference = new Keypair().publicKey;
  const label = 'Audit.ai';
  const message = 'donation by ' + walletAddress;
  const memo = 'Audit.ai donation';


  if(token === ""){
    const url = encodeURL({ recipient, amount, reference, label, message, memo });

    const qrCode = createQR(url);
    setQrCode(qrCode);
  }
  else
  {
    const splToken = new PublicKey(token);

    const url = encodeURL({ recipient, amount, splToken, reference, label, message, memo });
    console.log(token);
    const qrCode = createQR(url);
    setQrCode(qrCode);
  }
}

const SubscriptionPage = () => {
  const [selectedToken, setSelectedToken] = useState('SOL');
  const [donationAmount, setDonationAmount] = useState('0.05');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [qrCode, setQrCode] = useState(null);
  const qrRef = useRef(null);
  const [splToken, setSplToken] = useState("");
  const dropdownRef = useRef(null);
  const [transactionStatus, setTransactionStatus] = useState(null);


  const tokens = [
    { 
      symbol: 'SOL', 
      icon: 'https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fsolana-labs%2Ftoken-list%40main%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png&fit=cover&width=128&height=128' ,
      splToken: ""
    },
    // {
    //   symbol: 'USDC',
    //   icon: 'https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fdhc7eusqrdwa0.cloudfront.net%2Fassets%2Fusdc.png&fit=cover&width=128&height=128',
    //   splToken: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
    // }
  ];

  

  useEffect(() => {
    if (transactionStatus === 'waiting') {
      const checkTransaction = async () => {
        try {
          const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
          const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });
          setTransactionStatus('confirmed');
        } catch (error) {
          console.error('Error checking transaction:', error);
          setTransactionStatus('error');
        }
      };

      const interval = setInterval(checkTransaction, 1000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [transactionStatus]);

  useEffect(() => {
    const checkConnection = async () => {
        try {
            await window.solana.connect();
            if (!window.solana.isConnected) {
                window.location.href = "/";
            } else {
                const address = window.solana.publicKey.toString();
                setWalletAddress(address);
            }
        } catch (err) {
            window.location.href = "/";
        } finally {
            setWalletLoading(false); 
        }
    };

    if (window.solana) {
        setTimeout(checkConnection, 100);
    } else {
        window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTokenSelect = (token) => {
    setSelectedToken(token.symbol);
    setSplToken(token.splToken);
    setIsDropdownOpen(false);
  };

  const handleDonate = async () => {
    setTransactionStatus('generating');
    await confirmAmount(donationAmount, walletAddress, setQrCode, splToken);
    setTransactionStatus('waiting');
  };

  useEffect(() => {
    if (qrCode && qrRef.current) {
      qrCode.append(qrRef.current);
    }
  }, [qrCode]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <BackgroundBeamsWithCollision className="flex-grow flex flex-col justify-center items-center">
        <div className="bg-white border-4 border-black p-8 rounded-lg w-96">
          <div className="mb-4 bg-grey-600">
            <span className="text-xl font-medium text-black">Buy Me a Coffee ☕</span>
            <div className="mt-1 relative rounded-md shadow-sm h-30">
              <input
                type="text"
                value={donationAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setDonationAmount(value);
                  }
                }}
                className="bg-slate-200 h-16 text-black focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-20 text-2xl border-gray-300 rounded-md"
                placeholder="0"
                min="0"
                step="any"
              />

              <div className="absolute inset-y-0 right-1 flex items-center">
                <div ref={dropdownRef}>
                  <button
                    type="button"
                    className="text-black bg-white inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <img
                      src={tokens.find(t => t.symbol === selectedToken).icon}
                      alt={selectedToken}
                      className="h-5 w-5 rounded-full mr-2"
                    />
                    {selectedToken}
                    <svg className="ml-2 -mr-0.5 h-5 w-5" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {tokens.map((token) => (
                          <button
                            key={token.symbol}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                            role="menuitem"
                            onClick={() => handleTokenSelect(token)}
                          >
                            <img src={token.icon} alt={token.symbol} className="h-5 w-5 rounded-full mr-2" />
                            {token.symbol}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDonate}
            className="text-white w-full bg-indigo-600 py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
          >
            Donate
          </button>
        </div>
        {qrCode && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Scan QR Code to Donate</h2>
          <div id="qr-code" ref={qrRef}></div>
          <h2 className="text-xl font-bold mb-4 text-center">
            Thank you for your donation!
          </h2>
          <button
            onClick={() => setQrCode(null)}
            className="mt-4 text-white bg-indigo-600 py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    )}
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default SubscriptionPage;