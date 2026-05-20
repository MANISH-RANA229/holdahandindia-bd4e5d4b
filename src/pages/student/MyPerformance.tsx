/**
 * MyPerformance — Spec 05 redesign.
 * Performance hero + metrics card + activity heatmap + badge chips.
 */
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { Student } from "@/data/types";

const HEATMAP_LEVELS = [
  0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 3, 4, 2, 1, 3, 2, 1, 4, 3, 2, 1, 0, 2, 3, 4, 3,
  2, 1, 2, 3,
];

const HEATMAP_COLORS = [
  "#f3f4f6",
  "rgba(224,120,71,.2)",
  "rgba(224,120,71,.4)",
  "rgba(224,120,71,.65)",
  "#e07847",
];

const DAY_HEADERS = ["M", "T", "W", "T", "F", "S", "S"] as const;

const BADGES = [
  { emoji: "🔥", title: "7-Day Streak", sub: "Active learner", bg: "#fdf0e8", color: "#e07847" },
  { emoji: "🎯", title: "Goal Crusher", sub: "4 goals done", bg: "#eaf4ef", color: "#1b5c3d" },
  { emoji: "⭐", title: "Top Student",  sub: "88% score",    bg: "#eff6ff", color: "#1d4ed8" },
];

export default function MyPerformance() {
  const { user } = useAuth();
  const { getSeriousnessRecord } = useAppData();
  const student = user as Student;
  const record = getSeriousnessRecord(student.id);

  const consistency = record?.consistencyScore ?? 88;
  const attendance = record?.attendanceRate ?? 92;
  const missed = record?.missedSessions ?? 1;
  const overall = Math.round((consistency + attendance) / 2);

  return (
    <>
      {/* Hero banner (green gradient) */}
      <section
        className="flex items-center justify-between flex-wrap"
        style={{
          background: "linear-gradient(118deg, #1b5c3d 0%, #2d7a52 100%)",
          borderRadius: 20,
          padding: "26px 32px",
          marginBottom: 22,
          gap: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(255,255,255,.05)",
            bottom: -60,
            right: -40,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
          <h2
            className="font-serif-display"
            style={{ fontSize: 26, color: "white", marginBottom: 6 }}
          >
            Performance Overview
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,.6)",
              lineHeight: 1.5,
            }}
          >
            Your consistency and attendance for this month. Keep your streak going!
          </p>
        </div>

        <div
          className="text-center"
          style={{
            background: "rgba(255,255,255,.15)",
            border: "1px solid rgba(255,255,255,.2)",
            borderRadius: 14,
            padding: "16px 22px",
            position: "relative",
            zIndex: 1,
            minWidth: 160,
          }}
        >
          <p
            className="font-serif-display"
            style={{ fontSize: 42, color: "#fbbf24", lineHeight: 1 }}
          >
            {overall}%
          </p>
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,.6)",
              marginTop: 4,
            }}
          >
            Overall Score
          </p>
        </div>
      </section>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 18,
        }}
      >
        {/* Metrics */}
        <article className="mentor-shell-card mentor-shell-card-p">
          <p className="ms-section-title">Performance Metrics</p>

          <MetricRow
            label="Consistency Score"
            bar={consistency}
            barClass="ms-bar-sf"
            value={`${consistency}%`}
            valueColor="var(--sf-sf)"
          />
          <MetricRow
            label="Attendance Rate"
            bar={attendance}
            barClass="ms-bar-gr"
            value={`${attendance}%`}
          />
          <MetricRow
            label="Assignments Submitted"
            bar={85}
            barClass="ms-bar-sf"
            value="17 / 20"
          />
          <MetricRow label="Sessions Completed" value="18 of 19" />
          <MetricRow
            label="Missed Sessions"
            value={String(missed)}
            valueColor={missed > 3 ? "#dc2626" : undefined}
          />
          <MetricRow label="Goals Achieved" value="4 of 5 ✓" valueColor="var(--sf-gr)" />
          <MetricRow
            label="Current Streak"
            value="🔥 7 days"
            valueColor="var(--sf-sf)"
            isLast
          />
        </article>

        {/* Activity + Badges */}
        <article className="mentor-shell-card mentor-shell-card-p">
          <p className="ms-section-title">Monthly Activity</p>

          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 3,
              marginBottom: 6,
            }}
          >
            {DAY_HEADERS.map((d, i) => (
              <span
                key={i}
                className="text-center"
                style={{ fontSize: 9, color: "var(--sf-mtl)" }}
              >
                {d}
              </span>
            ))}
          </div>

          <div className="ms-heatmap">
            {HEATMAP_LEVELS.slice(0, 31).map((level, i) => (
              <span
                key={i}
                className="ms-heatmap-cell"
                style={{ background: HEATMAP_COLORS[level] }}
              />
            ))}
          </div>

          <div
            className="flex items-center"
            style={{
              gap: 12,
              marginTop: 12,
              fontSize: 11,
              color: "var(--sf-mt)",
              flexWrap: "wrap",
            }}
          >
            <Legend bg="#f3f4f6" label="None" />
            <Legend bg="rgba(224,120,71,.4)" label="Low" />
            <Legend bg="#e07847" label="Active" />
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(0,0,0,.08)",
              margin: "16px 0",
            }}
          />

          <p className="ms-section-title">Badges Earned</p>
          <div className="flex flex-wrap" style={{ gap: 8 }}>
            {BADGES.map((b) => (
              <div
                key={b.title}
                className="ms-badge-chip"
                style={{ background: b.bg }}
              >
                <span style={{ fontSize: 18 }} aria-hidden>
                  {b.emoji}
                </span>
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: b.color,
                    }}
                  >
                    {b.title}
                  </p>
                  <p style={{ fontSize: 10, color: "var(--sf-mt)", marginTop: 2 }}>
                    {b.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </>
  );
}

function MetricRow({
  label,
  bar,
  barClass = "ms-bar-sf",
  value,
  valueColor,
  isLast,
}: {
  label: string;
  bar?: number;
  barClass?: string;
  value: string;
  valueColor?: string;
  isLast?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "13px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(0,0,0,.08)",
        gap: 16,
      }}
    >
      <span style={{ fontSize: 13, color: "var(--sf-ch)" }}>{label}</span>
      <div className="flex items-center" style={{ gap: 16 }}>
        {typeof bar === "number" && (
          <div style={{ width: 160 }}>
            <div className="ms-bar-track">
              <div
                className={`ms-bar-fill ${barClass}`}
                style={{ width: `${bar}%` }}
              />
            </div>
          </div>
        )}
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: valueColor ?? "var(--sf-ch)",
            minWidth: 70,
            textAlign: "right",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function Legend({ bg, label }: { bg: string; label: string }) {
  return (
    <span className="flex items-center" style={{ gap: 4 }}>
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          background: bg,
          display: "inline-block",
        }}
      />
      {label}
    </span>
  );
}
