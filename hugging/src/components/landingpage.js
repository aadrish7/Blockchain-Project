// LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './landingpage.css';

const LandingPage = () => {
  return (
    <div className="LandingPageContainer">
      <h1 className="AnimatedText">Welcome to Our Hugging Face Like Platform</h1>
      <div className="ButtonContainer">
        <Link to="/login"><button className="Button">Login</button></Link>
        <Link to="/signup"><button className="Button">Signup</button></Link>
      </div>
    </div>
  );
};

export default LandingPage;
