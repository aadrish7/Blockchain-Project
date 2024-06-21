import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import './landingpage.css';

const LandingPage = () => {

  // *** Checking if there is token already in the browser :
  const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

  // If authToken exists, redirect to '/userpage'
  if (authToken) {
    return <Navigate to="/userpage" />;
  }



  return (
    <div className="LandingPageContainer">
      <h1>Welcome to Our Hugging Face Like Platform</h1>
      <Link to="/login"><button className="Button">Login</button></Link>
      <Link to="/signup"><button className="Button">Signup</button></Link>
    </div>
  );
};

export default LandingPage;
