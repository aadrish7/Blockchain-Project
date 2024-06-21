import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './login.css';
import { UsernameContext } from '../userdata/usernamecontext';





const Login = () => {
    const { setUsername } = useContext(UsernameContext); 
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error message when user changes input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/auth/login', formData);

            if (response.status === 200) {
                // Redirect to another route upon successful login
                setUsername(formData.username); 
                window.location.href = '/userpage'; // Use window.location.href to navigate
                const token = response.data.token;
                console.log("the token is : ", token)
                localStorage.setItem('authToken', token);
                // alert('Login successful!');
            }
        } catch (error) {
            console.error(error.response.data);
            setError('Invalid username or password'); // Set error message
        }
    };

    return (
        <div id="login-container" className="container">
            <h2 className="form-title">Login</h2>
            <form id="login-form" className="form" onSubmit={handleSubmit}>
                <input type="text" id="username" className="input username" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="password" id="password" className="input password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit" className="submit-btn">Login</button>
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
                <p>Don't have an account? <Link to="/signup">Register</Link></p> {/* Use Link component */}
            </form>
        </div>
    );
};

export default Login;
