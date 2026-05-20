/**
 * MentorDashboard — Saffron-themed mentor home (Spec 02).
 */
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Mentor, Student, Session } from "@/data/types";
import { mentorService, MentorDashboardData } from "@/services/mentorService";
import { API_CONFIG } from "@/services/apiConfig";
import { useAppData } from "@/contexts/AppDataContext";

interface Kpi {
  label: string;
  iconBg: string;
  emoji: string;
  value: string;
  valueFontSize?: number;
  sub: React.ReactNode;
}

interface AlertRow {
  name: string;
  message: string;
}

interface ActivityItem {
  emoji: string;
  bg: string;
  text: React.ReactNode;
  time: string;
}

const WEEKLY_SESSIONS = [4, 6, 5, 8, 7, 9, 6, 8] as const;
const MAX_BAR_HEIGHT = 120;
const MAX_SESSIONS = 9;
const BAR_WIDTH = 36;
const BAR_GAP = 24;
const BAR_X_OFFSET = 12;

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function todayGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function todayLabel() {
  const d = new Date();
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function MentorDashboard() {
  const { user } = useAuth();
  const mentor = user as Mentor;

  const [loading, setLoading] = useState(!API_CONFIG.USE_STATIC_DATA);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<MentorDashboardData | null>(null);

  const appData = useAppData();

  useEffect(() => {
    if (API_CONFIG.USE_STATIC_DATA) return;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await mentorService.getDashboard();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  let selected: Student[];
  let mentorSessions: Session[];
  if (API_CONFIG.USE_STATIC_DATA || !dashboardData) {
    selected = appData.getSelectedStudents(mentor.id);
    mentorSessions = appData.sessions.filter((s) => s.mentorId === mentor.id);
  } else {
    selected = dashboardData.selectedStudents;
    mentorSessions = dashboardData.sessions;
  }
  const completed = mentorSessions.filter((s) => s.status === "completed").length;

  const kpis: Kpi[] = [
    {
      label: "STUDENTS GUIDED",
      iconBg: "#fdf0e8",
      emoji: "🎓",
      value: String(mentor.studentsGuided + selected.length),
      sub: (
        <>
          <b style={{ color: "#22c55e", fontWeight: 600 }}>+2</b> this month
        </>
      ),
    },
    {
      label: "SESSIONS DONE",
      iconBg: "#eaf4ef",
      emoji: "🎥",
      value: String(mentor.sessionsCompleted + completed),
      sub: (
        <>
          <b style={{ color: "#22c55e", fontWeight: 600 }}>+8</b> this month
        </>
      ),
    },
    {
      label: "SELECTED STUDENTS",
      iconBg: "#eff6ff",
      emoji: "👥",
      value: String(selected.length),
      sub:
        selected.length > 0
          ? selected.slice(0, 2).map((s) => s.name.split(" ")[0]).join(" & ")
          : "None yet",
    },
    {
      label: "YOUR FIELD",
      iconBg: "#fffbeb",
      emoji: "💼",
      value: capitalize(mentor.field || "—"),
      valueFontSize: 24,
      sub: mentor.experience || "Entrepreneurship track",
    },
  ];

  const progressStudents = useMemo(() => {
    return selected.slice(0, 2).map((s, i) => ({
      ...s,
      percent: i === 0 ? 76 : 68,
      delta: i === 0 ? 12 : 8,
      avatarClass: i === 0 ? "ms-av-sf" : "ms-av-gr",
      track: i === 0 ? "Study Track" : "Sports Track",
    }));
  }, [selected]);

  const alerts: AlertRow[] = [
    { name: "Ravi Singh", message: "3 missed sessions · Last active 3 days ago" },
    { name: "Anita Devi", message: "Assignment pending · Due yesterday" },
  ];

  const activity: ActivityItem[] = [
    {
      emoji: "🎯",
      bg: "#eaf4ef",
      text: (
        <>
          Session completed with <b>Anita Devi</b> — Python &amp; OOP
        </>
      ),
      time: "2 hours ago",
    },
    {
      emoji: "💬",
      bg: "#fdf0e8",
      text: (
        <>
          <b>Anita Devi</b> sent you a message
        </>
      ),
      time: "5 hours ago",
    },
    {
      emoji: "⭐",
      bg: "#eaf4ef",
      text: (
        <>
          <b>Ravi Singh</b> completed monthly goal
        </>
      ),
      time: "Yesterday",
    },
    {
      emoji: "📝",
      bg: "#eff6ff",
      text: (
        <>
          You added mentor notes for <b>Anita Devi</b>
        </>
      ),
      time: "2 days ago",
    },
  ];

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center" style={{ minHeight: "60vh" }}>
          <div className="flex flex-col items-center" style={{ gap: 12 }}>
            <Loader2 className="animate-spin" style={{ color: "var(--sf-sf)" }} />
            <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>Loading dashboard…</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex items-center justify-center" style={{ minHeight: "60vh" }}>
          <div className="text-center">
            <p style={{ fontSize: 14, fontWeight: 600, color: "#dc2626", marginBottom: 4 }}>
              Failed to load dashboard
            </p>
            <p style={{ fontSize: 12, color: "var(--sf-mt)" }}>{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Welcome banner */}
      <section
        style={{
          background: "linear-gradient(118deg, #1b5c3d 0%, #2d7a52 100%)",
          borderRadius: 20,
          padding: "26px 32px",
          marginBottom: 22,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden
          style={{
            content: '""',
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255,255,255,.05)",
            bottom: -80,
            right: -40,
            pointerEvents: "none",
          }}
        />
        <div
          className="flex items-center justify-between flex-wrap"
          style={{ gap: 20, position: "relative", zIndex: 1 }}
        >
          <div>
            <h2
              className="font-serif-display"
              style={{
                fontSize: 28,
                color: "white",
                marginBottom: 5,
              }}
            >
              {todayGreeting()}, {mentor.name.split(" ")[0]} 👋
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>
              {todayLabel()} · You have {mentorSessions.length} sessions this week
            </p>
          </div>
          <div className="flex" style={{ gap: 12 }}>
            <WelcomeStat value="12" label="Sessions this month" />
            <WelcomeStat value="76%" label="Avg student growth" />
          </div>
        </div>
      </section>

      {/* KPI grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 22,
        }}
      >
        {kpis.map((k) => (
          <article
            key={k.label}
            className="mentor-shell-card"
            style={{ padding: "20px 22px" }}
          >
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: 12 }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--sf-mt)",
                  letterSpacing: "0.4px",
                  textTransform: "uppercase",
                }}
              >
                {k.label}
              </p>
              <span
                className="flex items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: k.iconBg,
                  fontSize: 18,
                }}
              >
                {k.emoji}
              </span>
            </div>
            <p
              className="font-serif-display"
              style={{
                fontSize: k.valueFontSize ?? 36,
                color: "var(--sf-ch)",
                lineHeight: 1,
                marginBottom: 5,
              }}
            >
              {k.value}
            </p>
            <p style={{ fontSize: 12, color: "var(--sf-mt)" }}>{k.sub}</p>
          </article>
        ))}
      </div>

      {/* Two-column area */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
          gap: 18,
          marginBottom: 18,
        }}
      >
        {/* Left column */}
        <div className="flex flex-col" style={{ gap: 16, minWidth: 0 }}>
          <article className="mentor-shell-card mentor-shell-card-p">
            <p className="ms-section-title">
              <span aria-hidden>📊</span> Sessions over the last 8 weeks
            </p>
            <SessionsChart data={[...WEEKLY_SESSIONS]} />
          </article>

          <article className="mentor-shell-card mentor-shell-card-p">
            <p className="ms-section-title">
              <span aria-hidden>📈</span> Student Progress
            </p>
            <div className="flex flex-col" style={{ gap: 14 }}>
              {progressStudents.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>
                  No selected students yet.
                </p>
              ) : (
                progressStudents.map((s) => (
                  <div key={s.id}>
                    <div
                      className="flex items-center justify-between"
                      style={{ marginBottom: 6 }}
                    >
                      <div className="flex items-center" style={{ gap: 10 }}>
                        <div className={`ms-avatar ms-av-sm ${s.avatarClass}`}>
                          {s.avatar || s.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--sf-ch)" }}>
                            {s.name}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--sf-mt)" }}>
                            {s.track}
                          </p>
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: "var(--sf-ch)", fontWeight: 600 }}>
                        {s.percent}%{" "}
                        <span
                          style={{
                            fontSize: 11,
                            color: "#22c55e",
                            fontWeight: 600,
                            marginLeft: 4,
                          }}
                        >
                          +{s.delta}%
                        </span>
                      </p>
                    </div>
                    <div className="ms-bar-track">
                      <div
                        className="ms-bar-fill ms-bar-gr"
                        style={{ width: `${s.percent}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </div>

        {/* Right column */}
        <div className="flex flex-col" style={{ gap: 16, minWidth: 0 }}>
          <article className="mentor-shell-card mentor-shell-card-p">
            <p className="ms-section-title">
              <span aria-hidden>⚠️</span> Needs Attention
            </p>
            {alerts.map((a, i) => (
              <div
                key={a.name}
                className="flex items-center"
                style={{
                  gap: 10,
                  padding: "11px 14px",
                  background: "var(--sf-cream)",
                  borderRadius: 11,
                  marginBottom: i === alerts.length - 1 ? 0 : 8,
                }}
              >
                <span className="ms-status-dot ms-dot-orange" />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--sf-ch)" }}>
                    {a.name}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--sf-mt)", marginTop: 2 }}>
                    {a.message}
                  </p>
                </div>
              </div>
            ))}
          </article>

          <article
            className="mentor-shell-card mentor-shell-card-p"
            style={{ flex: 1 }}
          >
            <p className="ms-section-title">
              <span aria-hidden>🕒</span> Recent Activity
            </p>
            {activity.map((a, i) => (
              <div
                key={i}
                className="flex items-start"
                style={{
                  gap: 11,
                  padding: "11px 0",
                  borderBottom:
                    i === activity.length - 1
                      ? "none"
                      : "1px solid var(--sf-bd)",
                }}
              >
                <span
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: a.bg,
                    fontSize: 14,
                  }}
                >
                  {a.emoji}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: "var(--sf-ch)", lineHeight: 1.45 }}>
                    {a.text}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--sf-mtl)", marginTop: 3 }}>
                    {a.time}
                  </p>
                </div>
              </div>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}

function WelcomeStat({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="text-center"
      style={{
        background: "rgba(255,255,255,.12)",
        border: "1px solid rgba(255,255,255,.2)",
        borderRadius: 14,
        padding: "14px 20px",
        position: "relative",
        zIndex: 1,
        minWidth: 140,
      }}
    >
      <p
        className="font-serif-display"
        style={{ fontSize: 30, color: "#fbbf24", lineHeight: 1 }}
      >
        {value}
      </p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,.55)", marginTop: 4 }}>
        {label}
      </p>
    </div>
  );
}

function SessionsChart({ data }: { data: number[] }) {
  const lastIdx = data.length - 1;
  return (
    <svg
      viewBox="0 0 492 160"
      width="100%"
      style={{ display: "block", marginTop: 6 }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grid lines */}
      {[0, 40, 80, 120].map((y) => (
        <line
          key={y}
          x1={0}
          x2={492}
          y1={y}
          y2={y}
          stroke="rgba(0,0,0,.05)"
          strokeWidth={1}
        />
      ))}

      {data.map((value, i) => {
        const barHeight = (value / MAX_SESSIONS) * MAX_BAR_HEIGHT;
        const x = BAR_X_OFFSET + i * (BAR_WIDTH + BAR_GAP);
        const y = MAX_BAR_HEIGHT - barHeight;
        const isCurrent = i === lastIdx;
        const barFill = isCurrent ? "#1b5c3d" : "#e07847";
        const barOpacity = isCurrent ? 1 : 0.35;
        const labelText = isCurrent ? "Now" : `W${i + 1}`;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={BAR_WIDTH}
              height={barHeight}
              rx={6}
              fill={barFill}
              opacity={barOpacity}
            />
            <text
              x={x + BAR_WIDTH / 2}
              y={y - 7}
              textAnchor="middle"
              fontSize={10}
              fill={isCurrent ? "#1b5c3d" : "#9ca3af"}
              fontWeight={isCurrent ? 700 : 400}
            >
              {value}
            </text>
            <text
              x={x + BAR_WIDTH / 2}
              y={150}
              textAnchor="middle"
              fontSize={10}
              fill={isCurrent ? "#1b5c3d" : "#9ca3af"}
              fontWeight={isCurrent ? 600 : 400}
            >
              {labelText}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
