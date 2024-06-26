import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import './filelist.css';
import myContract from '../artifacts/contracts/SC_20_21_13_28.sol/SC_20_21_13_28.json';
const ethers = require("ethers");

const NODE_URL = "wss://sepolia.infura.io/ws/v3/f95f2b17b00a4d24b20398a713322329";
const web3 = new Web3(NODE_URL);

function encodeEvent(event) {
  const keccakHash = web3.utils.keccak256(event);
  console.log("your event hash is : ", keccakHash)
  return keccakHash;
}

const myContractAddress = '0x1c2Ab6b1943f00f40bfff1079709A9394839Cb05';

function FileList() {
  const [inputValue, setInputValue] = useState("");
  const [selectedDataset, setSelectedDataset] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [myCreds, setmyCreds] = useState('');
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [result, setResult] = useState("");
  const [notification, setNotification] = useState("");
  const [notification1, setNotification1] = useState("");
  const [notification2, setNotification2] = useState("");
  const [notification3, setNotification3] = useState("");
  const [notification4, setNotification4] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleDatasetChange = (event) => {
    setSelectedDataset(event.target.value);
  };

  const ABI = [{
    "inputs": [
        {
            "internalType": "string",
            "name": "ID",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "doctorID",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "hospitalID",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "specialization",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "accessRights",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "Location",
            "type": "string"
        }
    ],
    "name": "evaluate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
},
{
    "inputs": [],
    "name": "calls",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "string",
            "name": "ID",
            "type": "string"
        }
    ],
    "name": "getEvaluationResult",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}]; 
  const address = "0xdbAbcc32657D3BDeb8464FdF74033500BA80fA18"; 

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await axios.get('http://localhost:3001/files');
        setFiles(response.data.files);
        setNotification("Datasets fetched successfully.");
      } catch (error) {
        setError('Error fetching Datasets');
      }
    }

    fetchFiles();
    initializeWeb3();
    document.body.classList.add('file-list-page');
    return () => {
      document.body.classList.remove('file-list-page');
    };
  }, []);

  const initializeWeb3 = () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      const contractInstance = new window.web3.eth.Contract(ABI, address);
      setContract(contractInstance);
      setNotification("MetaMask is connected.");
    } else {
      setError('MetaMask is not installed!');
    }
  };

  const connectMetamask = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setNotification("MetaMask account connected.");
    } catch (error) {
      setError('MetaMask connection error!');
    }
  };

  const checkPermissions = async (file) => {
    try {
      const fileName = file.replace(/\.[^/.]+$/, "");
      const result = await contract.methods.getEvaluationResult(fileName).call({ from: account });
      console.log("Result: ", result);

      if (result == 0) {
        setNotification4("Evaluation not completed yet. Please wait...");
      }
      if (result == 1) {
        setNotification1("User is authorized. Please proceed with the download.");
      } else {
        setNotification3("User not authorized!");
      }
    } catch (error) {
      console.error("Error checking permissions: ", error);
      setError('Error checking permissions');
    }
  };

  const handleDownload = async (inputValue, file) => {
    if (!inputValue) {
      setNotification("Please enter your username.");
      return;
    }

    await checkPermissions(file);

    try {
      const response = await axios.get(`http://localhost:3001/download/${file}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setNotification("File downloaded successfully.");
    } catch (error) {
      console.error('Error downloading file: ', error);
      setError('Error downloading file');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!inputValue) {
      setNotification("Please enter your username.");
      return;
    }
    if (!selectedDataset) {
      setNotification("Please select a dataset.");
      return;
    }
    console.log("Submitting for: ", inputValue);
    setNotification("Checking your permissions for " + selectedDataset);
    handleDownload(inputValue, selectedDataset);
  };

  return (
    <> 
      <div>
        <h2 id="headerTitle" class="header-title">Uploaded Files</h2>
        <button class="ConnectMetamask" onClick={connectMetamask}>Connect MetaMask</button>
      </div>
      <div class="file-list-container" id="fileListContainer">
        <form onSubmit={handleSubmit}>
          <input style={{backgroundColor:"white"}} type="text" value={inputValue} onChange={handleInputChange} placeholder="Enter your username" />
          <select style={{backgroundColor:"white", width:"calc(100% - 40px)", color: 'grey'}} value={selectedDataset} onChange={handleDatasetChange}>
            <option value="" disabled>Select a dataset</option>
            {files.map((file, index) => (
              <option key={index} value={file}>{file}</option>
            ))}
          </select>
          <button class="CheckPermissions" type="submit">Check Permissions & Download File</button>
        </form>
        {notification && <p class="notification-message" id="notificationMessage">{notification}</p>}
        {notification1 && <p class="notification-message" id="notificationMessage">{notification1}</p>}
        {notification3 && <p class="notification-message" id="notificationMessage">{notification3}</p>}
        {notification4 && <p class="notification-message" id="notificationMessage">{notification4}</p>}
        {error && <p class="notification-message error-message" id="notificationMessage">{error}</p>}
        <ul class="file-list" id="fileList">
          {/* {files.map((file, index) => (
            <li key={index} class="file-item" id={`fileItem-${index}`} onClick={() => handleDownload(inputValue, file)}>
              {file}
            </li>
          ))} */}
        </ul>
      </div>
    </>
  );
}

export default FileList;
