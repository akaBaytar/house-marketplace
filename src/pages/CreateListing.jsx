import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

import { database } from '../config/firebase.config';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

import Spinner from '../components/Spinner';

const CreateListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const auth = getAuth();
  const isMounted = useRef(true);
  const navigate = useNavigate();

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate('/sign-in');
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (discountedPrice >= regularPrice) {
      setIsLoading(false);
      toast.error('Discounted price needs to be less than regular price');
      return;
    }

    if (images.length > 6) {
      setIsLoading(false);
      toast.error('You can upload up to 6 images.');
      return;
    }

    let geolocation = {};
    let location;

    if (geolocationEnabled) {
      // get coordinates from address information
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?key=02b73eaebaf6446988699b57c4392b4a&q=${encodeURIComponent(
            address
          )}&limit=1&no_annotations=1&abbrv=1`
        );

        const data = await response.json();

        if (data.total_results === 0) {
          setIsLoading(false);
          toast.error('Address not found');
          return;
        }

        geolocation.lat = data.results[0]?.geometry.lat ?? 0;
        geolocation.lng = data.results[0]?.geometry.lng ?? 0;
        location =
          data.total_results === 0 ? undefined : data.results[0]?.formatted;

        if (location === undefined || location.includes('undefined')) {
          setIsLoading(false);
          toast.error('Address not found. Please enter a valid address.');
          return;
        }
      } catch (error) {
        setIsLoading(false);
        toast.error('Unable to fetch location');
      }
    }

    // store images in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, 'images/' + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progress === 100 && toast.info(`Upload is done`);
            switch (snapshot.state) {
              case 'paused':
                toast.info('Upload is paused');
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setIsLoading(false)
      toast.error('Images not uploaded')
      return
    })
    

    setIsLoading(false);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === 'true') {
      boolean = true;
    }

    if (e.target.value === 'false') {
      boolean = false;
    }

    // files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // text / number / boolean datas
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='profile'>
      <header>
        <h1 className='pageHeader'>Create a Listing</h1>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label htmlFor='type' className='formLabel'>
            Sell / Rent
          </label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='sale'
              onClick={onMutate}>
              Sell
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='rent'
              onClick={onMutate}>
              Rent
            </button>
          </div>

          <label htmlFor='name' className='formLabel'>
            Name
          </label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            required
            autoComplete='off'
          />

          <div className='flex formRoomsDiv'>
            <div>
              <label htmlFor='bedrooms' className='formLabel'>
                Bedrooms
              </label>
              <input
                className='formInputSmall'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min='1'
                required
              />
            </div>
            <div>
              <label htmlFor='bathrooms' className='formLabel'>
                Bathrooms
              </label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='1'
                required
              />
            </div>
          </div>

          <label htmlFor='parking' className='formLabel'>
            Parking spot
          </label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'>
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}>
              No
            </button>
          </div>

          <label htmlFor='furnished' className='formLabel'>
            Furnished
          </label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}>
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}>
              No
            </button>
          </div>

          <label htmlFor='address' className='formLabel'>
            Address
          </label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            autoComplete='off'
            required
          />

          {!geolocationEnabled && (
            <div className='flex'>
              <div>
                <label htmlFor='latitude' className='formLabel'>
                  Latitude
                </label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label htmlFor='longitude' className='formLabel'>
                  Longitude
                </label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label htmlFor='offer' className='formLabel'>
            Offer
          </label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}>
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}>
              No
            </button>
          </div>

          <label htmlFor='regularPrice' className='formLabel'>
            Regular Price
          </label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label htmlFor='discountedPrice' className='formLabel'>
                Discounted Price
              </label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label htmlFor='images' className='formLabel'>
            Images
          </label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
