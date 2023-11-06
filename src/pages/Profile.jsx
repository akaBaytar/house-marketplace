import { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';

import { database } from '../config/firebase.config';
import { toast } from 'react-toastify';

import ListingItem from '../components/ListingItem';
import ArrowIcon from '../assets/svg/keyboardArrowRightIcon.svg';
import HomeIcon from '../assets/svg/homeIcon.svg';

const Profile = () => {
  const auth = getAuth();

  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const navigate = useNavigate();

  // destructuring form data
  const { name, email } = formData;

  // fetch user-specific listings
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(database, 'listings');

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);

      let listings = [];

      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setIsLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

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

  // deleting the respective listing
  const onDeleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete your listing?')) {
      await deleteDoc(doc(database, 'listings', id));
      
      const updatedListings = listings.filter((listing) => listing.id !== id )

      setListings(updatedListings)
      toast.success('Successfully deleted your listing.')
    }
  };

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <h1 className='pageHeader'>My Profile</h1>
        <button type='button' className='logout' onClick={onLogout}>
          Logout
        </button>
      </header>
      <main className='center'>
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
        <Link to='/create-listing' className='createListing'>
          <img src={HomeIcon} alt='Home Icon' />
          <p>Sell or rent your home</p>
          <img src={ArrowIcon} alt='Arrow Icon' />
        </Link>
        {!isLoading && listings?.length > 0 && (
          <Fragment>
            <h4 className='listingText'>Your Listings</h4>
            <ul>
              {listings.map(({ data, id }) => (
                <ListingItem
                  key={id}
                  listing={data}
                  id={id}
                  onDelete={() => onDeleteHandler(id)}
                />
              ))}
            </ul>
          </Fragment>
        )}
      </main>
    </div>
  );
};

export default Profile;
