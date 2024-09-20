'use client'
import { useEffect, useState, useRef } from "react";
import { BackgroundBeamsWithCollision } from '../../components/background-beams'; 
import Sidebar from '../../components/sidebar-export';	


export default function Contribute() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [walletLoading, setWalletLoading] = useState(true); 
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Select an option"); // State for the dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Create a ref for the dropdown

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

    const options = [
        "Unencrypted Private Data On-Chain",
        "Code With No Effects",
        "Message call with hardcoded gas amount",
        "Hash Collisions With Multiple Variable Length Arguments",
        "Unexpected Ether balance",
        "Presence of unused variables",
        "Right-To-Left-Override control character (U+202E)",
        "Typographical Error",
        "DoS With Block Gas Limit",
        "Arbitrary Jump with Function Type Variable",
        "Insufficient Gas Griefing",
        "Incorrect Inheritance Order",
        "Write to Arbitrary Storage Location",
        "Requirement Violation",
        "Lack of Proper Signature Verification",
        "Missing Protection against Signature Replay Attacks",
        "Weak Sources of Randomness from Chain Attributes",
        "Shadowing State Variables",
        "Incorrect Constructor Name",
        "Signature Malleability",
        "Block values as a proxy for time",
        "Authorization through tx.origin",
        "Transaction Order Dependence",
        "DoS with Failed Call",
        "Delegatecall to Untrusted Callee",
        "Use of Deprecated Solidity Functions",
        "Assert Violation",
        "Uninitialized Storage Pointer",
        "State Variable Default Visibility",
        "Reentrancy",
        "Unprotected SELFDESTRUCT Instruction",
        "Unprotected Ether Withdrawal",
        "Unchecked Call Return Value",
        "Floating Pragma",
        "Outdated Compiler Version",
        "Integer Overflow and Underflow",
        "Function Default Visibility",
      ];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }
        if (selectedOption === "Select an option") {
            alert("Please select a vulnerability type.");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("vulnerabilityType", selectedOption); 

        switch(this) {
            case "text":
                
                break;
            case "image":

                break;
            case "image":
                
                break;
            case "image":
                
                break;
            case "image":
                
                break;
            case "image":
                
                break;
            case "image":
                
                break;
            case "image":
                
                break;
            case "image":
                
                break;
            case "image":
                
                break;
            case "image":
                
                break;
            case "image":
                
                break;
            case "image":
                
                break;
            case "image":
                
                break;
            case "image":
                
                break;
            
            default:
                console.log('default');
                break;
        }

        try {
            const response = await fetch('http://localhost:5000/upload', { // Change to your Python backend URL
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("File upload failed");
            }

            const data = await response.json();
            alert("File uploaded successfully: " + data.file_id); // Assuming 'file_id' is returned by your Python backend
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

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
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        {file ? (
                            <p>File Selected: {file.name}</p>
                        ) : (
                            <p>+ Upload File</p>
                        )}
                    </div>
                </label>

                <div className="relative p-[3px] mt-4 cursor-pointer min-w-[300px]" ref={dropdownRef}>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg " />
                    <div
                        className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent flex justify-center items-center"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {selectedOption}
                    </div>
                    {isDropdownOpen && (
                        <div className="absolute mt-1 w-full bg-black rounded-lg shadow-lg z-10 text-white max-h-[400px] overflow-y-auto">
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button className="p-[3px] relative mt-4"
                onClick={handleFileUpload}
                disabled={isLoading}>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                    <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                        {isLoading ? "Loading..." : "Contribute"}
                    </div>
                </button>
            </BackgroundBeamsWithCollision>
        </div>
    );
}