/**
 * MentorVideoSessions — Spec 07 redesign.
 * Green hero banner, 3 stat cards, filterable session history list.
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { useToast } from "@/hooks/use-toast";
import { Session, Student } from "@/data/types";

const AVATAR_CYCLE = [
  "ms-av-sf",
  "ms-av-gr",
  "ms-av-amber",
  "ms-av-indigo",
  "ms-av-teal",
  "ms-av-red",
];

function inferTrack(s: Student | undefined): string {
  if (!s) return "Mentorship";
  const blob = (s.interests.join(" ") + " " + (s.goals ?? "")).toLowerCase();
  if (/(cricket|sport|athlet|fitness|swim|yoga)/.test(blob)) return "Sports Track";
  if (/(business|startup|market|enterprise|public speaking|economics)/.test(blob))
    return "Business Track";
  return "Study Track";
}

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

export default function MentorVideoSessions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sessions, students, getSelectedStudents } = useAppData();

  const mentorSessions = useMemo(
    () =>
      sessions
        .filter((s) => s.mentorId === user!.id)
        .sort((a, b) => (a.date > b.date ? -1 : 1)),
    [sessions, user]
  );
  const selected = getSelectedStudents(user!.id);

  // Index student colors so the same student always gets the same avatar tint
  const studentColor = useMemo(() => {
    const map = new Map<string, string>();
    students.forEach((s, i) => map.set(s.id, AVATAR_CYCLE[i % AVATAR_CYCLE.length]));
    return map;
  }, [students]);

  const studentsInSessions = useMemo(() => {
    const ids = new Set(mentorSessions.map((s) => s.studentId));
    return students.filter((s) => ids.has(s.id));
  }, [mentorSessions, students]);

  const [filter, setFilter] = useState<string>("All");

  const filteredSessions = useMemo(() => {
    if (filter === "All") return mentorSessions;
    return mentorSessions.filter((s) => {
      const stu = students.find((x) => x.id === s.studentId);
      return stu?.name === filter;
    });
  }, [mentorSessions, students, filter]);

  const completed = mentorSessions.filter((s) => s.status === "completed");
  const totalSessions = completed.length;
  const totalMinutes = completed.reduce(
    (acc, s) => acc + durationMinutes(s.duration),
    0
  );
  const totalHours = (totalMinutes / 60).toFixed(0);
  const avgMinutes = completed.length
    ? Math.round(totalMinutes / completed.length)
    : 0;

  const nextScheduled = mentorSessions.find((s) => s.status === "scheduled");
  const nextStudent = nextScheduled
    ? students.find((x) => x.id === nextScheduled.studentId)
    : undefined;

  const handleStart = () => {
    toast({
      title: "Starting session…",
      description: nextStudent
        ? `Opening a video room with ${nextStudent.name}.`
        : "Choose a selected student to begin.",
    });
  };

  return (
    <>
      {/* Hero banner */}
      <section
        className="flex items-center justify-between flex-wrap"
        style={{
          background: "var(--sf-gr)",
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
        <div style={{ maxWidth: 460, position: "relative", zIndex: 1 }}>
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
              maxWidth: 420,
            }}
          >
            {nextScheduled && nextStudent
              ? `Your next scheduled session is with ${nextStudent.name} on ${
                  formatDateLine(nextScheduled.date).day
                } at ${formatDateLine(nextScheduled.date).time}. `
              : `You have ${selected.length} selected student${
                  selected.length === 1 ? "" : "s"
                }. `}
            Video calls are recorded and accessible any time.
          </p>
        </div>
        <div
          className="flex flex-wrap"
          style={{ gap: 9, position: "relative", zIndex: 1 }}
        >
          <button
            type="button"
            className="ms-btn ms-btn-primary ms-btn-lg"
            onClick={handleStart}
          >
            <Video size={14} /> Start New Session
          </button>
          <button
            type="button"
            className="ms-btn ms-btn-lg"
            style={{
              background: "rgba(255,255,255,.15)",
              color: "white",
              border: "1.5px solid rgba(255,255,255,.3)",
            }}
            onClick={() => navigate("/mentor/selected")}
          >
            <Calendar size={14} /> Schedule
          </button>
        </div>
      </section>

      {/* Stats row */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 22,
        }}
      >
        <StatCard value={String(totalSessions)} label="Total sessions completed" />
        <StatCard value={`${totalHours}h`} label="Total hours mentored" />
        <StatCard
          value={avgMinutes ? `${avgMinutes} min` : "—"}
          label="Average session length"
        />
      </div>

      {/* Session history header */}
      <div
        className="flex items-center justify-between flex-wrap"
        style={{ gap: 12, marginBottom: 14 }}
      >
        <p style={{ fontSize: 15, fontWeight: 700, color: "var(--sf-ch)" }}>
          Session History
        </p>
        <div className="flex flex-wrap" style={{ gap: 8 }}>
          <FilterPill
            label="All"
            active={filter === "All"}
            onClick={() => setFilter("All")}
          />
          {studentsInSessions.map((s) => (
            <FilterPill
              key={s.id}
              label={s.name}
              active={filter === s.name}
              onClick={() => setFilter(s.name)}
            />
          ))}
        </div>
      </div>

      {/* Sessions */}
      {filteredSessions.length === 0 ? (
        <div
          className="mentor-shell-card text-center"
          style={{ padding: 48, borderRadius: 16 }}
        >
          <Video
            size={48}
            style={{ color: "#d1d5db", margin: "0 auto 16px" }}
          />
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--sf-ch)",
              marginBottom: 6,
            }}
          >
            {mentorSessions.length === 0
              ? "No sessions yet"
              : `No sessions for ${filter}`}
          </p>
          <p
            style={{
              fontSize: 14,
              color: "var(--sf-mt)",
              marginBottom: 20,
            }}
          >
            {mentorSessions.length === 0
              ? "Start your first session with a selected student."
              : "Try clearing the filter to see all sessions."}
          </p>
          {mentorSessions.length === 0 ? (
            <button
              type="button"
              className="ms-btn ms-btn-gr"
              onClick={handleStart}
            >
              Start First Session
            </button>
          ) : (
            <button
              type="button"
              className="ms-btn ms-btn-outline"
              onClick={() => setFilter("All")}
            >
              Show all sessions
            </button>
          )}
        </div>
      ) : (
        filteredSessions.map((sess) => {
          const stu = students.find((x) => x.id === sess.studentId);
          const { day, time } = formatDateLine(sess.date);
          const badge = statusBadge(sess.status);
          const isUpcoming = sess.status === "scheduled";
          const avatarClass = studentColor.get(sess.studentId) ?? "ms-av-sf";
          return (
            <article
              key={sess.id}
              className={`ms-sess-row${
                isUpcoming ? " ms-sess-row-upcoming" : ""
              }`}
              data-student={stu?.name ?? ""}
            >
              {/* Date */}
              <div style={{ minWidth: 110 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--sf-ch)" }}>
                  {day}
                </p>
                <p style={{ fontSize: 12, color: "var(--sf-mt)", marginTop: 2 }}>
                  {time}
                </p>
              </div>

              {/* Student */}
              <div
                className="flex items-center"
                style={{ flex: 1, gap: 10, minWidth: 180 }}
              >
                <span className={`ms-avatar ms-av-sm ${avatarClass}`}>
                  {stu?.avatar?.slice(0, 2).toUpperCase() ||
                    stu?.name?.charAt(0).toUpperCase() ||
                    "?"}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--sf-ch)",
                    }}
                  >
                    {stu?.name ?? "Unknown student"}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--sf-mt)", marginTop: 2 }}>
                    {inferTrack(stu)}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="text-center" style={{ minWidth: 80 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--sf-ch)" }}>
                  {sess.duration || "—"}
                </p>
                <p style={{ fontSize: 10, color: "var(--sf-mt)", marginTop: 2 }}>
                  Duration
                </p>
              </div>

              {/* Notes / topic */}
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

              <span className={`ms-badge ${badge.cls}`}>{badge.label}</span>
            </article>
          );
        })
      )}
    </>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="mentor-shell-card"
      style={{ padding: "18px 22px" }}
    >
      <p
        className="font-serif-display"
        style={{
          fontSize: 32,
          color: "var(--sf-ch)",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 12, color: "var(--sf-mt)" }}>{label}</p>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ms-sess-pill${active ? " active" : ""}`}
    >
      {label}
    </button>
  );
}
