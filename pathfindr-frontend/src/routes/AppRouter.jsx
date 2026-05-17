import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/public/HomePage';
import CounselorsPage from '../pages/public/CounselorsPage';
import ResourcesPage from '../pages/public/ResourcesPage';
import AboutPage from '../pages/public/AboutPage';
import PrivacyPage from '../pages/public/PrivacyPage';
import TermsPage from '../pages/public/TermsPage';
import DashboardPage from '../pages/student/DashboardPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ProtectedRoute from '../components/common/ProtectedRoute';

import AssessmentPage from '../pages/student/AssessmentPage';
import ResultDashboard from '../pages/student/ResultDashboard';
import ChatPage from '../pages/student/ChatPage';
import VideoCallPage from '../pages/video/VideoCallPage';

// Simple fallback components for undefined routes
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center min-h-screen">
    <h1 className="text-2xl font-bold">{title}</h1>
  </div>
);

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/counselors" element={<CounselorsPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Protected Student Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['STUDENT']}>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/assessment" element={
        <ProtectedRoute allowedRoles={['STUDENT']}>
          <AssessmentPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/results" element={
        <ProtectedRoute allowedRoles={['STUDENT']}>
          <ResultDashboard />
        </ProtectedRoute>
      } />
      <Route path="/session/chat/:bookingId" element={
        <ProtectedRoute allowedRoles={['STUDENT', 'COUNSELOR']}>
          <ChatPage />
        </ProtectedRoute>
      } />
      <Route path="/session/video/:bookingId" element={
        <ProtectedRoute allowedRoles={['STUDENT', 'COUNSELOR']}>
          <VideoCallPage />
        </ProtectedRoute>
      } />
      
      {/* Protected Counselor Routes (Placeholder for now) */}
      <Route path="/counselor/dashboard" element={
        <ProtectedRoute allowedRoles={['COUNSELOR']}>
          <Placeholder title="Counselor Dashboard" />
        </ProtectedRoute>
      } />
      
      {/* Fallback Route */}
      <Route path="*" element={<Placeholder title="404 - Not Found" />} />
    </Routes>
  );
}
