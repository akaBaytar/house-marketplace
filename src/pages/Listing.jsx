import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { database } from '../config/firebase.config';

import Spinner from '../components/Spinner';
import ShareIcon from '../assets/svg/shareIcon.svg';

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [isLoadong, setIsLoading] = useState(true);
  const [isShareLinkCopied, setIsShareLinkCopied] = useState(false);

  const navigate = useNavigate();
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

  return <div>Listing</div>;
};

export default Listing;
