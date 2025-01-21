import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Calendar from './pages/Calendar';

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p> {/* Replace this with a spinner if needed */}
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Route for Login */}
      <Route
        path="/login"
        element={!session ? <Login /> : <Navigate to="/calendar" replace />}
      />

      {/* Protected Routes */}
      <Route path="/" element={session ? <Layout /> : <Navigate to="/login" replace />}>
        <Route index element={<Navigate to="/calendar" replace />} />
        <Route path="calendar" element={<Calendar />} />
      </Route>
    </Routes>
  );
}

export default App;
