/**
 * AppShell — Saffron-themed sidebar + topbar layout, used by every authenticated page.
 * Picks the right nav items based on the logged-in user's role.
 * Spec 01 (Saffron India theme).
 */
import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Search,
  Users,
  BarChart3,
  MessageSquare,
  Video,
  LogOut,
  User as UserIcon,
  TrendingUp,
  Eye,
  Heart,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Mentor, Student } from "@/data/types";

interface NavItem {
  to: string;
  label: string;
  title: string;
  icon: typeof LayoutGrid;
}

const mentorNav: NavItem[] = [
  { to: "/mentor/dashboard", label: "Dashboard",         title: "Dashboard",         icon: LayoutGrid },
  { to: "/mentor/discover",  label: "Discover Students", title: "Discover Students", icon: Search },
  { to: "/mentor/selected",  label: "Selected Students", title: "Selected Students", icon: Users },
  { to: "/mentor/insights",  label: "Student Insights",  title: "Student Insights",  icon: BarChart3 },
  { to: "/mentor/chat",      label: "Chat",              title: "Chat",              icon: MessageSquare },
  { to: "/mentor/sessions",  label: "Video Sessions",    title: "Video Sessions",    icon: Video },
];

const studentNav: NavItem[] = [
  { to: "/student/dashboard",   label: "Dashboard",         title: "Dashboard",         icon: LayoutGrid },
  { to: "/student/mentor",      label: "My Mentor",         title: "My Mentor",         icon: UserIcon },
  { to: "/student/growth",      label: "My Growth",         title: "My Growth",         icon: TrendingUp },
  { to: "/student/performance", label: "My Performance",    title: "My Performance",    icon: Eye },
  { to: "/student/support",     label: "Support Requests",  title: "Support Requests",  icon: Heart },
  { to: "/student/chat",        label: "Chat",              title: "Chat",              icon: MessageSquare },
  { to: "/student/sessions",    label: "Video Sessions",    title: "Video Sessions",    icon: Video },
  { to: "/student/saved",       label: "Saved Sessions",    title: "Saved Sessions",    icon: Bookmark },
];

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

interface AppShellProps {
  children: ReactNode;
  /** When true, content area gets no padding (used for chat-style pages). */
  chatActive?: boolean;
}

export function AppShell({ children, chatActive = false }: AppShellProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isMentor = user?.role === "mentor";
  const navItems = isMentor ? mentorNav : studentNav;
  const currentItem =
    navItems.find((n) => location.pathname.startsWith(n.to)) ?? navItems[0];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Right-side "pill" subtitle in the topbar.
  // Mentor → "Business Mentor". Student → "Age 16 · Study".
  const pillText = (() => {
    if (!user) return "";
    if (isMentor) {
      const m = user as Mentor;
      return `${capitalize(m.field || "")} Mentor`.trim();
    }
    const s = user as Student;
    const interest = s.interests?.[0];
    return interest ? `Age ${s.age} · ${interest}` : `Age ${s.age}`;
  })();

  // Sidebar profile row subtitle pill.
  const profilePillText = (() => {
    if (!user) return "";
    if (isMentor) {
      const m = user as Mentor;
      return `Mentor · ${capitalize(m.field || "")}`;
    }
    const s = user as Student;
    const interest = s.interests?.[0];
    return interest ? `Student · ${interest}` : "Student";
  })();

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const avatarColorClass = isMentor ? "ms-av-sf" : "ms-av-gr";

  // Student nav uses saffron active state; mentor uses forest green.
  const navItemClass = isMentor ? "ms-nav-item" : "ms-nav-item ms-nav-item--saffron";

  return (
    <div
      className={`flex flex-col${isMentor ? "" : " app-shell--student"}`}
      style={{ height: "100vh", overflow: "hidden", background: "var(--sf-cream)" }}
    >
      {/* ── Topbar ── */}
      <header
        className="flex items-center justify-between"
        style={{
          height: 60,
          flexShrink: 0,
          background: "var(--sf-w)",
          borderBottom: "1px solid var(--sf-bd)",
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="flex items-center" style={{ gap: 14 }}>
          <h1 style={{ fontSize: 15, fontWeight: 700, color: "var(--sf-ch)" }}>
            {currentItem.title}
          </h1>
          {pillText && (
            <span
              style={{
                background: "#fdf0e8",
                color: "var(--sf-sf)",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 999,
                letterSpacing: "0.4px",
              }}
            >
              {pillText}
            </span>
          )}
        </div>

        <div className="flex items-center" style={{ gap: 10 }}>
          <div className="ms-topbar-user">
            <span
              className="ms-status-dot ms-dot-green"
              style={{ width: 7, height: 7 }}
            />
            {user?.name?.split(" ")[0] || "User"}
          </div>
          <button className="ms-topbar-btn" onClick={handleLogout}>
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </header>

      {/* ── Body row: sidebar + content ── */}
      <div className="flex" style={{ flex: 1, overflow: "hidden" }}>
        <aside
          className="hidden md:flex flex-col"
          style={{
            width: 258,
            flexShrink: 0,
            background: "var(--sf-w)",
            borderRight: "1px solid var(--sf-bd)",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Logo */}
          <div
            className="flex items-center"
            style={{
              padding: "16px 18px",
              gap: 9,
              borderBottom: "1px solid var(--sf-bd)",
              flexShrink: 0,
            }}
          >
            <div
              className="flex items-center justify-center text-white"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--sf-gr)",
                fontSize: 15,
              }}
            >
              ♥
            </div>
            <span
              className="font-serif-display"
              style={{
                fontSize: 14,
                color: "var(--sf-gr)",
                letterSpacing: "0.1px",
                lineHeight: 1.2,
              }}
            >
              Hold A Hand<br />India
            </span>
          </div>

          {/* Profile row */}
          <div
            className="flex items-center"
            style={{
              padding: "14px 18px",
              gap: 11,
              borderBottom: "1px solid var(--sf-bd)",
              flexShrink: 0,
            }}
          >
            <div className={`ms-avatar ms-av-md ${avatarColorClass}`}>{initial}</div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--sf-ch)",
                }}
              >
                {user?.name?.split(" ")[0] || "User"}
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: isMentor ? "var(--sf-grl)" : "#fdf0e8",
                  color: isMentor ? "var(--sf-gr)" : "var(--sf-sf)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.4px",
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 999,
                  marginTop: 3,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: isMentor ? "var(--sf-gr)" : "var(--sf-sf)",
                  }}
                />
                {profilePillText}
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav
            className="flex-1 flex flex-col"
            style={{
              padding: "12px 10px",
              gap: 1,
              overflowY: "auto",
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`${navItemClass}${active ? " active" : ""}`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid var(--sf-bd)",
              flexShrink: 0,
            }}
          >
            <button className="ms-logout" onClick={handleLogout}>
              <LogOut size={15} />
              Log Out
            </button>
          </div>
        </aside>

        {/* ── Content ── */}
        <main
          style={{
            flex: 1,
            overflowY: chatActive ? "hidden" : "auto",
            background: "var(--sf-cream)",
            padding: chatActive ? 0 : "28px 32px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
