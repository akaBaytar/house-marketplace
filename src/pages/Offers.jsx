import { useEffect, useState, Fragment } from 'react';

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';

import { database } from '../config/firebase.config';
import { toast } from 'react-toastify';

import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

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

        // define and set last viewed listing
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        setLastFetchedListing(lastVisible);

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

  // pagination
  const onFetchMoreListing = async () => {
    try {
      // get reference
      const listingsRef = collection(database, 'listings');

      //create a query
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      );

      // execute query
      const querySnapshot = await getDocs(q);

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      setLastFetchedListing(lastVisible);

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
      setListings((prevState) => [...prevState, ...listings]);
      setIsLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings.');
    }
  };

  return (
    <div className='category'>
      <header>
        <h2 className='pageHeader'>Offers</h2>
      </header>
      {isLoading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <Fragment>
          <main className='center'>
            <ul className='categoryListings' style={{ marginLeft: '2.5rem' }}>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
          {lastFetchedListing && (
            <span className='loadMore' onClick={onFetchMoreListing}>
              Load More
            </span>
          )}
        </Fragment>
      ) : (
        <p>There are no current offers.</p>
      )}
    </div>
  );
};

export default Offers;
