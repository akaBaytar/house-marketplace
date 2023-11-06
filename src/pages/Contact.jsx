import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { doc, getDoc } from 'firebase/firestore';

import { database } from '../config/firebase.config';
import { toast } from 'react-toastify';

const Contact = () => {
  const [message, setMessage] = useState('');

  const [landlord, setLandlord] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(database, 'users', params.landlordID);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists) {
        setLandlord(docSnapshot.data());
      } else {
        toast.error('Could not get landlord data.');
      }
    };

    getLandlord();
  }, [params.landlordID]);

  const onChange = (e) => setMessage(e.target.value);

  return (
    <div className='pageContainer'>
      <header>
        <h1 className='pageHeader'>Contact Landlord</h1>

        {landlord !== null && (
          <main>
            <div className='contactLandlord'>
              <p className='landlordName'>Contact {landlord?.name}</p>
            </div>
            <form className='messageForm'>
              <div className='messageDiv'>
                <label htmlFor='message' className='messageLabel'>
                  Message
                </label>
                <textarea
                  name='message'
                  id='message'
                  className='textarea'
                  value={message}
                  onChange={onChange}></textarea>
              </div>
              <a
                href={`mailto:${landlord.email}?Subject=${searchParams.get(
                  'listingName'
                )}&body=${message}`}>
                <button className='primaryButton' type='button'>
                  Send Message
                </button>
              </a>
            </form>
          </main>
        )}
      </header>
    </div>
  );
};

export default Contact;
