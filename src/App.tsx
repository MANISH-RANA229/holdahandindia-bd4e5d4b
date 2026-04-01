/**
 * App.tsx — Root application component.
 * All dashboard routes are lazy-loaded via React.lazy + Suspense
 * to reduce initial bundle size and improve first paint.
 */
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppDataProvider } from "@/contexts/AppDataContext";

/* Eagerly loaded pages (critical path) */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

/* Lazy-loaded mentor pages */
const MentorDashboard = lazy(() => import("./pages/mentor/MentorDashboard"));
const StudentDiscovery = lazy(() => import("./pages/mentor/StudentDiscovery"));
const SelectedStudents = lazy(() => import("./pages/mentor/SelectedStudents"));
const MentorChat = lazy(() => import("./pages/mentor/MentorChat"));
const MentorVideoSessions = lazy(() => import("./pages/mentor/MentorVideoSessions"));
const StudentInsights = lazy(() => import("./pages/mentor/StudentInsights"));

/* Lazy-loaded student pages */
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const StudentMentor = lazy(() => import("./pages/student/StudentMentor"));
const StudentChat = lazy(() => import("./pages/student/StudentChat"));
const StudentVideoSessions = lazy(() => import("./pages/student/StudentVideoSessions"));
const SavedSessions = lazy(() => import("./pages/student/SavedSessions"));
const MyGrowth = lazy(() => import("./pages/student/MyGrowth"));
const MyPerformance = lazy(() => import("./pages/student/MyPerformance"));
const SupportRequest = lazy(() => import("./pages/student/SupportRequest"));

const queryClient = new QueryClient();

/** Minimal loading spinner shown while lazy chunks load */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/** Route guard — redirects unauthenticated or wrong-role users */
function ProtectedRoute({ children, role }: { children: React.ReactNode; role: "mentor" | "student" }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== role) return <Navigate to="/" />;
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
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

              {/* Mentor routes — lazy-loaded */}
              <Route path="/mentor/dashboard" element={<ProtectedRoute role="mentor"><MentorDashboard /></ProtectedRoute>} />
              <Route path="/mentor/discover" element={<ProtectedRoute role="mentor"><StudentDiscovery /></ProtectedRoute>} />
              <Route path="/mentor/selected" element={<ProtectedRoute role="mentor"><SelectedStudents /></ProtectedRoute>} />
              <Route path="/mentor/insights" element={<ProtectedRoute role="mentor"><StudentInsights /></ProtectedRoute>} />
              <Route path="/mentor/chat" element={<ProtectedRoute role="mentor"><MentorChat /></ProtectedRoute>} />
              <Route path="/mentor/sessions" element={<ProtectedRoute role="mentor"><MentorVideoSessions /></ProtectedRoute>} />

              {/* Student routes — lazy-loaded */}
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
