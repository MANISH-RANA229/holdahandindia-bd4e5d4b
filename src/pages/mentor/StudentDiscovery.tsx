/**
 * StudentDiscovery — Spec 03 redesign.
 * Saffron-themed page with search + field-filter pills and a 3-col student card grid.
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/data/types";

type FieldFilter = "all" | "study" | "sports" | "business";

const FIELD_PILLS: { id: FieldFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "study", label: "Study" },
  { id: "sports", label: "Sports" },
  { id: "business", label: "Business" },
];

const AVATAR_CYCLE = [
  "ms-av-sf",
  "ms-av-gr",
  "ms-av-amber",
  "ms-av-indigo",
  "ms-av-teal",
  "ms-av-red",
];

/** Map first interest to a field bucket so we can show a matching pill on the card. */
function inferField(s: Student): FieldFilter {
  const blob = (s.interests.join(" ") + " " + (s.goals ?? "")).toLowerCase();
  if (/(cricket|sport|athlet|fitness|swim|yoga)/.test(blob)) return "sports";
  if (/(business|startup|market|enterprise|public speaking|economics)/.test(blob)) return "business";
  return "study";
}

function fieldBadgeClass(field: FieldFilter): string {
  if (field === "study") return "ms-b-blue";
  if (field === "sports") return "ms-b-gr";
  return "ms-b-sf";
}

function fieldBadgeLabel(field: FieldFilter): string {
  return field.charAt(0).toUpperCase() + field.slice(1);
}

/** Stable pseudo-random match score for demo display, derived from student id. */
function matchScoreFor(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return 75 + (hash % 21); // 75–95
}

export default function StudentDiscovery() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { students, selectStudent, unselectStudent, isStudentSelected } = useAppData();
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [activeField, setActiveField] = useState<FieldFilter>("all");

  const decorated = useMemo(() => {
    return students.map((s, i) => {
      const field = inferField(s);
      return {
        student: s,
        field,
        avatarClass: AVATAR_CYCLE[i % AVATAR_CYCLE.length],
        match: matchScoreFor(s.id),
      };
    });
  }, [students]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return decorated.filter(({ student, field }) => {
      if (activeField !== "all" && field !== activeField) return false;
      if (!q) return true;
      const haystack = (
        student.name +
        " " +
        student.goals +
        " " +
        student.interests.join(" ")
      ).toLowerCase();
      return haystack.includes(q);
    });
  }, [decorated, query, activeField]);

  return (
    <>
      <header style={{ marginBottom: 20 }}>
        <h2
          className="font-serif-display"
          style={{ fontSize: 30, color: "var(--sf-ch)", marginBottom: 4 }}
        >
          Discover Students
        </h2>
        <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>
          Browse profiles and select students you'd like to mentor
        </p>
      </header>

      {/* Filter bar */}
      <div
        className="flex items-center flex-wrap mentor-shell-card"
        style={{
          gap: 12,
          padding: "14px 18px",
          borderRadius: 14,
          marginBottom: 20,
        }}
      >
        <div className="relative" style={{ flex: 1, minWidth: 220 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--sf-mtl)",
              pointerEvents: "none",
            }}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, interest, or goal…"
            className="ms-search-input"
          />
        </div>

        <div className="flex" style={{ gap: 6 }}>
          {FIELD_PILLS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveField(p.id)}
              className={`ms-fpill${activeField === p.id ? " active" : ""}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p
          className="text-center"
          style={{
            fontSize: 14,
            color: "var(--sf-mtl)",
            padding: 40,
          }}
        >
          No students match this filter.
        </p>
      ) : (
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {filtered.map(({ student: s, field, avatarClass, match }) => {
            const selected = isStudentSelected(user!.id, s.id);
            return (
              <article key={s.id} className="ms-sc" data-field={field}>
                {/* Header row */}
                <div className="flex items-start" style={{ gap: 11 }}>
                  <div className={`ms-avatar ms-av-md ${avatarClass}`}>
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
                      style={{ gap: 7, marginBottom: 3 }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "var(--sf-ch)",
                        }}
                      >
                        {s.name}
                      </span>
                      <span className="ms-badge ms-b-age">{s.age} yrs</span>
                      <span className={`ms-badge ${fieldBadgeClass(field)}`}>
                        {fieldBadgeLabel(field)}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--sf-mt)",
                        lineHeight: 1.5,
                      }}
                    >
                      {s.goals}
                    </p>
                  </div>
                </div>

                {/* Interests */}
                <div className="ms-chips">
                  {s.interests.map((it) => (
                    <span key={it} className="ms-chip">
                      {it}
                    </span>
                  ))}
                </div>

                {/* Background snippet */}
                {s.background && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--sf-mtl)",
                      fontStyle: "italic",
                      lineHeight: 1.5,
                    }}
                  >
                    {s.background}
                  </p>
                )}

                {/* Footer */}
                <div
                  className="flex flex-col"
                  style={{
                    gap: 9,
                    paddingTop: 12,
                    borderTop: "1px solid var(--sf-bd)",
                  }}
                >
                  <span
                    className="ms-badge"
                    style={{
                      background: "var(--sf-grl)",
                      color: "var(--sf-gr)",
                      fontWeight: 700,
                      alignSelf: "flex-start",
                    }}
                  >
                    ⭐ {match}% Match Score
                  </span>
                  {selected ? (
                    <button
                      type="button"
                      className="ms-btn ms-btn-outline"
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => {
                        unselectStudent(user!.id, s.id);
                        toast({
                          title: "Student removed",
                          description: `${s.name} removed from your list.`,
                        });
                      }}
                    >
                      <Check size={14} />
                      Selected
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="ms-btn ms-btn-primary"
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => {
                        selectStudent(user!.id, s.id);
                        toast({
                          title: "Student selected",
                          description: `${s.name} added to your mentorship list.`,
                        });
                        navigate("/mentor/selected");
                      }}
                    >
                      <UserPlus size={14} />
                      Select for Mentorship
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
