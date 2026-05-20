/**
 * StudentDashboard — Saffron-themed student home (Spec 02).
 */
import { useNavigate } from "react-router-dom";
import { MessageSquare, Video, BarChart3, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { mentors } from "@/data/mentors";
import { supportPrograms } from "@/data/supportPrograms";
import { Student } from "@/data/types";

const SKILL_KEYS = ["confidence", "discipline", "communication", "learningSpeed"] as const;
const SKILL_LABELS: Record<(typeof SKILL_KEYS)[number], string> = {
  confidence: "Confidence",
  discipline: "Discipline",
  communication: "Communication",
  learningSpeed: "Learning Speed",
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function dateLine() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "Requested":
    case "Under Review":
      return "ms-b-yellow";
    case "Approved":
    case "Sponsored":
      return "ms-b-gr";
    case "Fulfilled":
      return "ms-b-blue";
    default:
      return "ms-b-gray";
  }
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    sessions,
    dailyMessageCount,
    weeklyCallCount,
    getGrowthRecord,
    getSeriousnessRecord,
    getStudentSupportRequests,
  } = useAppData();

  const student = user as Student;
  const mentor = mentors.find((m) => m.id === student.assignedMentorId);
  const studentSessions = sessions.filter((s) => s.studentId === student.id);
  const completedSessions = studentSessions.filter(
    (s) => s.status === "completed"
  );
  const savedCount = studentSessions.filter((s) => s.saved).length;
  const growth = getGrowthRecord(student.id);
  const seriousness = getSeriousnessRecord(student.id);
  const supportReqs = getStudentSupportRequests(student.id);

  const growthScore = growth
    ? Math.round(
        (SKILL_KEYS.reduce((acc, k) => acc + growth.ratings[k], 0) /
          (SKILL_KEYS.length * 10)) *
          100
      )
    : 76;

  const totalSessions = completedSessions.length || 18;

  return (
    <>
      {/* Welcome banner */}
      <section className="stu-welcome flex items-center justify-between flex-wrap" style={{ gap: 20 }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            className="font-serif-display"
            style={{ fontSize: 28, color: "white", marginBottom: 5 }}
          >
            {greeting()}, {student.name.split(" ")[0]} 👋
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,.7)",
              lineHeight: 1.5,
            }}
          >
            {dateLine()} · Keep up your streak — {totalSessions} sessions done!
          </p>
        </div>

        <div className="flex" style={{ gap: 12, position: "relative", zIndex: 1 }}>
          <WelcomeStat value={`${growthScore}%`} label="Growth Score" />
          <WelcomeStat value={String(totalSessions)} label="Sessions Done" />
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
        <KpiCard
          label="MESSAGES TODAY"
          iconBg="#fdf0e8"
          emoji="💬"
          value={`${dailyMessageCount} / 20`}
          smallValue
          sub="Daily limit"
        />
        <KpiCard
          label="CALLS THIS WEEK"
          iconBg="#eaf4ef"
          emoji="📹"
          value={`${weeklyCallCount} / 2`}
          smallValue
          sub="Weekly limit"
        />
        <KpiCard
          label="SESSIONS"
          iconBg="#eff6ff"
          emoji="📅"
          value={String(totalSessions)}
          sub="Total completed"
        />
        <KpiCard
          label="SAVED SESSIONS"
          iconBg="#fffbeb"
          emoji="🔖"
          value={String(savedCount || 3)}
          sub="Bookmarked"
        />
      </div>

      {/* Mentor card or waiting banner */}
      {mentor ? (
        <section
          className="flex items-center justify-between flex-wrap"
          style={{
            background: "var(--sf-gr)",
            borderRadius: 16,
            padding: "20px 26px",
            marginBottom: 22,
            gap: 20,
          }}
        >
          <div className="flex items-center" style={{ gap: 18 }}>
            <div className="ms-avatar ms-av-lg ms-av-amber" style={{ width: 72, height: 72, fontSize: 24 }}>
              {mentor.avatar}
            </div>
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.55)",
                  marginBottom: 6,
                }}
              >
                Your Mentor
              </p>
              <p
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 4,
                }}
              >
                {mentor.name}
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.65)" }}>
                {mentor.field.charAt(0).toUpperCase() + mentor.field.slice(1)} ·{" "}
                {mentor.experience}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap" style={{ gap: 9 }}>
            <button
              type="button"
              className="ms-btn"
              style={{
                background: "rgba(255,255,255,.15)",
                color: "white",
                border: "1px solid rgba(255,255,255,.25)",
              }}
              onClick={() => navigate("/student/chat")}
            >
              <MessageSquare size={14} /> Chat
            </button>
            <button
              type="button"
              className="ms-btn ms-btn-primary"
              onClick={() => navigate("/student/sessions")}
            >
              <Video size={14} /> Next Session: Thu 5:00 PM
            </button>
          </div>
        </section>
      ) : (
        <section
          className="flex items-center"
          style={{
            background: "var(--sf-w)",
            borderRadius: 14,
            padding: "18px 24px",
            gap: 14,
            marginBottom: 22,
            boxShadow: "0 1px 8px rgba(0,0,0,.06)",
            border: "2px dashed rgba(224,120,71,.25)",
          }}
        >
          <span style={{ fontSize: 28, flexShrink: 0 }} aria-hidden>
            ⏳
          </span>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--sf-ch)",
                marginBottom: 3,
              }}
            >
              Waiting for a mentor
            </p>
            <p style={{ fontSize: 12, color: "var(--sf-mt)", lineHeight: 1.5 }}>
              A mentor will select you soon. Make sure your profile is complete.
            </p>
          </div>
        </section>
      )}

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
          {/* Skill Growth */}
          <article className="mentor-shell-card mentor-shell-card-p">
            <p className="ms-section-title">
              <TrendingUp size={14} style={{ color: "var(--sf-sf)" }} /> Skill Growth
            </p>
            {(growth ? SKILL_KEYS.slice(0, 3) : SKILL_KEYS.slice(0, 3)).map((skill) => {
              const current = growth?.ratings[skill] ?? (skill === "learningSpeed" ? 9 : skill === "discipline" ? 8 : 7);
              const previous = growth?.previousRatings[skill] ?? Math.max(0, current - 2);
              const delta = current - previous;
              return (
                <div key={skill} style={{ marginBottom: 16 }}>
                  <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: 6 }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--sf-ch)",
                      }}
                    >
                      {SKILL_LABELS[skill]}
                    </span>
                    <span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--sf-sf)",
                        }}
                      >
                        {current}/10
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: delta >= 0 ? "#22c55e" : "#dc2626",
                          marginLeft: 6,
                        }}
                      >
                        {delta >= 0 ? "+" : ""}
                        {delta}
                      </span>
                    </span>
                  </div>
                  <div className="ms-bar-track">
                    <div
                      className="ms-bar-fill ms-bar-sf"
                      style={{ width: `${current * 10}%` }}
                    />
                  </div>
                  <div className="ms-bar-prev">
                    <div
                      className="ms-bar-prev-fill"
                      style={{ width: `${previous * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </article>

          {/* Recent Activity */}
          <article className="mentor-shell-card mentor-shell-card-p">
            <p className="ms-section-title">
              <span aria-hidden>🕒</span> Recent Activity
            </p>
            {[
              { emoji: "🎯", bg: "#eaf4ef", text: <>Session completed — Python &amp; OOP with <b>Rana sir</b></>, time: "2 hours ago" },
              { emoji: "✓",  bg: "#fdf0e8", text: <>Goal completed: <b>Finish Python Chapter 8</b></>, time: "Yesterday" },
              { emoji: "📝", bg: "#eff6ff", text: <>Mentor added notes to your profile</>, time: "2 days ago" },
              { emoji: "🔖", bg: "#fdf0e8", text: <>You saved the <b>OOP Concepts</b> session</>, time: "3 days ago" },
            ].map((a, i, arr) => (
              <div
                key={i}
                className="flex items-start"
                style={{
                  gap: 11,
                  padding: "11px 0",
                  borderBottom:
                    i === arr.length - 1 ? "none" : "1px solid var(--sf-bd)",
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

        {/* Right column */}
        <div className="flex flex-col" style={{ gap: 16, minWidth: 0 }}>
          {/* Consistency */}
          <article className="mentor-shell-card mentor-shell-card-p">
            <p className="ms-section-title">
              <BarChart3 size={14} style={{ color: "var(--sf-sf)" }} /> Consistency
            </p>

            <ProgressLine
              label="Consistency Score"
              value={seriousness?.consistencyScore ?? 88}
              barClass="ms-bar-sf"
            />
            <ProgressLine
              label="Attendance Rate"
              value={seriousness?.attendanceRate ?? 92}
              barClass="ms-bar-gr"
            />

            <div className="flex" style={{ gap: 12, marginTop: 12 }}>
              <MiniStat
                value={String(seriousness?.missedSessions ?? 1)}
                label="Missed"
                bg="var(--sf-cream)"
                color="var(--sf-ch)"
              />
              <MiniStat
                value="4/5"
                label="Goals ✓"
                bg="var(--sf-grl)"
                color="var(--sf-gr)"
              />
            </div>
          </article>

          {/* Support requests */}
          <article
            className="mentor-shell-card mentor-shell-card-p"
            style={{ flex: 1 }}
          >
            <p className="ms-section-title">
              <span aria-hidden>💛</span> Support Request Status
            </p>
            {supportReqs.length === 0 ? (
              <>
                <SupportRow
                  name="Sponsor Student"
                  desc="Full mentorship sponsorship"
                  status="Requested"
                />
                <SupportRow
                  name="Donate Books"
                  desc="Advanced math textbooks"
                  status="Requested"
                />
              </>
            ) : (
              supportReqs.slice(0, 3).map((r) => {
                const prog = supportPrograms.find((p) => p.id === r.programId);
                return (
                  <SupportRow
                    key={r.id}
                    name={prog?.type ?? r.programId}
                    desc={prog?.description ?? ""}
                    status={r.status}
                  />
                );
              })
            )}
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
        background: "rgba(255,255,255,.15)",
        border: "1px solid rgba(255,255,255,.25)",
        borderRadius: 14,
        padding: "14px 20px",
        minWidth: 140,
      }}
    >
      <p
        className="font-serif-display"
        style={{ fontSize: 30, color: "white", lineHeight: 1 }}
      >
        {value}
      </p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,.65)", marginTop: 4 }}>
        {label}
      </p>
    </div>
  );
}

function KpiCard({
  label,
  iconBg,
  emoji,
  value,
  sub,
  smallValue,
}: {
  label: string;
  iconBg: string;
  emoji: string;
  value: string;
  sub: React.ReactNode;
  smallValue?: boolean;
}) {
  return (
    <article className="mentor-shell-card" style={{ padding: "20px 22px" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--sf-mt)",
            letterSpacing: "0.4px",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        <span
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: iconBg,
            fontSize: 18,
          }}
        >
          {emoji}
        </span>
      </div>
      <p
        className="font-serif-display"
        style={{
          fontSize: smallValue ? 28 : 36,
          color: "var(--sf-ch)",
          lineHeight: 1,
          marginBottom: 5,
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 12, color: "var(--sf-mt)" }}>{sub}</p>
    </article>
  );
}

function ProgressLine({
  label,
  value,
  barClass,
}: {
  label: string;
  value: number;
  barClass: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 6 }}
      >
        <span style={{ fontSize: 13, color: "var(--sf-mt)" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--sf-ch)" }}>
          {value}%
        </span>
      </div>
      <div className="ms-bar-track">
        <div
          className={`ms-bar-fill ${barClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function MiniStat({
  value,
  label,
  bg,
  color,
}: {
  value: string;
  label: string;
  bg: string;
  color: string;
}) {
  return (
    <div
      className="text-center"
      style={{
        background: bg,
        borderRadius: 10,
        padding: "10px 14px",
        flex: 1,
      }}
    >
      <p
        className="font-serif-display"
        style={{ fontSize: 22, color, lineHeight: 1 }}
      >
        {value}
      </p>
      <p style={{ fontSize: 11, color: "var(--sf-mt)", marginTop: 3 }}>
        {label}
      </p>
    </div>
  );
}

function SupportRow({
  name,
  desc,
  status,
}: {
  name: string;
  desc: string;
  status: string;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "14px 18px",
        background: "var(--sf-cream)",
        borderRadius: 11,
        marginBottom: 8,
        gap: 12,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--sf-ch)",
          }}
        >
          {name}
        </p>
        {desc && (
          <p style={{ fontSize: 11, color: "var(--sf-mt)", marginTop: 2 }}>
            {desc}
          </p>
        )}
      </div>
      <span className={`ms-badge ${statusBadgeClass(status)}`}>{status}</span>
    </div>
  );
}
