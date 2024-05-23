import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import './userpage.css';
import { UsernameContext } from '../userdata/usernamecontext';
const UserPage = () => {
  const { username } = useContext(UsernameContext);
  console.log("username", username)
  return (
    
    <div className='UserPageContainer'>
      <h1>Successful Login!!</h1>
      <h1 >Welcome {username} to Hugging Face!</h1>
      <Link to="/filelist"><button className="Button">View Datasets</button></Link>
      <Link to="/fileupload"><button className="Button">Upload Datasets</button></Link>
    </div>
  );
}

export default UserPage;
