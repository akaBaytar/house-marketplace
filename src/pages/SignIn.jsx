import { Fragment } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import ArrowIcon from '../assets/svg/keyboardArrowRightIcon.svg?react';
import VisibilityIcon from '../assets/svg/visibilityIcon.svg';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // destructuring form data
  const { email, password } = formData;

  // handler functions
  const inputHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const formHandler = async (e) => {
    e.preventDefault();

    // login with email
    const auth = getAuth();

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // redirecting the user to homepage
    if (userCredential.user) {
      navigate('/');
    }
  };

  return (
    <Fragment>
      <div className='pageContainer'>
        <header>
          <h2 className='pageHeader'>Welcome Back!</h2>
        </header>
        <main>
          <form onSubmit={formHandler}>
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
            <Link to='forgot-password' className='forgotPasswordLink'>
              Forgot Password
            </Link>
            <div className='signInBar'>
              <p className='signInText'>Sign In</p>
              <button className='signInButton'>
                <ArrowIcon fill='#fff' width='36px' height='36px' />
              </button>
            </div>
          </form>
          <Link to='/sign-up' className='registerLink'>
            Sign up Instead
          </Link>
        </main>
      </div>
    </Fragment>
  );
};

export default SignIn;
