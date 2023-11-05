import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

import { database } from '../config/firebase.config';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

const Category = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    // create a func to fetch the list
    const fetchListing = async () => {
      try {
        // get reference
        const listingsRef = collection(database, 'listings');

        //create a query
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        // execute query
        const querySnapshot = await getDocs(q);

        // define the list
        const listings = [];

        // push the incoming data to the list
        querySnapshot.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        // set the list
        setListings(listings);
        setIsLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings.');
      }
    };

    // call the func
    fetchListing();
  }, [params.categoryName]);

  return (
    <div className='category'>
      <header>
        <h2 className='pageHeader'>
          {params.categoryName === 'rent' ? 'Place for rent' : 'Place for sale'}
        </h2>
      </header>
      {isLoading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <main>
          <ul className='categoryListings'>
            {listings.map((listing) => (
              <h3 key={listing.id}>{listing.data.name}</h3>
            ))}
          </ul>
        </main>
      ) : (
        `No listings for ${params.categoryName}`
      )}
    </div>
  );
};

export default Category;
