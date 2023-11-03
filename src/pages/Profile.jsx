import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { doc, updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';

import { database } from '../../firebase.config';
import { toast } from 'react-toastify';

const Profile = () => {
  const auth = getAuth();

  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const navigate = useNavigate();

  // destructuring form data
  const { name, email } = formData;

  // handler functions
  const onLogout = () => {
    // logout
    auth.signOut();

    // redirecting the user to homepage
    navigate('/');
  };

  const onClickHandler = () => {
    changeDetails && onSubmitHandler();
    setChangeDetails((prevState) => !prevState);
  };

  const onSubmitHandler = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        //update display name in firestore
        const userReference = doc(database, 'users', auth.currentUser.uid);
        await updateDoc(userReference, { name });
      }
    } catch (error) {
      toast.error('Profile details could not be updated.');
    }
  };

  // changing name and/or email infos
  const onChangeHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <h1 className='pageHeader'>My Profile</h1>
        <button type='button' className='logout' onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className='profileDetailsHeader'>
          <p className='personalDetailsText'>Personal Details</p>
          <p className='changePersonalDetails' onClick={onClickHandler}>
            {changeDetails ? 'Done' : 'Change'}
          </p>
        </div>
        <div className='profileCard'>
          <form>
            <input
              type='text'
              id='name'
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChangeHandler}
              autoComplete='off'
            />
            <input
              type='text'
              id='email'
              className='profileEmail'
              disabled='disabled'
              value={email}
              onChange={onChangeHandler}
              autoComplete='off'
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
