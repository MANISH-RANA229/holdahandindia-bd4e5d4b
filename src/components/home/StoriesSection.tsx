/**
 * StoriesSection — testimonial cards on white bg with cream cards and field badges.
 */
import { stories } from "./homeData";

export function StoriesSection() {
  return (
    <section id="stories" className="bg-sf-w" style={{ padding: "100px 0" }}>
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
            Real Impact
          </p>
          <h2
            className="font-serif-display text-sf-ch"
            style={{ fontSize: 48, lineHeight: 1.12, marginBottom: 14 }}
          >
            Student Stories
          </h2>
          <p
            className="text-sf-mt mx-auto"
            style={{ fontSize: 17, lineHeight: 1.65, maxWidth: 500 }}
          >
            Hear from the students whose lives have been transformed
          </p>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 24 }}
        >
          {stories.map((s) => (
            <div
              key={s.name}
              className="bg-sf-cream hover-rise relative"
              style={{
                borderRadius: 22,
                padding: "36px 30px",
                boxShadow: "var(--sf-shadow-sm)",
              }}
            >
              {/* Quote mark */}
              <span
                className="font-serif-display absolute"
                style={{
                  top: 20,
                  right: 24,
                  fontSize: 72,
                  lineHeight: 1,
                  color: "rgba(224,120,71,0.1)",
                }}
              >
                "
              </span>

              {/* Field badge */}
              <span
                className="bg-sf-grl text-sf-gr absolute"
                style={{
                  top: 30,
                  left: 30,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.6px",
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                {s.field}
              </span>

              {/* Stars */}
              <div className="flex" style={{ gap: 3, marginTop: 36 }}>
                {Array.from({ length: s.rating }).map((_, i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="var(--sf-sf)"
                  >
                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-sf-mt"
                style={{
                  fontSize: 15,
                  fontStyle: "italic",
                  lineHeight: 1.8,
                  margin: "18px 0 24px",
                }}
              >
                "{s.quote}"
              </p>

              {/* Author row */}
              <div
                className="flex items-center"
                style={{
                  gap: 14,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(0,0,0,.07)",
                }}
              >
                <div
                  className="flex items-center justify-center text-white"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: s.avatarBg,
                    fontSize: 17,
                    fontWeight: 700,
                  }}
                >
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p
                    className="text-sf-ch"
                    style={{ fontSize: 14, fontWeight: 700 }}
                  >
                    {s.name}
                  </p>
                  <p
                    className="text-sf-mt"
                    style={{ fontSize: 12, marginTop: 3 }}
                  >
                    Age {s.age} · {s.field.charAt(0) + s.field.slice(1).toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
