import { Fragment } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { database } from '../../firebase.config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import { toast } from 'react-toastify';

import ArrowIcon from '../assets/svg/keyboardArrowRightIcon.svg?react';
import VisibilityIcon from '../assets/svg/visibilityIcon.svg';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // destructuring form data
  const { name, email, password } = formData;

  // handler functions
  const inputHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const formHandler = async (e) => {
    e.preventDefault();

    try {
      // creating user with email
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // adding user info to the database
      const copiedFormData = { ...formData };
      delete copiedFormData.password;
      copiedFormData.timestamp = serverTimestamp();

      await setDoc(doc(database, 'users', user.uid), copiedFormData);

      // redirecting the user to homepage
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong.');
    }
  };

  return (
    <Fragment>
      <div className='pageContainer'>
        <header>
          <h2 className='pageHeader'>Welcome!</h2>
        </header>
        <main>
          <form onSubmit={formHandler}>
            <input
              type='text'
              id='name'
              placeholder='Name'
              className='nameInput'
              value={name}
              onChange={inputHandler}
              autoComplete='name'
            />
            <input
              type='email'
              id='email'
              placeholder='Email'
              className='emailInput'
              value={email}
              onChange={inputHandler}
              autoComplete='email'
            />
            <div className='passwordInputDiv'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                placeholder='Password'
                className='passwordInput'
                value={password}
                onChange={inputHandler}
              />
              <img
                src={VisibilityIcon}
                alt='Show Password'
                className='showPassword'
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>
            <div className='signUpBar'>
              <p className='signUpText'>Sign Up</p>
              <button className='signUpButton'>
                <ArrowIcon fill='#fff' width='36px' height='36px' />
              </button>
            </div>
          </form>
          <Link to='/sign-in' className='registerLink'>
            Sign in Instead
          </Link>
        </main>
      </div>
    </Fragment>
  );
};

export default SignUp;
