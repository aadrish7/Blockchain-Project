
const { ethers } = require('hardhat');

// scripts/deploy.js
async function main() {
    const SignUp = await ethers.getContractFactory('SC_20_21_13_28');
    const signUp = await SignUp.deploy();
    await signUp.deployed();
    console.log('Contract deployed to:', signUp.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  