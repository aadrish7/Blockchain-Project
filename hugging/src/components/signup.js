// SignUp.js

import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        doctorId: '',
        hospitalId: '',
        specialization: '',
        accessRights: '',
        location: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/auth/signup', formData);
            console.log(response.data);
            // Redirect or show success message
        } catch (error) {
            console.error(error.response.data);
            // Show error message
        }
    };

    return (
<div class="signup-container">
    <h1 class="signup-title">Sign Up</h1>
    <form class="signup-form" onSubmit={handleSubmit}>
        <input type="text" class="signup-input" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="text" class="signup-input" name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input type="text" class="signup-input" name="doctorId" placeholder="Doctor ID" onChange={handleChange} />
        <input type="text" class="signup-input" name="hospitalId" placeholder="Hospital ID" onChange={handleChange} />
        <input type="text" class="signup-input" name="specialization" placeholder="Specialization" onChange={handleChange} />
        <input type="text" class="signup-input" name="accessRights" placeholder="Access Rights" onChange={handleChange} />
        <input type="text" class="signup-input" name="location" placeholder="Location" onChange={handleChange} />
        <input type="password" class="signup-input" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit" class="signup-button">Sign Up</button>
    </form>
</div>

    );
};

export default SignUp;
