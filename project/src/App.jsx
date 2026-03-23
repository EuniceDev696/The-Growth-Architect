import React from "react";
import { Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/layout/AdminLayout";

import Landing from "./pages/public/Landing";
import Services from "./pages/public/Services";
import Booking from "./pages/public/Booking";
import BookingSuccess from "./pages/public/BookingSuccess";
import Home from "./pages/public/Home";
import Contact from "./pages/public/Contact";
import About from "./pages/public/About";
import CaseStudies from "./pages/public/CaseStudies";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import TermsOfService from "./pages/public/TermsOfService";
import CookiePolicy from "./pages/public/CookiePolicy";

import Dashboard from "./pages/admin/Dashboard";
import Clients from "./pages/admin/Clients";
import Programs from "./pages/admin/Programs";
import Messages from "./pages/admin/Messages";
import Settings from "./pages/admin/Settings";
import Login from "./pages/admin/Login";
import Bookings from "./pages/admin/Bookings";
import Meeting from "./pages/admin/Meeting";
import Newsletter from "./pages/admin/Newsletter";
import ProtectedRoute from "./routes/ProtectedRoute";

import ClientAuth from "./pages/client/Auth";
import ClientDashboard from "./pages/client/Dashboard";
import BookSession from "./pages/client/Booksession";
import MeetingPage from "./pages/client/MeetingPage";
import Goals from "./pages/client/Goals";
import Actions from "./pages/client/Actions";
import Sessions from "./pages/client/SessionsPage";
import ClientMessages from "./pages/client/Messages";
import Resources from "./pages/client/Resources";
import Profile from "./pages/client/Profile";
import PaymentCallback from "./pages/client/PaymentCallback";
import ClientPrivateRoute from "./routes/ClientPrivateRoute";

function App() {
  return (
    <Routes>
      {/* Public routes with navbar */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/bookingsuccess" element={<BookingSuccess />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/casestudies" element={<CaseStudies />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
      </Route>

      {/* Admin routes without navbar */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="programs" element={<Programs />} />
        <Route path="messages" element={<Messages />} />
        <Route path="newsletter" element={<Newsletter />} />
        <Route path="settings" element={<Settings />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="meeting" element={<Meeting />} />
        <Route path="meeting/:id" element={<Meeting />} />
      </Route>

      {/* Client routes without navbar */}
      <Route path="/client/auth" element={<ClientAuth />} />
      <Route path="/client/login" element={<ClientAuth />} />
      <Route
        path="/client/dashboard"
        element={
          <ClientPrivateRoute>
            <ClientDashboard />
          </ClientPrivateRoute>
        }
      />
      <Route
        path="/client/book-session"
        element={
          <ClientPrivateRoute>
            <BookSession />
          </ClientPrivateRoute>
        }
      />
      <Route
        path="/client/payment-callback"
        element={
          <ClientPrivateRoute>
            <PaymentCallback />
          </ClientPrivateRoute>
        }
      />
      <Route
        path="/client/meeting"
        element={
          <ClientPrivateRoute>
            <MeetingPage />
          </ClientPrivateRoute>
        }
      />
      <Route
        path="/client/meeting/:id"
        element={
          <ClientPrivateRoute>
            <MeetingPage />
          </ClientPrivateRoute>
        }
      />
      <Route
        path="/client/goals"
        element={
          <ClientPrivateRoute>
            <Goals />
          </ClientPrivateRoute>
        }
      />
      <Route
        path="/client/actions"
        element={
          <ClientPrivateRoute>
            <Actions />
          </ClientPrivateRoute>
        }
      />
      <Route
        path="/client/sessions"
        element={
          <ClientPrivateRoute>
            <Sessions />
          </ClientPrivateRoute>
        }
      />
      <Route
        path="/client/messages"
        element={
          <ClientPrivateRoute>
            <ClientMessages />
          </ClientPrivateRoute>
        }
      />
      <Route
        path="/client/resources"
        element={
          <ClientPrivateRoute>
            <Resources />
          </ClientPrivateRoute>
        }
      />
      <Route
        path="/client/profile"
        element={
          <ClientPrivateRoute>
            <Profile />
          </ClientPrivateRoute>
        }
      />

      <Route
        path="*"
        element={<div className="min-h-screen flex items-center justify-center text-2xl">404 - Page Not Found</div>}
      />
    </Routes>
  );
}

export default App;
