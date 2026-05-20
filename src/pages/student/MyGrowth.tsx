/**
 * MyGrowth — Spec 04 redesign.
 * Skill ratings + sessions progress chart + goals checklist.
 */
import { TrendingUp, BarChart3, CheckSquare, Check, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { Student } from "@/data/types";

const SKILL_KEYS = ["confidence", "discipline", "communication", "learningSpeed"] as const;
const SKILL_LABELS: Record<(typeof SKILL_KEYS)[number], string> = {
  confidence: "Confidence",
  discipline: "Discipline",
  communication: "Communication",
  learningSpeed: "Learning Speed",
};

interface Goal {
  title: string;
  done: boolean;
  meta: string;
  progress?: { done: number; total: number };
}

const GOALS: Goal[] = [
  { title: "Complete Python Chapters 1–8", done: true,  meta: "Completed · May 20, 2025" },
  { title: "Score 80%+ in mock Math test",  done: true,  meta: "Completed · May 15, 2025" },
  { title: "Attend 5 consecutive sessions", done: true,  meta: "Completed · May 12, 2025" },
  { title: "Apply for online internship",   done: true,  meta: "Completed · May 8, 2025" },
  {
    title: "Solve 20 LeetCode problems",
    done: false,
    meta: "In progress · 12/20 done · Due May 31",
    progress: { done: 12, total: 20 },
  },
];

const WEEKLY_SESSIONS = [3, 6, 6.5, 9, 8, 11, 8, 12] as const;

export default function MyGrowth() {
  const { user } = useAuth();
  const { getGrowthRecord } = useAppData();
  const student = user as Student;
  const growth = getGrowthRecord(student.id);

  const totalSessions = 18;
  const growthScore = growth
    ? Math.round(
        (SKILL_KEYS.reduce((acc, k) => acc + growth.ratings[k], 0) /
          (SKILL_KEYS.length * 10)) *
          100
      )
    : 76;

  return (
    <>
      <header style={{ marginBottom: 22 }}>
        <h2
          className="font-serif-display"
          style={{ fontSize: 30, color: "var(--sf-ch)", marginBottom: 4 }}
        >
          My Growth
        </h2>
        <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>
          Track your skills, goals and learning progress
        </p>
      </header>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 18,
          marginBottom: 18,
        }}
      >
        {/* Skill Ratings */}
        <article className="mentor-shell-card mentor-shell-card-p">
          <p className="ms-section-title">
            <TrendingUp size={14} style={{ color: "var(--sf-sf)" }} /> Skill Ratings
          </p>

          {SKILL_KEYS.map((skill) => {
            const current = growth?.ratings[skill] ?? 7;
            const previous = growth?.previousRatings[skill] ?? Math.max(0, current - 2);
            const delta = current - previous;
            return (
              <div key={skill} style={{ marginBottom: 18 }}>
                <div
                  className="flex items-center justify-between"
                  style={{ marginBottom: 7 }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--sf-ch)" }}>
                    {SKILL_LABELS[skill]}
                  </span>
                  <span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--sf-sf)" }}>
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

          <p style={{ fontSize: 11, color: "var(--sf-mtl)", marginTop: 4 }}>
            Thick bar = now · Thin bar = 1 month ago
          </p>
        </article>

        {/* Sessions Progress */}
        <article className="mentor-shell-card mentor-shell-card-p">
          <p className="ms-section-title">
            <BarChart3 size={14} style={{ color: "var(--sf-sf)" }} /> Sessions Progress
          </p>

          <SessionsChart data={[...WEEKLY_SESSIONS]} />

          <div
            className="flex items-center justify-between"
            style={{ marginTop: 14, gap: 12 }}
          >
            <ProgressStat
              value={String(totalSessions)}
              label="Total sessions"
              color="var(--sf-sf)"
            />
            <ProgressStat
              value={`${growthScore}%`}
              label="Growth score"
              color="var(--sf-gr)"
            />
            <ProgressStat
              value="+12%"
              label="This month"
              color="var(--sf-ch)"
            />
          </div>
        </article>
      </div>

      {/* Goals */}
      <article className="mentor-shell-card mentor-shell-card-p">
        <p className="ms-section-title">
          <CheckSquare size={14} style={{ color: "var(--sf-sf)" }} /> My Goals
        </p>

        {GOALS.map((g, i, arr) => (
          <div
            key={g.title}
            className="flex items-start"
            style={{
              gap: 12,
              padding: "14px 0",
              borderBottom:
                i === arr.length - 1 ? "none" : "1px solid var(--sf-bd)",
            }}
          >
            <span
              className={`ms-goal-check ${g.done ? "ms-goal-done" : "ms-goal-pending"}`}
            >
              {g.done ? <Check size={12} /> : <Clock size={12} />}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--sf-ch)",
                  marginBottom: 3,
                }}
              >
                {g.title}
              </p>
              <p style={{ fontSize: 11, color: "var(--sf-mt)" }}>{g.meta}</p>
            </div>
            {g.progress && (
              <div style={{ width: 120, marginTop: 6 }}>
                <div className="ms-bar-track">
                  <div
                    className="ms-bar-fill ms-bar-sf"
                    style={{
                      width: `${Math.round(
                        (g.progress.done / g.progress.total) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </article>
    </>
  );
}

function ProgressStat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center" style={{ flex: 1 }}>
      <p
        className="font-serif-display"
        style={{ fontSize: 22, color, lineHeight: 1 }}
      >
        {value}
      </p>
      <p style={{ fontSize: 11, color: "var(--sf-mt)", marginTop: 4 }}>
        {label}
      </p>
    </div>
  );
}

function SessionsChart({ data }: { data: number[] }) {
  const max = 10;
  const barWidth = 28;
  const gap = 16;
  const lastIdx = data.length - 1;
  return (
    <svg
      viewBox="0 0 360 140"
      width="100%"
      style={{ display: "block", marginTop: 4 }}
      preserveAspectRatio="xMidYMid meet"
    >
      {[0, 40, 80, 106].map((y) => (
        <line
          key={y}
          x1={0}
          x2={360}
          y1={y}
          y2={y}
          stroke="rgba(0,0,0,.05)"
          strokeWidth={1}
        />
      ))}
      {data.map((value, i) => {
        const h = Math.round((value / max) * 106);
        const x = 8 + i * (barWidth + gap);
        const y = 106 - h;
        const isCurrent = i === lastIdx;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={h}
              rx={5}
              fill={isCurrent ? "#1b5c3d" : "#e07847"}
              opacity={isCurrent ? 1 : 0.3}
            />
            <text
              x={x + barWidth / 2}
              y={130}
              textAnchor="middle"
              fontSize={9}
              fill={isCurrent ? "#1b5c3d" : "#9ca3af"}
              fontWeight={isCurrent ? 700 : 400}
            >
              {isCurrent ? "Now" : `W${i + 1}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
