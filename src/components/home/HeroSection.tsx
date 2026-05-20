/**
 * HeroSection — full-bleed hero with green-gradient overlay over a classroom photo.
 */
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-children-studying.jpg";

const trustAvatars = ["#1b5c3d", "#2d6a4f", "#3a5f3a", "#4a6741"];

export function HeroSection() {
  return (
    <section className="relative" style={{ minHeight: 680 }}>
      {/* Background image + saffron-green overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Children studying together in a classroom"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(27,92,61,.92) 0%, rgba(27,92,61,.78) 38%, rgba(27,92,61,.35) 68%, transparent 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 mx-auto"
        style={{ maxWidth: 1200, padding: "96px 48px" }}
      >
        <div style={{ maxWidth: 640 }}>
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2"
            style={{
              background: "rgba(255,255,255,.15)",
              border: "1px solid rgba(255,255,255,.28)",
              borderRadius: 999,
              padding: "7px 16px",
              marginBottom: 32,
              color: "white",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.4px",
            }}
          >
            <span>♥</span>
            A non-profit mentorship initiative
          </div>

          {/* H1 */}
          <h1
            className="font-serif-display text-white"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.04,
              letterSpacing: "-0.5px",
              marginBottom: 26,
            }}
          >
            Every child deserves{" "}
            <em
              style={{
                color: "#fbbf24",
                fontStyle: "italic",
                fontFamily: "'DM Serif Display', serif",
              }}
            >
              a guiding hand
            </em>
          </h1>

          {/* Sub */}
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.75,
              color: "rgba(255,255,255,.78)",
              maxWidth: 480,
              marginBottom: 42,
            }}
          >
            We connect successful mentors with underprivileged students,
            providing direction in studies, sports, and business — completely
            free of cost.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap" style={{ gap: 14 }}>
            <Link
              to="/signup"
              className="btn-sf inline-flex items-center"
              style={{
                fontSize: 16,
                fontWeight: 600,
                padding: "16px 36px",
                borderRadius: 12,
              }}
            >
              Join the Mission
              <span style={{ marginLeft: 8 }}>→</span>
            </Link>
            <Link
              to="/login"
              className="btn-ghost-dark inline-flex items-center"
              style={{
                fontSize: 16,
                fontWeight: 600,
                padding: "16px 36px",
                borderRadius: 12,
              }}
            >
              I have an account
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex items-center" style={{ marginTop: 40, gap: 14 }}>
            <div className="flex">
              {trustAvatars.map((bg, i) => (
                <div
                  key={i}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: bg,
                    border: "2px solid rgba(255,255,255,.5)",
                    marginLeft: i === 0 ? 0 : -10,
                  }}
                />
              ))}
            </div>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.5,
                color: "rgba(255,255,255,.65)",
              }}
            >
              <strong style={{ color: "rgba(255,255,255,.9)" }}>500+ students</strong>
              {" "}already finding their way
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
