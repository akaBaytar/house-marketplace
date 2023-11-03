import { useEffect, useState } from 'react';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      }
      setCheckingStatus(false);
    });
  }, []);

  return {isLoggedIn, checkingStatus};
};

export default useAuthStatus;
