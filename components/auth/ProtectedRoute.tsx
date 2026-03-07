import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Loader } from '../ui/Loader'; 

const ProtectedRoute = () => {
  // Use 'currentUser' and 'loading' from the Context
  const { currentUser, loading } = useAppContext();
  const location = useLocation();

  // 1. If we are still fetching the user profile, show a loading spinner
  // This prevents "flashing" the login page before we know the user is actually logged in.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <Loader spinnerClassName="w-8 h-8 text-blue-500" />
      </div>
    );
  }

  // 2. If loading is done and there is no user, redirect to Login
  if (!currentUser) {
    // We pass 'state' so we can redirect them back here after they login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If user exists, render the child routes (The Dashboard, etc.)
  return <Outlet />;
};

export default ProtectedRoute;