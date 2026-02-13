import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppDataProvider } from "@/contexts/AppDataContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import MentorDashboard from "./pages/mentor/MentorDashboard";
import StudentDiscovery from "./pages/mentor/StudentDiscovery";
import SelectedStudents from "./pages/mentor/SelectedStudents";
import MentorChat from "./pages/mentor/MentorChat";
import MentorVideoSessions from "./pages/mentor/MentorVideoSessions";
import StudentInsights from "./pages/mentor/StudentInsights";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentMentor from "./pages/student/StudentMentor";
import StudentChat from "./pages/student/StudentChat";
import StudentVideoSessions from "./pages/student/StudentVideoSessions";
import SavedSessions from "./pages/student/SavedSessions";
import MyGrowth from "./pages/student/MyGrowth";
import MyPerformance from "./pages/student/MyPerformance";
import SupportRequest from "./pages/student/SupportRequest";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: "mentor" | "student" }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/mentor/dashboard" element={<ProtectedRoute role="mentor"><MentorDashboard /></ProtectedRoute>} />
              <Route path="/mentor/discover" element={<ProtectedRoute role="mentor"><StudentDiscovery /></ProtectedRoute>} />
              <Route path="/mentor/selected" element={<ProtectedRoute role="mentor"><SelectedStudents /></ProtectedRoute>} />
              <Route path="/mentor/insights" element={<ProtectedRoute role="mentor"><StudentInsights /></ProtectedRoute>} />
              <Route path="/mentor/chat" element={<ProtectedRoute role="mentor"><MentorChat /></ProtectedRoute>} />
              <Route path="/mentor/sessions" element={<ProtectedRoute role="mentor"><MentorVideoSessions /></ProtectedRoute>} />

              <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/mentor" element={<ProtectedRoute role="student"><StudentMentor /></ProtectedRoute>} />
              <Route path="/student/growth" element={<ProtectedRoute role="student"><MyGrowth /></ProtectedRoute>} />
              <Route path="/student/performance" element={<ProtectedRoute role="student"><MyPerformance /></ProtectedRoute>} />
              <Route path="/student/support" element={<ProtectedRoute role="student"><SupportRequest /></ProtectedRoute>} />
              <Route path="/student/chat" element={<ProtectedRoute role="student"><StudentChat /></ProtectedRoute>} />
              <Route path="/student/sessions" element={<ProtectedRoute role="student"><StudentVideoSessions /></ProtectedRoute>} />
              <Route path="/student/saved" element={<ProtectedRoute role="student"><SavedSessions /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppDataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
