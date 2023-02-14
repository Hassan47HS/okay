import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AssetTracker from "../utils/AssetTracker.json";
import { ethers } from "ethers";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMagnifyingGlass, fas } from "@fortawesome/free-solid-svg-icons";

const CONTRACT_ADDRESS = "0xE3df8310532d88f6337f61C166446d2672BFe3fa";
library.add(fas);

function Metamask() {
    const [currentAccount, setCurrentAccount] = useState("");
    const [wallet, setWallet] = useState("Please Connect Your Wallet to Proceed");
    const [contract, setContract] = useState(null);
  
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Make sure you have Metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
  
      const accounts = await ethereum.request({ method: "eth_accounts" });
  
      if (accounts.length !== 0) {
        const account = accounts[0];
  
        console.log("Found an authorized account:", account);
        setWallet("Connected");
  
        setCurrentAccount(account);
  
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          AssetTracker.abi,
          signer
        );
        console.log("contract", contract);
        setContract(contract);
      } else {
        console.log("No authorized account found");
      }
    };
  
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
  
        if (!ethereum) {
          alert("Get Metamask!");
          return;
        }
  
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
  
        console.log("Connected", accounts[0]);
  
        setWallet("Connected");
  
        setCurrentAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          AssetTracker.abi,
          signer
        );
        setContract(contract);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      checkIfWalletIsConnected();
    }, []);
  
    return (
      <div>
        {wallet !== "Connected" ? (
          <button onClick={connectWallet}>Connect to Metamask</button>
        ) : (
          <Link to="/manufec">Connection Established Succesfully. Click here to proceed</Link>
        )}
      </div>
    );
}
export default Metamask;
