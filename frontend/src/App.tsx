import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth';
import AuthLayout from './components/AuthLayout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Recommended from './pages/Recommended';
import Welcome from './pages/Welcome';

// Signed-out pages send signed-in people to /welcome, and the reverse.
function SignedOut({ children }: { children: ReactElement }) {
  const { user } = useAuth();
  return user ? <Navigate to="/welcome" replace /> : children;
}

function SignedIn({ children }: { children: ReactElement }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" replace />;
}

export default function App() {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="loading" role="status">
        Loading…
      </div>
    );
  }

  return (
    <AuthLayout>
      <Routes>
        <Route path="/signin" element={<SignedOut><SignIn /></SignedOut>} />
        <Route path="/signup" element={<SignedOut><SignUp /></SignedOut>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/welcome" element={<SignedIn><Welcome /></SignedIn>} />
        <Route path="/recommended" element={<SignedIn><Recommended /></SignedIn>} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </AuthLayout>
  );
}
