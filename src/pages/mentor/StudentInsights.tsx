/**
 * StudentInsights — Spec 05 redesign.
 * Saffron-themed two-column layout with Growth / Seriousness / Support sub-tabs.
 */
import { useEffect, useMemo, useState } from "react";
import { TrendingUp, Info, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { Mentor, Student } from "@/data/types";
import { getSeriousnessLevel } from "@/data/seriousnessData";
import { supportPrograms } from "@/data/supportPrograms";

const AVATAR_CYCLE = [
  "ms-av-sf",
  "ms-av-gr",
  "ms-av-amber",
  "ms-av-indigo",
  "ms-av-teal",
  "ms-av-red",
];

const SKILL_KEYS = ["confidence", "discipline", "communication", "learningSpeed"] as const;
const SKILL_LABELS: Record<(typeof SKILL_KEYS)[number], string> = {
  confidence: "Confidence",
  discipline: "Discipline",
  communication: "Communication",
  learningSpeed: "Learning Speed",
};

type SubTab = "growth" | "serious" | "support";

function inferField(s: Student): { id: "study" | "sports" | "business"; label: string; badge: string } {
  const blob = (s.interests.join(" ") + " " + (s.goals ?? "")).toLowerCase();
  if (/(cricket|sport|athlet|fitness|swim|yoga)/.test(blob))
    return { id: "sports", label: "Sports", badge: "ms-b-gr" };
  if (/(business|startup|market|enterprise|public speaking|economics)/.test(blob))
    return { id: "business", label: "Business", badge: "ms-b-sf" };
  return { id: "study", label: "Study", badge: "ms-b-blue" };
}

function pseudoPercent(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return 60 + (hash % 31);
}

function supportStatusBadge(status: string) {
  switch (status) {
    case "Under Review":
      return "ms-b-yellow";
    case "Sponsored":
    case "Approved":
      return "ms-b-gr";
    case "Fulfilled":
      return "ms-b-blue";
    default:
      return "ms-b-gray";
  }
}

export default function StudentInsights() {
  const { user } = useAuth();
  const mentor = user as Mentor;
  const {
    getSelectedStudents,
    getGrowthRecord,
    getSeriousnessRecord,
    updateGrowthRating,
    updateGrowthNote,
    getStudentSupportRequests,
    markStudentNeedsSupport,
  } = useAppData();

  const selected = getSelectedStudents(mentor.id);
  const [activeId, setActiveId] = useState<string>(selected[0]?.id ?? "");
  const [subTab, setSubTab] = useState<SubTab>("growth");
  const [supportProgram, setSupportProgram] = useState("");
  const [supportNote, setSupportNote] = useState("");

  // Keep activeId in sync when the selected list changes
  useEffect(() => {
    if (!selected.find((s) => s.id === activeId) && selected[0]) {
      setActiveId(selected[0].id);
    }
  }, [selected, activeId]);

  const decorated = useMemo(
    () =>
      selected.map((s, i) => ({
        student: s,
        avatarClass: AVATAR_CYCLE[i % AVATAR_CYCLE.length],
        field: inferField(s),
        percent: pseudoPercent(s.id),
      })),
    [selected]
  );

  const active = decorated.find((d) => d.student.id === activeId);

  if (selected.length === 0) {
    return (
      <>
        <header style={{ marginBottom: 20 }}>
          <h2
            className="font-serif-display"
            style={{ fontSize: 30, color: "var(--sf-ch)", marginBottom: 4 }}
          >
            Student Insights
          </h2>
          <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>
            Growth tracking, seriousness metrics &amp; support needs
          </p>
        </header>
        <div
          className="mentor-shell-card text-center"
          style={{ padding: 40, borderRadius: 18 }}
        >
          <p style={{ fontSize: 14, color: "var(--sf-mt)" }}>
            No selected students. Visit Discover to select students first.
          </p>
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
          Student Insights
        </h2>
        <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>
          Growth tracking, seriousness metrics &amp; support needs
        </p>
      </header>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(0, 256px) minmax(0, 1fr)",
          gap: 18,
        }}
      >
        {/* ── Left: student list ── */}
        <aside
          className="mentor-shell-card mentor-shell-card-p"
          style={{ alignSelf: "start" }}
        >
          <p className="ms-section-title">Your Students</p>
          <div className="flex flex-col" style={{ gap: 6 }}>
            {decorated.map(({ student: s, avatarClass, field, percent }) => {
              const sr = getSeriousnessRecord(s.id);
              const level = sr ? getSeriousnessLevel(sr) : "low";
              const dotClass =
                level === "high"
                  ? "ms-dot-green"
                  : level === "medium"
                  ? "ms-dot-orange"
                  : "ms-dot-gray";
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  className={`ms-ins-student${isActive ? " active" : ""}`}
                  onClick={() => {
                    setActiveId(s.id);
                    setSubTab("growth");
                  }}
                >
                  <span className={`ms-avatar ms-av-sm ${avatarClass}`}>
                    {s.avatar || s.name.charAt(0)}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--sf-ch)",
                      }}
                    >
                      {s.name}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: 11,
                        color: "var(--sf-mt)",
                        marginTop: 2,
                      }}
                    >
                      {field.label} · {s.interests[0] ?? "—"}
                    </span>
                  </span>
                  <span
                    className="flex flex-col items-end"
                    style={{ gap: 5, flexShrink: 0 }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--sf-gr)",
                      }}
                    >
                      {percent}%
                    </span>
                    <span className={`ms-status-dot ${dotClass}`} />
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Right: detail panel ── */}
        <section style={{ minWidth: 0 }}>
          {active && (
            <>
              {/* Student header */}
              <div
                className="mentor-shell-card flex items-center justify-between flex-wrap"
                style={{
                  padding: "18px 22px",
                  marginBottom: 16,
                  gap: 12,
                }}
              >
                <div className="flex items-center" style={{ gap: 12 }}>
                  <span className={`ms-avatar ms-av-md ${active.avatarClass}`}>
                    {active.student.avatar || active.student.name.charAt(0)}
                  </span>
                  <div>
                    <p
                      style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: "var(--sf-ch)",
                        marginBottom: 3,
                      }}
                    >
                      {active.student.name}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--sf-mt)" }}>
                      Age {active.student.age} · {active.field.label} Track ·{" "}
                      {getStudentSupportRequests(active.student.id).length}{" "}
                      Support Requests
                    </p>
                  </div>
                </div>
                <div className="flex items-center" style={{ gap: 10 }}>
                  <span
                    className={`ms-badge ${
                      (getSeriousnessRecord(active.student.id)
                        ?.missedSessions ?? 0) > 2
                        ? "ms-b-yellow"
                        : "ms-b-gr"
                    }`}
                  >
                    {(getSeriousnessRecord(active.student.id)
                      ?.missedSessions ?? 0) > 2
                      ? "Needs Attention"
                      : "Active"}
                  </span>
                  <span className={`ms-badge ${active.field.badge}`}>
                    {active.field.label}
                  </span>
                </div>
              </div>

              {/* Sub-tab bar */}
              <div className="ms-subtab-bar">
                <button
                  className={`ms-subtab${subTab === "growth" ? " active" : ""}`}
                  onClick={() => setSubTab("growth")}
                >
                  <TrendingUp size={13} /> Growth
                </button>
                <button
                  className={`ms-subtab${subTab === "serious" ? " active" : ""}`}
                  onClick={() => setSubTab("serious")}
                >
                  <Info size={13} /> Seriousness
                </button>
                <button
                  className={`ms-subtab${subTab === "support" ? " active" : ""}`}
                  onClick={() => setSubTab("support")}
                >
                  <Heart size={13} /> Support
                </button>
              </div>

              {/* Sub-tab content */}
              {subTab === "growth" && (
                <GrowthPanel
                  studentId={active.student.id}
                  studentName={active.student.name}
                  mentorId={mentor.id}
                  growth={getGrowthRecord(active.student.id)}
                  onChangeRating={(skill, value) =>
                    updateGrowthRating(active.student.id, mentor.id, skill, value)
                  }
                  onSaveNote={(note) =>
                    updateGrowthNote(active.student.id, mentor.id, note)
                  }
                />
              )}

              {subTab === "serious" && (
                <SeriousnessPanel
                  studentName={active.student.name}
                  needsAttention={
                    (getSeriousnessRecord(active.student.id)?.missedSessions ??
                      0) > 2
                  }
                  record={getSeriousnessRecord(active.student.id)}
                />
              )}

              {subTab === "support" && (
                <SupportPanel
                  studentId={active.student.id}
                  studentName={active.student.name}
                  fieldLabel={active.field.label}
                  requests={getStudentSupportRequests(active.student.id)}
                  supportProgram={supportProgram}
                  supportNote={supportNote}
                  onProgramChange={setSupportProgram}
                  onNoteChange={setSupportNote}
                  onSubmit={() => {
                    if (supportProgram && supportNote) {
                      markStudentNeedsSupport(
                        active.student.id,
                        supportProgram,
                        supportNote
                      );
                      setSupportProgram("");
                      setSupportNote("");
                    }
                  }}
                />
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}

/* ── Growth panel ── */

interface GrowthPanelProps {
  studentId: string;
  studentName: string;
  mentorId: string;
  growth: ReturnType<typeof useAppData>["growthRecords"][number] | undefined;
  onChangeRating: (skill: string, value: number) => void;
  onSaveNote: (note: string) => void;
}

function GrowthPanel({
  studentName,
  growth,
  onChangeRating,
  onSaveNote,
}: GrowthPanelProps) {
  const [noteDraft, setNoteDraft] = useState(growth?.notes ?? "");

  useEffect(() => {
    setNoteDraft(growth?.notes ?? "");
  }, [growth?.studentId, growth?.notes]);

  return (
    <article className="mentor-shell-card mentor-shell-card-p">
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--sf-ch)",
          marginBottom: 18,
        }}
      >
        Skill Ratings — {studentName}
      </p>

      {SKILL_KEYS.map((skill) => {
        const current = growth?.ratings[skill] ?? 5;
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
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={current}
              onChange={(e) => onChangeRating(skill, Number(e.target.value))}
              style={{ width: "100%", marginTop: 8, accentColor: "#e07847" }}
              aria-label={`Adjust ${SKILL_LABELS[skill]} rating`}
            />
          </div>
        );
      })}

      <div
        style={{
          height: 1,
          background: "rgba(0,0,0,.08)",
          margin: "20px 0",
        }}
      />

      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--sf-ch)",
          marginBottom: 10,
        }}
      >
        Mentor Notes
      </p>
      <textarea
        className="ms-ins-textarea"
        value={noteDraft}
        onChange={(e) => setNoteDraft(e.target.value)}
        onBlur={() => onSaveNote(noteDraft)}
        placeholder="Write a note about this student's progress…"
      />
    </article>
  );
}

