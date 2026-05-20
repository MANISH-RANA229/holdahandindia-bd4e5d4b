/**
 * SelectedStudents — Spec 04 redesign.
 * Saffron-themed: green summary banner + full-width cards with progress rings.
 */
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  BarChart3,
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { useToast } from "@/hooks/use-toast";
import { Student, Session } from "@/data/types";

const RING_RADIUS = 26;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ≈ 163.36

const AVATAR_CYCLE = [
  "ms-av-sf",
  "ms-av-gr",
  "ms-av-amber",
  "ms-av-indigo",
  "ms-av-teal",
  "ms-av-red",
];

function inferField(s: Student): { id: "study" | "sports" | "business"; label: string; badge: string } {
  const blob = (s.interests.join(" ") + " " + (s.goals ?? "")).toLowerCase();
  if (/(cricket|sport|athlet|fitness|swim|yoga)/.test(blob))
    return { id: "sports", label: "Sports", badge: "ms-b-gr" };
  if (/(business|startup|market|enterprise|public speaking|economics)/.test(blob))
    return { id: "business", label: "Business", badge: "ms-b-sf" };
  return { id: "study", label: "Study", badge: "ms-b-blue" };
}

function progressFor(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return 60 + (hash % 31); // 60–90
}

function sessionsForStudent(sessions: Session[], studentId: string) {
  const list = sessions.filter((s) => s.studentId === studentId);
  const completed = list.filter((s) => s.status === "completed").length;
  const last = list
    .filter((s) => s.status === "completed")
    .sort((a, b) => (b.date > a.date ? 1 : -1))[0];
  const next = list
    .filter((s) => s.status === "scheduled")
    .sort((a, b) => (a.date > b.date ? 1 : -1))[0];
  return { completed, last, next };
}

