'use client'
import { useEffect, useState } from "react";
import { BackgroundBeamsWithCollision } from '../../components/background-beams';
import Sidebar from '../../components/sidebar-export';	

export default function Main() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [walletLoading, setWalletLoading] = useState(true); 
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                await window.bitkeep.solana.connect();
                if (!window.bitkeep.solana.isConnected) {
                    window.location.href = "/";
                } else {
                    console.log("Phantom wallet is connected.");
                    const address = window.bitkeep.solana.publicKey.toString();
                    setWalletAddress(address);
                    console.log("Connected wallet address:", address);
                }
            } catch (err) {
                console.error("Connection was canceled or an error occurred:", err);
                window.location.href = "/";
            } finally {
                setWalletLoading(false); 
            }
        };

        if (window.bitkeep.solana) {
            setTimeout(checkConnection, 100);
        } else {
            window.location.href = "/";
        }
    }, []);

    const readFileContent = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target.result);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsText(file);
        });
    };

    const handleSubmit = async () => {
        if (file) {
            setIsLoading(true); 
            try {
                const fileContent = await readFileContent(file);
                const response = await fetch('http://localhost:5000/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: fileContent }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const data = await response.json();
                setResult(data);
                setError(''); 
            } catch (error) {
                setError(error.message);
                setResult(''); 
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar/>

            <BackgroundBeamsWithCollision className="flex-grow flex flex-col justify-center items-center">
                <label className="p-[3px] relative cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                    <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                        <input
                            type="file"
                            accept=".sol"
                            name="solidity file"
                            className="fileInput hidden"
                            onChange={(e) => {
                                setFile(e.target.files[0]); 
                                setResult(null); 
                                setError(null); 
                            }}
                        />
                        {file ? (
                            <p>{file.name}</p>
                        ) : (
                            <p>+ Upload File</p>
                        )}
                    </div>
                </label>

                <button className="p-[3px] relative mt-4" onClick={handleSubmit}>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                    <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                        {isLoading ? "Loading..." : "Check For Vulnerability"}
                    </div>
                </button>

                {result && (
                    <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
                        <p>Result: {result.gnn_prediction}</p>
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
                        <p>Error: {error}</p>
                    </div>
                )}
            </BackgroundBeamsWithCollision>
        </div>
    );
}
