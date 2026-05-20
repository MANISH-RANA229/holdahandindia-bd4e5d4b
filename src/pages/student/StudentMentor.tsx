/**
 * StudentMentor — Spec 03 redesign.
 * Mentor profile card + upcoming sessions list.
 */
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Video, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { mentors } from "@/data/mentors";
import { Student } from "@/data/types";

const MENTOR_INTEREST_CHIPS: Record<string, string[]> = {
  study: ["Mathematics", "Science", "Coding", "Career Planning", "Exam Prep"],
  sports: ["Athletics", "Fitness", "Discipline", "Mental Toughness", "Team Spirit"],
  business: [
    "Business Planning",
    "Marketing",
    "Entrepreneurship",
    "Leadership",
    "Finance Basics",
  ],
};

function fieldLabel(field: string) {
  return field.charAt(0).toUpperCase() + field.slice(1);
}

function formatDateLine(iso: string): { date: string; time: string } {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return { date: iso, time: "" };
    return {
      date: d.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      time: d.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  } catch {
    return { date: iso, time: "" };
  }
}

export default function StudentMentor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sessions } = useAppData();
  const student = user as Student;
  const mentor = mentors.find((m) => m.id === student.assignedMentorId);

  const upcoming = useMemo(() => {
    if (!mentor) return [];
    return sessions
      .filter(
        (s) =>
          s.studentId === student.id &&
          s.mentorId === mentor.id &&
          s.status === "scheduled"
      )
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(0, 2);
  }, [sessions, student.id, mentor]);

  if (!mentor) {
    return (
      <>
        <header style={{ marginBottom: 22 }}>
          <h2
            className="font-serif-display"
            style={{ fontSize: 30, color: "var(--sf-ch)", marginBottom: 4 }}
          >
            My Mentor
          </h2>
          <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>
            Your assigned mentor and upcoming sessions
          </p>
        </header>

        <div
          className="mentor-shell-card text-center mx-auto"
          style={{ maxWidth: 480, padding: 32, margin: "40px auto", borderRadius: 18 }}
        >
          <span style={{ fontSize: 48, color: "#d1d5db", display: "block" }}>⏳</span>
          <h3
            className="font-serif-display"
            style={{ fontSize: 24, color: "var(--sf-ch)", margin: "16px 0 8px" }}
          >
            No mentor assigned yet
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "var(--sf-mt)",
              lineHeight: 1.65,
              marginBottom: 20,
            }}
          >
            A mentor will browse your profile and select you soon. Make sure your
            profile is complete to attract the right mentor.
          </p>
          <button
            type="button"
            className="ms-btn ms-btn-primary"
            onClick={() => navigate("/student/dashboard")}
          >
            Complete My Profile
          </button>
        </div>
      </>
    );
  }

  const chips = MENTOR_INTEREST_CHIPS[mentor.field] ?? [];

  return (
    <>
      <header style={{ marginBottom: 22 }}>
        <h2
          className="font-serif-display"
          style={{ fontSize: 30, color: "var(--sf-ch)", marginBottom: 4 }}
        >
          My Mentor
        </h2>
        <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>
          Your assigned mentor and upcoming sessions
        </p>
      </header>

      {/* Mentor profile card */}
      <article
        className="mentor-shell-card"
        style={{ padding: 28, marginBottom: 18, borderRadius: 20 }}
      >
        <div
          className="flex items-start flex-wrap"
          style={{ gap: 20, marginBottom: 20 }}
        >
          <div
            className="ms-avatar ms-av-amber"
            style={{ width: 72, height: 72, fontSize: 24 }}
          >
            {mentor.avatar}
          </div>

          <div style={{ flex: 1, minWidth: 240 }}>
            <h3
              className="font-serif-display"
              style={{ fontSize: 28, color: "var(--sf-ch)", marginBottom: 6 }}
            >
              {mentor.name}
            </h3>

            <div
              className="flex items-center flex-wrap"
              style={{ gap: 8, marginBottom: 14 }}
            >
              <span className="ms-badge ms-b-sf">{fieldLabel(mentor.field)}</span>
              <span className="ms-badge ms-b-gr">Active Mentor</span>
              <span style={{ fontSize: 12, color: "var(--sf-mt)" }}>
                · {mentor.experience}
              </span>
            </div>

            <p
              style={{
                fontSize: 14,
                color: "var(--sf-mt)",
                lineHeight: 1.75,
                marginBottom: 18,
              }}
            >
              {mentor.bio}
            </p>

            <div className="ms-chips">
              {chips.map((c) => (
                <span key={c} className="ms-chip">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <MentorStat
            value="18"
            label="Sessions with you"
          />
          <MentorStat
            value={`${mentor.studentsGuided}+`}
            label="Students guided"
          />
          <MentorStat
            value={mentor.experience.match(/\d+/)?.[0] ?? "5"}
            label="Years of experience"
          />
        </div>

        <div className="flex flex-wrap" style={{ gap: 10 }}>
          <button
            type="button"
            className="ms-btn ms-btn-gr"
            onClick={() => navigate("/student/chat")}
          >
            <MessageSquare size={14} /> Send Message
          </button>
          <button
            type="button"
            className="ms-btn ms-btn-outline"
            onClick={() => navigate("/student/sessions")}
          >
            <Video size={14} /> Schedule Video Call
          </button>
          <button
            type="button"
            className="ms-btn ms-btn-outline"
            onClick={() => navigate("/student/growth")}
          >
            <BarChart3 size={14} /> View My Insights
          </button>
        </div>
      </article>

      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--sf-ch)",
          marginBottom: 16,
        }}
      >
        Upcoming Sessions
      </p>

      {/* Sessions cards: prefer live scheduled ones, else fall back to spec demo */}
      {upcoming.length > 0 ? (
        upcoming.map((s, i) => {
          const { date, time } = formatDateLine(s.date);
          const label = i === 0 ? "Next Session" : "Following Session";
          return (
            <NextSessionCard
              key={s.id}
              label={label}
              date={date}
              time={`${time} · ${s.duration || "30 min"} · Video call`}
              primary={i === 0}
              onJoin={() => navigate("/student/sessions")}
            />
          );
        })
      ) : (
        <>
          <NextSessionCard
            label="Next Session"
            date="Thursday, May 22"
            time="5:00 PM · 45 minutes · Video call"
            primary
            onJoin={() => navigate("/student/sessions")}
          />
          <NextSessionCard
            label="Following Session"
            date="Friday, May 23"
            time="4:30 PM · 30 minutes · Video call"
            primary={false}
            onJoin={() => navigate("/student/sessions")}
          />
        </>
      )}
    </>
  );
}