export default function SelectedStudents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getSelectedStudents, sessions, unselectStudent } = useAppData();
  const { toast } = useToast();
  const selected = getSelectedStudents(user!.id);

  const totalSessions = useMemo(
    () =>
      selected.reduce(
        (acc, s) => acc + sessionsForStudent(sessions, s.id).completed,
        0
      ),
    [selected, sessions]
  );

  const avgProgress = useMemo(() => {
    if (selected.length === 0) return 0;
    const total = selected.reduce((acc, s) => acc + progressFor(s.id), 0);
    return Math.round(total / selected.length);
  }, [selected]);

  const nextSessionLabel = useMemo(() => {
    const upcoming = selected
      .flatMap((s) => sessionsForStudent(sessions, s.id).next ?? [])
      .map((s) => s.date)
      .sort();
    return upcoming[0] || "Thursday 5:00 PM";
  }, [selected, sessions]);

  if (selected.length === 0) {
    return (
      <>
        <header style={{ marginBottom: 20 }}>
          <h2
            className="font-serif-display"
            style={{ fontSize: 30, color: "var(--sf-ch)", marginBottom: 4 }}
          >
            Selected Students
          </h2>
          <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>
            Your active mentorship cohort
          </p>
        </header>
        <div
          className="text-center mentor-shell-card"
          style={{ padding: 48, borderRadius: 18 }}
        >
          <Users size={48} style={{ color: "#d1d5db", margin: "0 auto 16px" }} />
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--sf-ch)",
              marginBottom: 6,
            }}
          >
            No students selected yet
          </p>
          <p
            style={{
              fontSize: 14,
              color: "var(--sf-mt)",
              marginBottom: 20,
            }}
          >
            Visit Discover Students to find and select your first student.
          </p>
          <button
            type="button"
            className="ms-btn ms-btn-primary"
            onClick={() => navigate("/mentor/discover")}
          >
            Discover Students
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <header style={{ marginBottom: 20 }}>
        <h2
          className="font-serif-display"
          style={{ fontSize: 30, color: "var(--sf-ch)", marginBottom: 4 }}
        >
          Selected Students
        </h2>
        <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>
          Your active mentorship cohort
        </p>
      </header>

      {/* Summary banner */}
      <section
        className="flex items-center justify-between flex-wrap"
        style={{
          background: "var(--sf-gr)",
          borderRadius: 16,
          padding: "20px 28px",
          marginBottom: 20,
          gap: 24,
        }}
      >
        <div>
          <h3
            className="font-serif-display"
            style={{ fontSize: 22, color: "white", marginBottom: 4 }}
          >
            {selected.length} student{selected.length === 1 ? "" : "s"} in your care
          </h3>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.55)" }}>
            Combined {totalSessions} sessions · Next session {nextSessionLabel}
          </p>
        </div>

        <div className="flex" style={{ gap: 28 }}>
          <SummaryStat value={String(totalSessions)} label="Total Sessions" />
          <SummaryStat value={`${avgProgress}%`} label="Avg Progress" />
        </div>
      </section>

      {/* Student cards */}
      <div className="flex flex-col" style={{ gap: 16 }}>
        {selected.map((s, idx) => {
          const fld = inferField(s);
          const sess = sessionsForStudent(sessions, s.id);
          const percent = progressFor(s.id);
          const dash = (RING_CIRCUMFERENCE * percent) / 100;
          const avatarClass = AVATAR_CYCLE[idx % AVATAR_CYCLE.length];
          const statusBadge =
            sess.completed >= 5
              ? { cls: "ms-b-gr", label: "Active" }
              : { cls: "ms-b-yellow", label: "Needs Attention" };

          return (
            <article
              key={s.id}
              className="mentor-shell-card"
              style={{ padding: "22px 24px", borderRadius: 18 }}
            >
              {/* Top row */}
              <div
                className="flex items-start"
                style={{ gap: 16, marginBottom: 14 }}
              >
                <div className={`ms-avatar ms-av-lg ${avatarClass}`}>
                  {s.avatar?.slice(0, 2).toUpperCase() ||
                    s.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="flex items-center flex-wrap"
                    style={{ gap: 8, marginBottom: 6 }}
                  >
                    <span
                      style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: "var(--sf-ch)",
                      }}
                    >
                      {s.name}
                    </span>
                    <span className="ms-badge ms-b-age">{s.age} yrs</span>
                    <span className={`ms-badge ${fld.badge}`}>{fld.label}</span>
                    <span className={`ms-badge ${statusBadge.cls}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--sf-mt)",
                      lineHeight: 1.55,
                      marginBottom: 10,
                    }}
                  >
                    {s.goals}
                  </p>

                  <div className="ms-chips">
                    {s.interests.map((it) => (
                      <span key={it} className="ms-chip">
                        {it}
                      </span>
                    ))}
                  </div>

                  <div
                    className="flex items-center flex-wrap"
                    style={{
                      gap: 16,
                      marginTop: 10,
                      fontSize: 12,
                      color: "var(--sf-mt)",
                    }}
                  >
                    <SessionMeta
                      icon={<CheckCircle2 size={13} />}
                      text={`${sess.completed} sessions completed`}
                    />
                    <SessionMeta
                      icon={<Clock size={13} />}
                      text={`Last session: ${
                        sess.last?.date
                          ? new Date(sess.last.date).toLocaleDateString()
                          : "—"
                      }`}
                    />
                    <SessionMeta
                      icon={<Calendar size={13} />}
                      text={`Next: ${
                        sess.next?.date
                          ? new Date(sess.next.date).toLocaleDateString()
                          : "Not scheduled"
                      }`}
                    />
                  </div>
                </div>

                <div className="text-center" style={{ flexShrink: 0 }}>
                  <div
                    className="relative"
                    style={{ width: 64, height: 64 }}
                  >
                    <svg
                      width={64}
                      height={64}
                      viewBox="0 0 64 64"
                      style={{ transform: "rotate(-90deg)" }}
                    >
                      <circle
                        cx={32}
                        cy={32}
                        r={RING_RADIUS}
                        fill="none"
                        stroke="#eaf4ef"
                        strokeWidth={6}
                      />
                      <circle
                        cx={32}
                        cy={32}
                        r={RING_RADIUS}
                        fill="none"
                        stroke="#1b5c3d"
                        strokeWidth={6}
                        strokeDasharray={`${dash} ${RING_CIRCUMFERENCE}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: 13,
                        fontWeight: 800,
                        color: "var(--sf-gr)",
                      }}
                    >
                      {percent}%
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 10,
                      color: "var(--sf-mt)",
                      marginTop: 4,
                    }}
                  >
                    Progress
                  </p>
                </div>
              </div>

              {/* Action row */}
              <div
                className="flex items-center flex-wrap"
                style={{
                  gap: 9,
                  paddingTop: 14,
                  borderTop: "1px solid var(--sf-bd)",
                }}
              >
                <button
                  type="button"
                  className="ms-btn ms-btn-gr ms-btn-sm"
                  onClick={() => navigate("/mentor/chat")}
                >
                  <MessageSquare size={13} />
                  Chat
                </button>
                <button
                  type="button"
                  className="ms-btn ms-btn-outline ms-btn-sm"
                  onClick={() => navigate("/mentor/insights")}
                >
                  <BarChart3 size={13} />
                  View Insights
                </button>
                <button
                  type="button"
                  className="ms-btn ms-btn-outline ms-btn-sm"
                  onClick={() => navigate("/mentor/sessions")}
                >
                  <Video size={13} />
                  Schedule Session
                </button>
                <button
                  type="button"
                  className="ms-btn ms-btn-ghost ms-btn-sm"
                  style={{ marginLeft: "auto", color: "#dc2626" }}
                  onClick={() => {
                    unselectStudent(user!.id, s.id);
                    toast({
                      title: "Student removed",
                      description: `${s.name} removed from your list.`,
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function SummaryStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "right" }}>
      <p
        className="font-serif-display"
        style={{ fontSize: 28, color: "#fbbf24", lineHeight: 1 }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,.5)",
          marginTop: 3,
        }}
      >
        {label}
      </p>
    </div>
  );
}

function SessionMeta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span
      className="flex items-center"
      style={{ gap: 5, color: "var(--sf-mt)" }}
    >
      <span style={{ color: "var(--sf-mtl)", display: "inline-flex" }}>
        {icon}
      </span>
      {text}
    </span>
  );
}
