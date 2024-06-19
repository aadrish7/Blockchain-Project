// Import necessary modules
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import for the signature creation :
const ethUtil = require('ethereumjs-util');
const secp256k1 = require('secp256k1');

const Individual = require('../models/individual'); // Import the Individual model


// 3rd party's private key :
const PRIVATEKEY = '29a51884dea81b2eb575cd46bd51bd703cfb4c45e44ff0ee00f113b7b4339088'

// function signMessage(message)
// {
//     const privateKeyBuffer = Buffer.from(PRIVATEKEY, 'hex')
//     const messageHash = ethUtil.keccak256(Buffer.from(message));
//     const { signature } = secp256k1.ecdsaSign(messageHash, privateKeyBuffer);
//     const signatureHex = Buffer.from(signature).toString('hex');
//     return signatureHex;
// }


function signMessage(message) {
    const privateKeyBuffer = Buffer.from(PRIVATEKEY, 'hex');

    // Step 1: Hash the original message
    const messageHash = ethUtil.keccak256(Buffer.from(message));
    console.log("Original Message Hash is:", Buffer.from(messageHash).toString('hex'));

    // Step 2: Prefix the message hash
    const prefix = "\x19Ethereum Signed Message:\n32";
    const prefixedMessage = ethUtil.keccak256(Buffer.concat([Buffer.from(prefix), messageHash]));

    console.log("Prefixed Message Hash is:", Buffer.from(prefixedMessage).toString('hex'));

    // Step 3: Sign the final hash
    const { signature } = secp256k1.ecdsaSign(prefixedMessage, privateKeyBuffer);
    const signatureHex = Buffer.from(signature).toString('hex');
    
    return signatureHex;
}


// Signup Route
router.post('/signup', async (req, res) => {
    try {
        // Check if the username already exists
        const existingUser = await Individual.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newIndividual = new Individual({
            username: req.body.username,
            fullName: req.body.fullName,
            doctorId: req.body.doctorId,
            hospitalId: req.body.hospitalId,
            specialization: req.body.specialization,
            accessRights: req.body.accessRights,
            location: req.body.location,
            password: req.body.password
        });

        await newIndividual.save();
        console.log("signup successful")
        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        res.status(500).json({ message: 'Signup failed', error: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        console.log("req.body", req.body)
        // Find the individual by username
        const individual = await Individual.findOne({ username: req.body.username });

        if (!individual) {
            return res.status(400).json({ message: 'Invalid username!' });
        }
        
        // Check the password
        const passwordMatch = req.body.password === individual.password;
        console.log("passwordMatch", passwordMatch)
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid password!' });
        }
        console.log("login successful")

        // // Generate JWT token
        // const token = jwt.sign({ userId: individual._id }, 'your_secret_key_here', { expiresIn: '1h' });

        // Generating our own custom token :

        let tokenString = individual.doctorId + "," + individual.hospitalId + "," + individual.specialization + "," + individual.location; 
        let tokenSignature = signMessage(tokenString)  

        // res.status(200).json({ message: 'Login successful', token: token });
        res.status(200).json({ message: 'Login successful', token: tokenSignature });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

module.exports = router;