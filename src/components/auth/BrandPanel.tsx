/**
 * BrandPanel — forest-green left panel shared by Login & Signup.
 * Variant "login" shows brand image + testimonial; "signup" shows role benefit cards.
 */
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import mentorImg from "@/assets/mentor-teaching.jpg";

interface Stat {
  value: string;
  label: string;
}

interface BrandPanelProps {
  /** Headline shown after the logo */
  headlineLead: string;
  /** Italic golden word inside the headline */
  headlineAccent: string;
  /** Headline tail (optional, e.g. " story") */
  headlineTail?: string;
  /** Body copy under the headline */
  sub: string;
  /** Middle content slot (image + quote on login, role cards on signup) */
  middle: ReactNode;
  /** Stats strip shown above the back link */
  stats?: Stat[];
}

export function BrandPanel({
  headlineLead,
  headlineAccent,
  headlineTail,
  sub,
  middle,
  stats,
}: BrandPanelProps) {
  return (
    <aside
      className="bg-sf-gr relative overflow-hidden hidden md:flex flex-col"
      style={{ padding: "40px 48px", minHeight: "100vh" }}
    >
      {/* Decorative circles */}
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: "rgba(255,255,255,.04)",
          top: -160,
          right: -180,
          zIndex: 0,
        }}
      />
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(255,255,255,.03)",
          bottom: -80,
          left: -100,
          zIndex: 0,
        }}
      />

      {/* Top: logo */}
      <div className="relative" style={{ zIndex: 2 }}>
        <Link to="/" className="flex items-center" style={{ gap: 10 }}>
          <div
            className="flex items-center justify-center text-white"
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "rgba(255,255,255,.15)",
              border: "1px solid rgba(255,255,255,.2)",
              fontSize: 18,
            }}
          >
            ♥
          </div>
          <span
            className="font-serif-display text-white"
            style={{ fontSize: 17 }}
          >
            Hold A Hand India
          </span>
        </Link>
      </div>

      {/* Middle: headline + body + custom content */}
      <div
        className="relative flex-1 flex flex-col justify-center"
        style={{ zIndex: 2, paddingTop: 28, paddingBottom: 28 }}
      >
        <h1
          className="font-serif-display text-white"
          style={{
            fontSize: 42,
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 360,
          }}
        >
          {headlineLead}{" "}
          <em
            style={{
              color: "#fbbf24",
              fontStyle: "italic",
              fontFamily: "'DM Serif Display', serif",
            }}
          >
            {headlineAccent}
          </em>
          {headlineTail}
        </h1>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: "rgba(255,255,255,.65)",
            maxWidth: 320,
            marginBottom: 28,
          }}
        >
          {sub}
        </p>

        {middle}

        {stats && stats.length > 0 && (
          <div className="flex" style={{ gap: 16, marginTop: 28 }}>
            {stats.map((s) => (
              <div
                key={s.label}
                className="text-center"
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 12,
                  padding: "14px 16px",
                }}
              >
                <p
                  className="font-serif-display"
                  style={{ fontSize: 26, lineHeight: 1, color: "#fbbf24" }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,.5)",
                    marginTop: 5,
                    lineHeight: 1.3,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom: back link */}
      <div className="relative" style={{ zIndex: 2 }}>
        <Link
          to="/"
          className="inline-flex items-center"
          style={{
            gap: 6,
            fontSize: 13,
            color: "rgba(255,255,255,.5)",
            transition: "color .15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,.85)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,.5)")
          }
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>
      </div>
    </aside>
  );
}

/* ── Helper subcomponents (used by callers as `middle`) ── */

/** Brand image + testimonial quote card (login). */
export function BrandLoginMiddle() {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: 220,
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,.12)",
          overflow: "hidden",
          marginBottom: 28,
        }}
      >
        <img
          src={mentorImg}
          alt="A mentor teaching a student"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      </div>

      <div
        className="relative"
        style={{
          background: "rgba(255,255,255,.08)",
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 16,
          padding: "20px 22px",
        }}
      >
        <span
          aria-hidden
          className="font-serif-display absolute"
          style={{
            top: 10,
            right: 18,
            fontSize: 52,
            lineHeight: 1,
            color: "rgba(255,255,255,.1)",
          }}
        >
          "
        </span>

        <p
          style={{
            fontSize: 14,
            fontStyle: "italic",
            color: "rgba(255,255,255,.8)",
            lineHeight: 1.7,
            marginBottom: 14,
          }}
        >
          My mentor helped me believe I could become an engineer. The
          confidence I have now is something money can't buy.
        </p>

        <div className="flex items-center" style={{ gap: 10 }}>
          <div
            className="flex items-center justify-center text-white"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#1b5c3d",
              border: "2px solid rgba(255,255,255,.3)",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "white" }}>
              Anita Devi
            </p>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,.5)",
                marginTop: 2,
              }}
            >
              Age 16 · Study
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

interface RoleCard {
  emoji: string;
  title: string;
  desc: string;
}

const signupRoleCards: RoleCard[] = [
  {
    emoji: "🎓",
    title: "Students get direction",
    desc: "Personal mentors who guide your studies, sports, or business journey — free.",
  },
  {
    emoji: "🤝",
    title: "Mentors create impact",
    desc: "Share your experience with a student who needs your perspective most.",
  },
  {
    emoji: "💛",
    title: "Sponsors fuel growth",
    desc: "Directly fund books, training, and exam fees with full transparency.",
  },
];

/** Three role benefit cards (signup). */
export function BrandSignupMiddle() {
  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      {signupRoleCards.map((c) => (
        <div
          key={c.title}
          className="flex items-start"
          style={{
            gap: 14,
            background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 14,
            padding: "16px 18px",
          }}
        >
          <span
            style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}
            aria-hidden
          >
            {c.emoji}
          </span>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "white",
                marginBottom: 4,
              }}
            >
              {c.title}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,.55)",
                lineHeight: 1.5,
              }}
            >
              {c.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
