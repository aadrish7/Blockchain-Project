import React from 'react';
import { Link } from 'react-router-dom';
import './landingpage.css';

const LandingPage = () => {
  return (
    <div className="LandingPageContainer">
      <h1>Welcome to Our Hugging Face Like Platform</h1>
      <Link to="/login"><button className="Button">Login</button></Link>
      <Link to="/signup"><button className="Button">Signup</button></Link>
    </div>
  );
};

export default LandingPage;
