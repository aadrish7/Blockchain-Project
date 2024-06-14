import { Link } from 'react-router-dom';
import { useContext } from 'react';
import './userpage.css';
import { UsernameContext } from '../userdata/usernamecontext';
import React, { useEffect } from 'react';
const UserPage = () => {
  const { username } = useContext(UsernameContext);
  console.log("username", username)
  useEffect(() => {
    // Add the class to the body when the component mounts
    document.body.classList.add('user-page');
    
    // Clean up the class when the component unmounts
    return () => {
        document.body.classList.remove('user-page');
    };
}, []);

  return (
    
    <div className='UserPageContainer'>
      <h1 >Welcome {username} to Hugging Face!</h1>
      <Link to="/filelist"><button className="Button">View Datasets</button></Link>
      <Link to="/fileupload"><button className="Button">Upload Datasets</button></Link>
    </div>
  );
}

export default UserPage;
