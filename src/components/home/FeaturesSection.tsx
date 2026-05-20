/**
 * FeaturesSection — "How we change lives" grid with saffron left-border cards.
 */
import { features } from "./homeData";

export function FeaturesSection() {
  return (
    <section id="about" className="bg-sf-cream" style={{ padding: "100px 0" }}>
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
            Our Approach
          </p>
          <h2
            className="font-serif-display text-sf-ch"
            style={{ fontSize: 48, lineHeight: 1.12, marginBottom: 14 }}
          >
            How we change lives
          </h2>
          <p
            className="text-sf-mt mx-auto"
            style={{ fontSize: 17, lineHeight: 1.65, maxWidth: 500 }}
          >
            A holistic mentorship model that goes beyond academics
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: 22 }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-sf-w hover-rise"
              style={{
                borderRadius: 20,
                padding: "36px 28px",
                boxShadow: "var(--sf-shadow-sm)",
                borderLeft: "4px solid var(--sf-sf)",
              }}
            >
              <div
                className="bg-sf-sfl flex items-center justify-center"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  fontSize: 24,
                  marginBottom: 22,
                }}
              >
                {f.emoji}
              </div>
              <h3
                className="text-sf-ch"
                style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}
              >
                {f.title}
              </h3>
              <p
                className="text-sf-mt"
                style={{ fontSize: 14, lineHeight: 1.75 }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
