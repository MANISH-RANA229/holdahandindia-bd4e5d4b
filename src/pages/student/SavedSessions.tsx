/**
 * SavedSessions — Saffron-themed redesign matching the shell.
 * Lists the student's bookmarked sessions as `.ms-sess-row` cards.
 */
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { mentors } from "@/data/mentors";
import { Session, Student } from "@/data/types";

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

export default function SavedSessions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sessions, toggleSessionSaved } = useAppData();
  const student = user as Student;
  const mentor = mentors.find((m) => m.id === student.assignedMentorId);

  const saved = useMemo(
    () =>
      sessions
        .filter((s) => s.studentId === student.id && s.saved)
        .sort((a, b) => (a.date > b.date ? -1 : 1)),
    [sessions, student.id]
  );

  return (
    <>
      <header style={{ marginBottom: 22 }}>
        <h2
          className="font-serif-display"
          style={{ fontSize: 30, color: "var(--sf-ch)", marginBottom: 4 }}
        >
          Saved Sessions
        </h2>
        <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>
          {saved.length} bookmarked session{saved.length === 1 ? "" : "s"} ready to revisit
        </p>
      </header>

      {saved.length === 0 ? (
        <div
          className="mentor-shell-card text-center"
          style={{ padding: 48, borderRadius: 16 }}
        >
          <Bookmark
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
            No saved sessions yet
          </p>
          <p
            style={{
              fontSize: 14,
              color: "var(--sf-mt)",
              marginBottom: 20,
            }}
          >
            Bookmark sessions from the Video Sessions page to keep them here.
          </p>
          <button
            type="button"
            className="ms-btn ms-btn-primary"
            onClick={() => navigate("/student/sessions")}
          >
            Go to sessions
          </button>
        </div>
      ) : (
        saved.map((sess) => {
          const { day, time } = formatDateLine(sess.date);
          const badge = statusBadge(sess.status);
          return (
            <article key={sess.id} className="ms-sess-row">
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
                    Saved session
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
                  aria-label="Remove from saved"
                >
                  <Bookmark
                    size={14}
                    style={{
                      fill: "var(--sf-sf)",
                      color: "var(--sf-sf)",
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
