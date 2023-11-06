import { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

import { database } from '../config/firebase.config';
import Spinner from './Spinner';

import { Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/a11y';

const Slider = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      const listingsRef = collection(database, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
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

    fetchListing();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    listings && (
      <Fragment>
        <h3 className='exploreHeading'>Recommended</h3>
        <Swiper
          modules={[Pagination, A11y]}
          slidesPerView={1}
          navigation={true}
          a11y={true}
          pagination={{ clickable: true }}>
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}>
              <div
                className='swiperSlideDiv exploreSwiper'
                style={{
                  background: `url(${data.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}>
                <p className='swiperSlideText'>{data.name}</p>
                <p className='swiperSlidePrice'>
                  ${data.discountedPrice ?? data.regularPrice}
                  {data.type === 'rent' && ' / Month'}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Fragment>
    )
  );
};

export default Slider;
