import { Navigate, Outlet } from 'react-router-dom';

//hooks
import useAuthStatus from '../hooks/useAuthStatus'

//components
import Spinner from './Spinner';

const PrivateRoute = () => {
  const { isLoggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <Spinner />;
  }

  // redirect to the login page if the user is not logged in
  return isLoggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;
