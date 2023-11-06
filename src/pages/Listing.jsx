import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { database } from '../config/firebase.config';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/a11y';

import Spinner from '../components/Spinner';
import ShareIcon from '../assets/svg/shareIcon.svg';

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [isLoadong, setIsLoading] = useState(true);
  const [isShareLinkCopied, setIsShareLinkCopied] = useState(false);

  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(database, 'listings', params.listingID);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists) {
        setListing(docSnapshot.data());
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [params.listingID]);

  const clickHandler = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsShareLinkCopied(true);
    setTimeout(() => {
      setIsShareLinkCopied(false);
    }, 1500);
  };

  if (isLoadong) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        modules={[Pagination, A11y]}
        slidesPerView={1}
        navigation={true}
        a11y={true}
        pagination={{ clickable: true }}>
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imageUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiperSlideDiv'></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='shareIconDiv' onClick={clickHandler}>
        <img src={ShareIcon} alt='Share Icon' />
      </div>
      {isShareLinkCopied && <p className='linkCopied'>Link copied</p>}

      <div className='listingDetails'>
        <h3 className='listingName'>
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </h3>
        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </p>
        {listing.offer && (
          <p className='discountPrice'>
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
        <ul className='listingDetailsList'>
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>
        <h4 className='listingLocationTitle'>Location</h4>
        <div className='leafletContainer'>
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={12}
            scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> Contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}>
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='primaryButton'>
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
