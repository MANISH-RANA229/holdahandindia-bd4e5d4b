/**
 * StudentVideoSessions — Saffron-themed redesign matching the shell.
 * Hero banner with weekly-call status + history list with filter pills.
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Calendar, AlertCircle, Bookmark } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { useToast } from "@/hooks/use-toast";
import { mentors } from "@/data/mentors";
import { Session, Student } from "@/data/types";

const MAX_WEEKLY_CALLS = 2;

function durationMinutes(d: string): number {
  const m = /(\d+)/.exec(d);
  return m ? Number(m[1]) : 0;
}

function formatDateLine(iso: string): { day: string; time: string } {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return { day: iso, time: "" };
    return {
      day: d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: d.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  } catch {
    return { day: iso, time: "" };
  }
}

function statusBadge(status: Session["status"]) {
  if (status === "completed") return { cls: "ms-b-gr", label: "Completed" };
  if (status === "scheduled") return { cls: "ms-b-yellow", label: "Scheduled" };
  return { cls: "ms-b-gray", label: "Cancelled" };
}

type Filter = "All" | "Completed" | "Scheduled" | "Saved";
const FILTERS: Filter[] = ["All", "Completed", "Scheduled", "Saved"];

export default function StudentVideoSessions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    sessions,
    addSession,
    toggleSessionSaved,
    weeklyCallCount,
    incrementCallCount,
  } = useAppData();
  const student = user as Student;
  const mentor = mentors.find((m) => m.id === student.assignedMentorId);

  const [filter, setFilter] = useState<Filter>("All");

  const studentSessions = useMemo(
    () =>
      sessions
        .filter((s) => s.studentId === student.id)
        .sort((a, b) => (a.date > b.date ? -1 : 1)),
    [sessions, student.id]
  );

  const completed = studentSessions.filter((s) => s.status === "completed");
  const totalMinutes = completed.reduce(
    (acc, s) => acc + durationMinutes(s.duration),
    0
  );
  const totalHours = (totalMinutes / 60).toFixed(1);
  const isLimitReached = weeklyCallCount >= MAX_WEEKLY_CALLS;

  const filtered = useMemo(() => {
    switch (filter) {
      case "Completed":
        return studentSessions.filter((s) => s.status === "completed");
      case "Scheduled":
        return studentSessions.filter((s) => s.status === "scheduled");
      case "Saved":
        return studentSessions.filter((s) => s.saved);
      default:
        return studentSessions;
    }
  }, [studentSessions, filter]);

  const handleRequest = () => {
    if (isLimitReached || !mentor) return;
    addSession({
      id: `ses${Date.now()}`,
      mentorId: mentor.id,
      studentId: student.id,
      date: new Date().toISOString().split("T")[0],
      duration: "30 min",
      topic: "Requested Session",
      status: "scheduled",
      saved: false,
    });
    incrementCallCount();
    toast({ title: "Session requested!", description: "Your mentor will be notified." });
  };

  return (
    <>
      {/* Hero banner */}
      <section
        className="flex items-center justify-between flex-wrap"
        style={{
          background: "linear-gradient(118deg, #1b5c3d 0%, #2d7a52 100%)",
          borderRadius: 20,
          padding: "28px 32px",
          marginBottom: 20,
          gap: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255,255,255,.05)",
            top: -80,
            right: -50,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 460 }}>
          <h2
            className="font-serif-display"
            style={{ fontSize: 26, color: "white", marginBottom: 8 }}
          >
            Ready for your next session?
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,.65)",
              lineHeight: 1.6,
            }}
          >
            You've used {weeklyCallCount} of {MAX_WEEKLY_CALLS} video calls this
            week. Sessions are recorded so you can revisit them anytime.
          </p>
        </div>
        <div
          className="flex flex-wrap"
          style={{ gap: 9, position: "relative", zIndex: 1 }}
        >
          <button
            type="button"
            className="ms-btn ms-btn-primary ms-btn-lg"
            onClick={handleRequest}
            disabled={isLimitReached || !mentor}
          >
            <Video size={14} /> Request Session
          </button>
          <button
            type="button"
            className="ms-btn ms-btn-lg"
            style={{
              background: "rgba(255,255,255,.15)",
              color: "white",
              border: "1.5px solid rgba(255,255,255,.3)",
            }}
            onClick={() => navigate("/student/chat")}
          >
            <Calendar size={14} /> Discuss with mentor
          </button>
        </div>
      </section>

      {isLimitReached && (
        <div
          className="flex items-center"
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 12,
            padding: "12px 16px",
            gap: 10,
            marginBottom: 16,
            fontSize: 13,
            color: "#b91c1c",
          }}
        >
          <AlertCircle size={16} />
          Weekly video call limit reached. Try again next week!
        </div>
      )}

      {/* Stats */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 22,
        }}
      >
        <StatCard value={String(completed.length)} label="Sessions completed" />
        <StatCard value={`${totalHours}h`} label="Total hours" />
        <StatCard
          value={`${weeklyCallCount}/${MAX_WEEKLY_CALLS}`}
          label="Calls this week"
        />
      </div>

      {/* History */}
      <div
        className="flex items-center justify-between flex-wrap"
        style={{ gap: 12, marginBottom: 14 }}
      >
        <p style={{ fontSize: 15, fontWeight: 700, color: "var(--sf-ch)" }}>
          Session History
        </p>
        <div className="flex flex-wrap" style={{ gap: 8 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`ms-sess-pill${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="mentor-shell-card text-center"
          style={{ padding: 48, borderRadius: 16 }}
        >
          <Video size={48} style={{ color: "#d1d5db", margin: "0 auto 16px" }} />
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--sf-ch)",
              marginBottom: 6,
            }}
          >
            {studentSessions.length === 0
              ? "No sessions yet"
              : `No ${filter.toLowerCase()} sessions`}
          </p>
          <p style={{ fontSize: 14, color: "var(--sf-mt)", marginBottom: 20 }}>
            {studentSessions.length === 0
              ? "Request your first session above to get started."
              : "Try clearing the filter to see all sessions."}
          </p>
          {studentSessions.length === 0 && mentor && !isLimitReached && (
            <button type="button" className="ms-btn ms-btn-gr" onClick={handleRequest}>
              Request First Session
            </button>
          )}
        </div>
      ) : (
        filtered.map((sess) => {
          const { day, time } = formatDateLine(sess.date);
          const badge = statusBadge(sess.status);
          const isUpcoming = sess.status === "scheduled";
          return (
            <article
              key={sess.id}
              className={`ms-sess-row${
                isUpcoming ? " ms-sess-row-upcoming" : ""
              }`}
            >
              <div style={{ minWidth: 110 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--sf-ch)",
                  }}
                >
                  {day}
                </p>
                <p style={{ fontSize: 12, color: "var(--sf-mt)", marginTop: 2 }}>
                  {time}
                </p>
              </div>
              <div
                className="flex items-center"
                style={{ flex: 1, gap: 10, minWidth: 180 }}
              >
                <span className="ms-avatar ms-av-sm ms-av-amber">
                  {mentor?.avatar?.charAt(0).toUpperCase() ?? "M"}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--sf-ch)",
                    }}
                  >
                    {mentor?.name ?? "Your mentor"}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--sf-mt)",
                      marginTop: 2,
                    }}
                  >
                    Mentorship session
                  </p>
                </div>
              </div>
              <div className="text-center" style={{ minWidth: 80 }}>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--sf-ch)",
                  }}
                >
                  {sess.duration || "—"}
                </p>
                <p style={{ fontSize: 10, color: "var(--sf-mt)", marginTop: 2 }}>
                  Duration
                </p>
              </div>
              <p
                style={{
                  flex: 2,
                  fontSize: 12,
                  color: "var(--sf-mt)",
                  lineHeight: 1.55,
                  minWidth: 200,
                }}
              >
                {sess.topic || "—"}
              </p>
              <div className="flex items-center" style={{ gap: 8 }}>
                <span className={`ms-badge ${badge.cls}`}>{badge.label}</span>
                <button
                  type="button"
                  className="ms-btn ms-btn-ghost ms-btn-sm"
                  onClick={() => toggleSessionSaved(sess.id)}
                  aria-label={sess.saved ? "Unsave session" : "Save session"}
                >
                  <Bookmark
                    size={14}
                    style={{
                      fill: sess.saved ? "var(--sf-sf)" : "transparent",
                      color: sess.saved ? "var(--sf-sf)" : "var(--sf-mt)",
                    }}
                  />
                </button>
              </div>
            </article>
          );
        })
      )}
    </>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="mentor-shell-card" style={{ padding: "18px 22px" }}>
      <p
        className="font-serif-display"
        style={{ fontSize: 32, color: "var(--sf-ch)", lineHeight: 1, marginBottom: 4 }}
      >
        {value}
      </p>
      <p style={{ fontSize: 12, color: "var(--sf-mt)" }}>{label}</p>
    </div>
  );
}
