import { Fragment } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import ArrowIcon from '../assets/svg/keyboardArrowRightIcon.svg?react';
import VisibilityIcon from '../assets/svg/visibilityIcon.svg';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const formHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <Fragment>
      <div className='pageContainer'>
        <header>
          <h2 className='pageHeader'>Welcome Back!</h2>
        </header>
        <main>
          <form>
            <input
              type='text'
              id='name'
              placeholder='Name'
              className='nameInput'
              value={name}
              onChange={formHandler}
              autoComplete='name'
            />
            <input
              type='email'
              id='email'
              placeholder='Email'
              className='emailInput'
              value={email}
              onChange={formHandler}
              autoComplete='email'
            />
            <div className='passwordInputDiv'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                placeholder='Password'
                className='passwordInput'
                value={password}
                onChange={formHandler}
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
