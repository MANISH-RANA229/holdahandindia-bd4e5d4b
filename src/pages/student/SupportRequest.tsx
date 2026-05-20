/**
 * SupportRequest — Spec 06 redesign.
 * Two-column layout: existing requests + how it works on the left,
 * available program cards grid on the right.
 */
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { supportPrograms, SupportProgram } from "@/data/supportPrograms";
import { Student } from "@/data/types";

// Additional programs from the spec (Device Support + Internet Recharge).
const EXTRA_PROGRAMS: SupportProgram[] = [
  { id: "sp5", type: "Device Support",   description: "Get a tablet or smartphone to support your online learning", amount: 1500 },
  { id: "sp6", type: "Internet Recharge", description: "Monthly data recharge to stay connected with your mentor",  amount: 200 },
];

const PROGRAM_EMOJI: Record<string, string> = {
  sp1: "♥",
  sp2: "📚",
  sp3: "🏋️",
  sp4: "📝",
  sp5: "💻",
  sp6: "📶",
};

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

export default function SupportRequest() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getStudentSupportRequests, addSupportRequest } = useAppData();
  const student = user as Student;
  const requests = getStudentSupportRequests(student.id);
  const requestedIds = new Set(requests.map((r) => r.programId));

  const allPrograms: SupportProgram[] = [...supportPrograms, ...EXTRA_PROGRAMS];

  const handleRequest = (programId: string, type: string) => {
    if (requestedIds.has(programId)) return;
    addSupportRequest(student.id, programId);
    toast({
      title: "Request sent",
      description: `${type} request submitted to your mentor.`,
    });
  };

  return (
    <>
      <header style={{ marginBottom: 22 }}>
        <h2
          className="font-serif-display"
          style={{ fontSize: 30, color: "var(--sf-ch)", marginBottom: 4 }}
        >
          Support Requests
        </h2>
        <p style={{ fontSize: 13, color: "var(--sf-mt)" }}>
          Request support for your learning journey
        </p>
      </header>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.6fr)",
          gap: 18,
        }}
      >
        {/* Left column */}
        <div className="flex flex-col" style={{ gap: 16 }}>
          <article className="mentor-shell-card mentor-shell-card-p">
            <p className="ms-section-title">Your Requests</p>
            {requests.length === 0 ? (
              <p
                className="text-center"
                style={{
                  background: "var(--sf-cream)",
                  borderRadius: 11,
                  padding: 14,
                  fontSize: 13,
                  color: "var(--sf-mt)",
                }}
              >
                You haven't requested support yet.
              </p>
            ) : (
              requests.map((r, i) => {
                const prog = allPrograms.find((p) => p.id === r.programId);
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between"
                    style={{
                      padding: "14px 18px",
                      background: "var(--sf-cream)",
                      borderRadius: 11,
                      marginBottom: i === requests.length - 1 ? 0 : 10,
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
                      <p style={{ fontSize: 11, color: "var(--sf-mt)", marginTop: 2 }}>
                        {prog?.description}
                      </p>
                    </div>
                    <span className={`ms-badge ${statusBadgeClass(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                );
              })
            )}
          </article>

          <article className="mentor-shell-card mentor-shell-card-p">
            <p className="ms-section-title">How It Works</p>
            {[
              "Browse available support programs",
              "Click \"Request Support\" on any program",
              "Your mentor will review and submit the request to donors",
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-start"
                style={{ gap: 10, marginBottom: i === 2 ? 0 : 12 }}
              >
                <span
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "#fdf0e8",
                    color: "var(--sf-sf)",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </span>
                <p style={{ fontSize: 13, color: "var(--sf-mt)", lineHeight: 1.5 }}>
                  {step}
                </p>
              </div>
            ))}
          </article>
        </div>

        {/* Right column */}
        <div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--sf-ch)",
              marginBottom: 16,
            }}
          >
            Available Support Programs
          </p>
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {allPrograms.map((p) => {
              const requested = requestedIds.has(p.id);
              return (
                <article key={p.id} className="ms-spc">
                  <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: 14 }}
                  >
                    <span
                      className="flex items-center justify-center"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: "#fdf0e8",
                        fontSize: 18,
                      }}
                    >
                      {PROGRAM_EMOJI[p.id] ?? "♥"}
                    </span>
                    <p
                      className="font-serif-display"
                      style={{ fontSize: 20, color: "var(--sf-sf)" }}
                    >
                      ₹{p.amount.toLocaleString()}
                    </p>
                  </div>

                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--sf-ch)",
                      marginBottom: 5,
                    }}
                  >
                    {p.type}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--sf-mt)",
                      lineHeight: 1.5,
                      marginBottom: 16,
                    }}
                  >
                    {p.description}
                  </p>

                  <button
                    type="button"
                    className={`ms-spc-btn ${
                      requested ? "ms-spc-btn-req" : "ms-spc-btn-active"
                    }`}
                    disabled={requested}
                    onClick={() => handleRequest(p.id, p.type)}
                  >
                    {requested ? "Requested" : "Request Support"}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
