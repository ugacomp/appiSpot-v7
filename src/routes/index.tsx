import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import PrivateAdminRoute from '../components/PrivateAdminRoute';

// Lazy load pages
const Home = React.lazy(() => import('../pages/Home'));
const SpotDetails = React.lazy(() => import('../pages/SpotDetails'));
const ExploreSpots = React.lazy(() => import('../pages/ExploreSpots'));
const About = React.lazy(() => import('../pages/About'));
const Contact = React.lazy(() => import('../pages/Contact'));
const ListSpot = React.lazy(() => import('../pages/ListSpot'));
const AdminLogin = React.lazy(() => import('../pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('../pages/AdminDashboard'));
const AdminBookings = React.lazy(() => import('../pages/admin/AdminBookings'));
const AdminBookingDetails = React.lazy(() => import('../pages/admin/AdminBookingDetails'));
const AdminGuests = React.lazy(() => import('../pages/admin/AdminGuests'));
const AdminHosts = React.lazy(() => import('../pages/admin/AdminHosts'));
const AdminHostDetails = React.lazy(() => import('../pages/admin/AdminHostDetails'));
const AdminRevenue = React.lazy(() => import('../pages/admin/AdminRevenue'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/explore" element={<ExploreSpots />} />
        <Route path="/spots/:id" element={<SpotDetails />} />
        <Route path="/list-spot" element={<ListSpot />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <PrivateAdminRoute>
            <AdminDashboard />
          </PrivateAdminRoute>
        } />
        <Route path="/admin/bookings" element={
          <PrivateAdminRoute>
            <AdminBookings />
          </PrivateAdminRoute>
        } />
        <Route path="/admin/bookings/:id" element={
          <PrivateAdminRoute>
            <AdminBookingDetails />
          </PrivateAdminRoute>
        } />
        <Route path="/admin/bookings/upcoming" element={
          <PrivateAdminRoute>
            <AdminBookings type="upcoming" />
          </PrivateAdminRoute>
        } />
        <Route path="/admin/bookings/past" element={
          <PrivateAdminRoute>
            <AdminBookings type="past" />
          </PrivateAdminRoute>
        } />
        <Route path="/admin/guests" element={
          <PrivateAdminRoute>
            <AdminGuests />
          </PrivateAdminRoute>
        } />
        <Route path="/admin/hosts" element={
          <PrivateAdminRoute>
            <AdminHosts />
          </PrivateAdminRoute>
        } />
        <Route path="/admin/hosts/:id" element={
          <PrivateAdminRoute>
            <AdminHostDetails />
          </PrivateAdminRoute>
        } />
        <Route path="/admin/revenue" element={
          <PrivateAdminRoute>
            <AdminRevenue />
          </PrivateAdminRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;