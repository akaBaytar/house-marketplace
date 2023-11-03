import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { getAuth } from 'firebase/auth';

const Profile = () => {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const navigate = useNavigate();

  // destructuring form data
  const { name, email } = formData;

  // handler function
  const onLogout = () => {
    // logout
    auth.signOut();

    // redirecting the user to homepage
    navigate('/');
  };

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <h1 className='pageHeader'>My Profile</h1>
        <button type='button' className='logout' onClick={onLogout}>
          Logout
        </button>
      </header>
    </div>
  );
};

export default Profile;
