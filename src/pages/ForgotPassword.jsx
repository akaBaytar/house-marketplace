import { useState } from 'react';
import { Link } from 'react-router-dom';

import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

import { toast } from 'react-toastify';
import ArrowRight from '../assets/svg/keyboardArrowRightIcon.svg?react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  // handler functions
  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault;
    try {
      const auth = getAuth();

      await sendPasswordResetEmail(auth, email);

      toast.success('Password reset email has been sent.');
    } catch (error) {
      toast.error('Error occurred while sending the email.');
    }
  };

  return (
    <div className='pageContainer'>
      <header>
        <h1 className='pageHeader'>Forgot Password</h1>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input
            type='email'
            id='email'
            className='emailInput'
            placeholder='Email'
            value={email}
            onChange={onChange}
            autoComplete='email'
          />
          <Link className='forgotPasswordLink' to='/sign-in'>
            Back to Sign in
          </Link>
          <div className='forgotPasswordBar'>
            <p className='forgotPasswordText'>Send Reset Link</p>
            <button className='forgotPasswordButton'>
              <ArrowRight fill='#fff' width='36px' height='36px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
