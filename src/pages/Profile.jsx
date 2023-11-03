import { Fragment, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const Profile = () => {
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    setUser(auth.currentUser);
  }, [auth.currentUser]);

  return (
    <Fragment>
      <h1>{user ? user.displayName : 'Not logged in'}</h1>
    </Fragment>
  );
};

export default Profile;
