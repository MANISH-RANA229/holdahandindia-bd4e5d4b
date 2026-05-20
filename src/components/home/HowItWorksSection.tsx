/**
 * HowItWorksSection — 4 numbered step circles connected by a dashed saffron line.
 */
import { howItWorks } from "./homeData";

export function HowItWorksSection() {
  return (
    <section id="how" className="bg-sf-cream" style={{ padding: "100px 0" }}>
      <div className="mx-auto" style={{ maxWidth: 1200, padding: "0 48px" }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 60 }}>
          <p
            className="text-sf-sf inline-block"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Simple Process
          </p>
          <h2
            className="font-serif-display text-sf-ch"
            style={{ fontSize: 48, lineHeight: 1.12, marginBottom: 14 }}
          >
            How it works
          </h2>
        </div>

        {/* Steps grid with connecting dashed line */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative"
          style={{ gap: 0 }}
        >
          {/* Dashed connector line (desktop only) */}
          <div
            className="hidden lg:block absolute"
            style={{
              top: 34,
              left: "calc(12.5% + 8px)",
              right: "calc(12.5% + 8px)",
              height: 2,
              background:
                "repeating-linear-gradient(to right, var(--sf-sf) 0 8px, transparent 8px 16px)",
              opacity: 0.35,
              pointerEvents: "none",
            }}
          />

          {howItWorks.map((item) => (
            <div
              key={item.step}
              className="how-step text-center relative"
              style={{ padding: "0 28px", marginBottom: 32 }}
            >
              <div
                className="how-num mx-auto flex items-center justify-center font-serif-display"
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background: "var(--sf-w)",
                  color: "var(--sf-sf)",
                  border: "2px solid var(--sf-sf)",
                  fontSize: 22,
                  marginBottom: 24,
                  boxShadow: "0 4px 16px rgba(224,120,71,.18)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {item.step}
              </div>
              <h3
                className="text-sf-ch"
                style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}
              >
                {item.title}
              </h3>
              <p
                className="text-sf-mt"
                style={{ fontSize: 14, lineHeight: 1.7 }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
