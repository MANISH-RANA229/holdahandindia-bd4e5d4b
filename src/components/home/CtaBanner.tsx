/**
 * CtaBanner — forest-green full-width CTA with decorative background circles.
 */
import { Link } from "react-router-dom";

export function CtaBanner() {
  return (
    <section
      className="bg-sf-gr relative overflow-hidden"
      style={{ padding: "96px 0" }}
    >
      {/* Decorative circles */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(255,255,255,.04)",
          top: -200,
          right: -100,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,.03)",
          bottom: -150,
          left: -80,
        }}
      />

      <div
        className="mx-auto text-center relative"
        style={{ maxWidth: 1200, padding: "0 48px" }}
      >
        <h2
          className="font-serif-display text-white mx-auto"
          style={{
            fontSize: "clamp(36px, 5vw, 52px)",
            lineHeight: 1.2,
            marginBottom: 18,
          }}
        >
          Ready to change a life?
        </h2>
        <p
          className="mx-auto"
          style={{
            fontSize: 18,
            lineHeight: 1.7,
            color: "rgba(255,255,255,.7)",
            maxWidth: 520,
            marginBottom: 40,
          }}
        >
          Whether you're a mentor looking to guide or a student seeking
          direction — your journey starts here.
        </p>
        <div className="flex justify-center flex-wrap" style={{ gap: 14 }}>
          <Link
            to="/signup"
            className="btn-cream inline-flex items-center"
            style={{
              fontSize: 16,
              fontWeight: 600,
              padding: "16px 36px",
              borderRadius: 12,
            }}
          >
            Get Started Free
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
      </div>
    </section>
  );
}
