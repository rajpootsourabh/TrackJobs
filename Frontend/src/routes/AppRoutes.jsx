import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from '../components/layout/Layout';

// Route Protection
import ProtectedRoute from './ProtectedRoute';
import { isAuthenticated } from '../services/api';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Dashboard
import Dashboard from '../pages/dashboard/Dashboard';

// Clients Pages
import ClientList from '../pages/clients/ClientList';
import AddClient from '../pages/clients/AddClient';
import ClientProfile from '../pages/clients/ClientProfile';

// Quotes Pages
import QuotesList from '../pages/quotes/QuotesList';
import CreateQuote from '../pages/quotes/CreateQuote';

// Jobs Pages
import JobsList from '../pages/jobs/JobsList';
import JobDetail from '../pages/jobs/JobDetail';

// Schedule Pages
import Schedule from '../pages/schedule/Schedule';
import CreateSchedule from '../pages/schedule/CreateSchedule';

// Component to handle root redirect based on auth status
const RootRedirect = () => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - No Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes - With Layout */}
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Clients */}
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/add" element={<AddClient />} />
        <Route path="/clients/:id" element={<ClientProfile />} />

        {/* Quotes */}
        <Route path="/quotes" element={<QuotesList />} />
        <Route path="/quotes/create" element={<CreateQuote />} />

        {/* Jobs */}
        <Route path="/jobs" element={<JobsList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Schedule */}
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/schedule/create" element={<CreateSchedule />} />
      </Route>

      {/* Default Redirect - Check auth status */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
