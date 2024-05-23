// Import necessary modules
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Individual = require('../models/individual'); // Import the Individual model

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
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        
        // Check the password
        const passwordMatch = req.body.password === individual.password;
        console.log("passwordMatch", passwordMatch)
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        console.log("login successful")

        // Generate JWT token
        const token = jwt.sign({ userId: individual._id }, 'your_secret_key_here', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token: token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

module.exports = router;