/**
 * App.tsx — Root application component.
 * Authenticated routes share a single AppShell instance via RoleShell so the
 * sidebar/topbar don't unmount on navigation.
 */
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppDataProvider } from "@/contexts/AppDataContext";
import { RoleShell } from "@/components/RoleShell";

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

/** Route guard — used as a layout so all child routes share one auth check. */
function ProtectedLayout({ role }: { role: "mentor" | "student" }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Mentor — guard once, render shell once, swap inner pages */}
                <Route element={<ProtectedLayout role="mentor" />}>
                  <Route element={<RoleShell />}>
                    <Route path="/mentor/dashboard" element={<MentorDashboard />} />
                    <Route path="/mentor/discover"  element={<StudentDiscovery />} />
                    <Route path="/mentor/selected"  element={<SelectedStudents />} />
                    <Route path="/mentor/insights"  element={<StudentInsights />} />
                    <Route path="/mentor/chat"      element={<MentorChat />} />
                    <Route path="/mentor/sessions"  element={<MentorVideoSessions />} />
                  </Route>
                </Route>

                {/* Student — guard once, render shell once, swap inner pages */}
                <Route element={<ProtectedLayout role="student" />}>
                  <Route element={<RoleShell />}>
                    <Route path="/student/dashboard"   element={<StudentDashboard />} />
                    <Route path="/student/mentor"      element={<StudentMentor />} />
                    <Route path="/student/growth"      element={<MyGrowth />} />
                    <Route path="/student/performance" element={<MyPerformance />} />
                    <Route path="/student/support"     element={<SupportRequest />} />
                    <Route path="/student/chat"        element={<StudentChat />} />
                    <Route path="/student/sessions"    element={<StudentVideoSessions />} />
                    <Route path="/student/saved"       element={<SavedSessions />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AppDataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
