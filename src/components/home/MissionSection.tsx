/**
 * MissionSection — full-bleed split: photo on the left, forest-green text panel on the right.
 */
import mentorImg from "@/assets/mentor-teaching.jpg";

const checklist = [
  "Free mentorship for every student",
  "Trained mentors from diverse fields",
  "Progress tracking and accountability",
];

export function MissionSection() {
  return (
    <section id="mission" className="grid grid-cols-1 md:grid-cols-2">
      {/* Left: image */}
      <div style={{ height: 560 }}>
        <img
          src={mentorImg}
          alt="A mentor teaching a student"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Right: green text panel */}
      <div
        className="bg-sf-gr flex flex-col justify-center"
        style={{ padding: "80px clamp(32px, 6vw, 80px)" }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,.55)",
            marginBottom: 18,
          }}
        >
          Our Mission
        </p>

        <h2
          className="font-serif-display text-white"
          style={{ fontSize: 48, lineHeight: 1.12, marginBottom: 22 }}
        >
          Direction changes everything
        </h2>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.85,
            color: "rgba(255,255,255,.72)",
            marginBottom: 10,
          }}
        >
          Most underprivileged students don't lack talent — they lack direction.
          A single conversation with the right mentor can spark a lifetime of
          ambition.
        </p>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.85,
            color: "rgba(255,255,255,.55)",
            marginBottom: 30,
          }}
        >
          We make those conversations happen, consistently and at scale.
        </p>

        {/* Checklist */}
        <div className="flex flex-col" style={{ gap: 14 }}>
          {checklist.map((item) => (
            <div key={item} className="flex items-start" style={{ gap: 14 }}>
              <div
                className="bg-sf-sf flex items-center justify-center flex-shrink-0"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  marginTop: 2,
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "white",
                  lineHeight: 1.5,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