/* ── Seriousness panel ── */

interface SeriousnessPanelProps {
  studentName: string;
  needsAttention: boolean;
  record: ReturnType<typeof useAppData>["seriousnessRecords"][number] | undefined;
}

function SeriousnessPanel({
  studentName,
  needsAttention,
  record,
}: SeriousnessPanelProps) {
  if (!record) {
    return (
      <article className="mentor-shell-card mentor-shell-card-p">
        <p style={{ fontSize: 14, color: "var(--sf-mt)" }}>
          No seriousness data available.
        </p>
      </article>
    );
  }

  const submitted = Math.round(record.consistencyScore * 0.2);
  const goalsTotal = 5;
  const goalsAchieved = Math.round((record.consistencyScore / 100) * goalsTotal);

  return (
    <article className="mentor-shell-card mentor-shell-card-p">
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 18 }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--sf-ch)" }}>
          {studentName}
        </span>
        <span
          className={`ms-badge ${
            needsAttention ? "ms-b-yellow" : "ms-b-gr"
          }`}
        >
          {needsAttention ? "Needs Attention" : "Active"}
        </span>
      </div>

      <MetricRow
        label="Consistency Score"
        bar={record.consistencyScore}
        barClass="ms-bar-sf"
        valueColor="var(--sf-sf)"
        valueText={`${record.consistencyScore}%`}
      />
      <MetricRow
        label="Attendance Rate"
        bar={record.attendanceRate}
        barClass="ms-bar-sf"
        valueText={`${record.attendanceRate}%`}
      />
      <MetricRow
        label="Assignments Submitted"
        bar={Math.round((submitted / 20) * 100)}
        barClass="ms-bar-gr"
        valueText={`${submitted} / 20`}
      />
      <MetricRow
        label="Missed Sessions"
        valueText={String(record.missedSessions)}
        valueColor={record.missedSessions > 2 ? "#dc2626" : undefined}
      />
      <MetricRow
        label="Goals Achieved"
        valueColor="var(--sf-gr)"
        valueText={`${goalsAchieved} of ${goalsTotal} ✓`}
      />
      <MetricRow
        label="Last Active"
        valueText={
          record.lastActiveDaysAgo === 0
            ? "Today"
            : record.lastActiveDaysAgo === 1
            ? "Yesterday"
            : `${record.lastActiveDaysAgo} days ago`
        }
        isLast
      />
    </article>
  );
}

