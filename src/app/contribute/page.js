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
                await window.bitkeep.solana.connect();
                if (!window.bitkeep.solana.isConnected) {
                    window.location.href = "/";
                } else {
                    const address = window.bitkeep.solana.publicKey.toString();
                    setWalletAddress(address);
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

    const options = [
        "Reentrancy",
        "Integer Overflow and Underflow",
        "Unchecked Call Return Values",
        "Denial of Service (DoS)",
        "Timestamp Dependence",
        "Front-Running",
        "Delegatecall Injection",
        "Access Control Issues",
        "Unprotected Self-Destruct",
        "Randomness Vulnerabilities",
        "Short Address Attack",
        "Gas Limit Vulnerabilities",
        "Inadequate Error Handling",
        "Contract Upgradeability Issues",
        "Phishing with tx.origin",
        "Insufficient Testing",
        "Logic Errors",
        "Unrestricted Ether Withdrawal",
        "Contract State Exposure",
        "Signature Replay Attack"
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
        formData.append("vulnerabilityType", selectedOption); // Add additional data if necessary

        try {
            const response = await fetch("http://localhost:5000/upload", { // Change to your Python backend URL
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