function MentorStat({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="text-center"
      style={{
        background: "var(--sf-cream)",
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <p
        className="font-serif-display"
        style={{ fontSize: 26, color: "var(--sf-sf)", lineHeight: 1, marginBottom: 4 }}
      >
        {value}
      </p>
      <p style={{ fontSize: 11, color: "var(--sf-mt)" }}>{label}</p>
    </div>
  );
}

function NextSessionCard({
  label,
  date,
  time,
  primary,
  onJoin,
}: {
  label: string;
  date: string;
  time: string;
  primary: boolean;
  onJoin: () => void;
}) {
  return (
    <article
      className="mentor-shell-card flex items-center justify-between flex-wrap"
      style={{ padding: "22px 24px", marginBottom: 12, gap: 16 }}
    >
      <div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.4px",
            textTransform: "uppercase",
            color: "var(--sf-sf)",
            marginBottom: 8,
          }}
        >
          {label}
        </p>
        <p
          className="font-serif-display"
          style={{ fontSize: 22, color: "var(--sf-ch)", marginBottom: 4 }}
        >
          {date}
        </p>
        <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>{time}</p>
      </div>

      <div className="flex flex-wrap" style={{ gap: 9 }}>
        {primary ? (
          <>
            <button
              type="button"
              className="ms-btn ms-btn-primary"
              onClick={onJoin}
            >
              <Video size={14} /> Join Session
            </button>
            <button
              type="button"
              className="ms-btn ms-btn-outline"
              onClick={onJoin}
            >
              Reschedule
            </button>
          </>
        ) : (
          <span className="ms-badge ms-b-gray">Scheduled</span>
        )}
      </div>
    </article>
  );
}
