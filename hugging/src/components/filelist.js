import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import './filelist.css';

function FileList() {
  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [myCreds,setmyCreds] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [result, setResult] = useState("");
  const [notification, setNotification] = useState("");  // State to hold notifications
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  // ABI and Address of your Smart Contract
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
}]; // Your contract's ABI
  const address = "0x8b18DeBe665AA7aCB94e32977a432C598B5E7271"; // Your contract's address

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await axios.get('http://localhost:3001/files');
        setFiles(response.data.files);
        setNotification("Files fetched successfully.");
      } catch (error) {
        setError('Error fetching files');
      }
    }

    fetchFiles();
    initializeWeb3();
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

  const checkPermissions = async (fileName) => {
    try {
      const credentials = await axios.get(`http://localhost:3001/api/individuals/${inputValue}`);
      setNotification("Credentials retrieved successfully.");
      console.log("credentials", credentials);
      setmyCreds(credentials);
      console.log("My creds are : ", myCreds);
      const { doctorId, hospitalId, specialization, accessRights, location } = credentials.data;
      const temp = await contract.methods.evaluate(doctorId, doctorId, hospitalId, specialization, accessRights, location).call({ from: account });
      setTimeout(async () => {
        const evaluationResult = await contract.methods.getEvaluationResult(doctorId).call();
        console.log('Evaluation result:', evaluationResult);
        setResult(evaluationResult);
        setNotification("Smart contract invoked successfully. Result: " + evaluationResult);
      }, 10000);
      console.log("Result", result);
      return result === "Permit";
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  };

  const handleDownload = async (fileName) => {
    if (!contract) {
      setError('Smart contract not connected. Please check MetaMask.');
      return;
    }
    console.log("smart contract invoked successfully");
    const isAllowed = await checkPermissions(fileName);
    if (isAllowed) {
      try {
        const response = await axios.get(`http://localhost:3001/files/${fileName}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setNotification("Download ready: " + fileName);
        setResult("");
      } catch (error) {
        setError('Error downloading file');
      }
    } else {
      setError('You do not have permission to download this file.');
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (!inputValue) {
      setNotification("Please enter a file name.");
      return;
    }
    console.log("Submitting for: ", inputValue);
    // You can call checkPermissions or any other function here
    setNotification("Checking permissions for " + inputValue);
    handleDownload(inputValue);
  };

  return (
    <> 
        
    
      <div>
        <h2 id="headerTitle" class="header-title">Uploaded Files</h2>
        <button onClick={connectMetamask}>Connect MetaMask</button>
      </div>
      <div class="file-list-container" id="fileListContainer">
      <form onSubmit={handleSubmit}>
    <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Enter doc ID" />
    <button type="submit">Check Permissions</button>
  </form>
        {/* {error && <p class="error-message" id="errorMessage">{error}</p>} */}
        {notification && <p class="notification-message" id="notificationMessage">{notification}</p>}
        <ul class="file-list" id="fileList">
          {files.map((file, index) => (
            <li key={index} class="file-item" id={`fileItem-${index}`} onClick={() => handleDownload(file)}>
              {file}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default FileList;
