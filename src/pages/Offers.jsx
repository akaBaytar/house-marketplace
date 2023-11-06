import { useEffect, useState } from 'react';

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

import { database } from '../config/firebase.config';
import { toast } from 'react-toastify';

import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // create a func to fetch the list
    const fetchListing = async () => {
      try {
        // get reference
        const listingsRef = collection(database, 'listings');

        //create a query
        const q = query(
          listingsRef,
          where('offer', '==', true),
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
  }, []);

  return (
    <div className='category'>
      <header>
        <h2 className='pageHeader'>Offers</h2>
      </header>
      {isLoading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <main>
          <ul className='categoryListings'>
            {listings.map((listing) => (
              <ListingItem
                key={listing.id}
                listing={listing.data}
                id={listing.id}
              />
            ))}
          </ul>
        </main>
      ) : (
        <p>There are no current offers.</p>
      )}
    </div>
  );
};

export default Offers;