interface MetricRowProps {
  label: string;
  bar?: number;
  barClass?: string;
  valueText: string;
  valueColor?: string;
  isLast?: boolean;
}

function MetricRow({
  label,
  bar,
  barClass = "ms-bar-sf",
  valueText,
  valueColor,
  isLast,
}: MetricRowProps) {
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
          <div style={{ width: 180 }}>
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
          {valueText}
        </span>
      </div>
    </div>
  );
}

/* ── Support panel ── */

interface SupportPanelProps {
  studentId: string;
  studentName: string;
  fieldLabel: string;
  requests: ReturnType<typeof useAppData>["supportRequests"];
  supportProgram: string;
  supportNote: string;
  onProgramChange: (v: string) => void;
  onNoteChange: (v: string) => void;
  onSubmit: () => void;
}

function SupportPanel({
  fieldLabel,
  requests,
  supportProgram,
  supportNote,
  onProgramChange,
  onNoteChange,
  onSubmit,
}: SupportPanelProps) {
  return (
    <article className="mentor-shell-card mentor-shell-card-p">
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--sf-ch)",
          marginBottom: 14,
        }}
      >
        Existing Requests
      </p>
      {requests.length === 0 ? (
        <div
          className="text-center"
          style={{
            background: "var(--sf-cream)",
            borderRadius: 10,
            padding: 14,
            fontSize: 13,
            color: "var(--sf-mt)",
          }}
        >
          No support requests yet
        </div>
      ) : (
        requests.map((r, i) => {
          const prog = supportPrograms.find((p) => p.id === r.programId);
          return (
            <div
              key={r.id}
              className="flex items-center justify-between"
              style={{
                padding: "13px 16px",
                background: "var(--sf-cream)",
                borderRadius: 10,
                marginBottom: i === requests.length - 1 ? 0 : 8,
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
                  {prog?.type ?? r.programId}
                </p>
                {r.mentorNote && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--sf-mt)",
                      marginTop: 2,
                    }}
                  >
                    {r.mentorNote}
                  </p>
                )}
              </div>
              <span className={`ms-badge ${supportStatusBadge(r.status)}`}>
                {r.status}
              </span>
            </div>
          );
        })
      )}

      <div
        style={{
          height: 1,
          background: "rgba(0,0,0,.08)",
          margin: "18px 0",
        }}
      />

      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--sf-ch)",
          marginBottom: 14,
        }}
      >
        Flag for Support
      </p>

      <div className="flex flex-col" style={{ gap: 10 }}>
        <select
          className="ms-flag-select"
          value={supportProgram}
          onChange={(e) => onProgramChange(e.target.value)}
        >
          <option value="">Select support type…</option>
          {supportPrograms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.type} — ₹{p.amount}
            </option>
          ))}
        </select>
        <input
          className="ms-flag-input"
          value={supportNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder={`Add a note (e.g. ${
            fieldLabel === "Sports"
              ? "Needs cricket academy fee support"
              : "Needs Python textbook for next month"
          })`}
        />
        <button
          type="button"
          className="ms-btn ms-btn-primary ms-btn-sm"
          style={{ alignSelf: "flex-start" }}
          disabled={!supportProgram || !supportNote}
          onClick={onSubmit}
        >
          Mark as Needs Support
        </button>
      </div>
    </article>
  );
}
