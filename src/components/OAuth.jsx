import { useLocation, useNavigate } from 'react-router-dom';

import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import { database } from '../../firebase.config';
import { toast } from 'react-toastify';

import GoogleIcon from '../assets/svg/googleIcon.svg';

const OAuth = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //check for user
      const docRef = doc(database, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      //if user does not exist, create user
      if (!docSnap.exists()) {
        await setDoc(doc(database, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      // redirecting the user to homepage
      navigate('/');

    } catch (error) {
      toast.error('Authorization could not be completed.');
    }
  };

  return (
    <div className='socialLogin'>
      <p>
        Sign {location.pathname === '/sign-in' ? 'in' : 'up'} with
        <button className='socialIconDiv' onClick={onGoogleClick}>
          <img src={GoogleIcon} alt='Google' className='socialIconImg' />
        </button>
      </p>
    </div>
  );
};

export default OAuth;
