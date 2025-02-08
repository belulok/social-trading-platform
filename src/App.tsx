import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { AIChatSidebar } from './components/AIChatSidebar';
import { Home } from './pages/Home';
import { SignUp } from './pages/SignUp';
import { ProfileSetup } from './pages/ProfileSetup';
import { Dashboard } from './pages/Dashboard';
import { Trade } from './pages/Trade';
import { Social } from './pages/Social';
import { Simulation } from './pages/Simulation';
import { CopyTrader } from './pages/CopyTrader';
import { AdminDashboard } from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navigation />
      {user && <AIChatSidebar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/profile-setup"
          element={
            <PrivateRoute>
              <ProfileSetup />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/trade"
          element={
            <PrivateRoute>
              <Trade />
            </PrivateRoute>
          }
        />
        <Route
          path="/simulation"
          element={
            <PrivateRoute>
              <Simulation />
            </PrivateRoute>
          }
        />
        <Route
          path="/social"
          element={
            <PrivateRoute>
              <Social />
            </PrivateRoute>
          }
        />
        <Route
          path="/copy-trader/:id"
          element={
            <PrivateRoute>
              <CopyTrader />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;