/**
 * SupportSection — 4 pricing-tier cards. 3rd card is the featured (forest-green) variant.
 */
import { Link } from "react-router-dom";
import { supportTiers } from "./homeData";

export function SupportSection() {
  return (
    <section id="support" className="bg-sf-cream" style={{ padding: "100px 0" }}>
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
            Make a Difference
          </p>
          <h2
            className="font-serif-display text-sf-ch"
            style={{ fontSize: 48, lineHeight: 1.12, marginBottom: 14 }}
          >
            Support Our Students
          </h2>
          <p
            className="text-sf-mt mx-auto"
            style={{ fontSize: 17, lineHeight: 1.65, maxWidth: 500 }}
          >
            Every contribution directly impacts a student's journey. Choose how
            you'd like to help.
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start"
          style={{ gap: 22 }}
        >
          {supportTiers.map((tier) => {
            const featured = !!tier.featured;
            const cardBg = featured ? "var(--sf-gr)" : "var(--sf-w)";
            const titleColor = featured ? "#fff" : "var(--sf-ch)";
            const priceColor = featured ? "#fbbf24" : "var(--sf-sf)";
            const priceSubColor = featured
              ? "rgba(255,255,255,.6)"
              : "var(--sf-mt)";
            const featureColor = featured
              ? "rgba(255,255,255,.75)"
              : "var(--sf-mt)";
            const checkColor = featured ? "#fbbf24" : "var(--sf-sf)";
            const dividerBg = featured
              ? "rgba(255,255,255,.15)"
              : "var(--sf-bd)";
            const badgeBg = featured
              ? "rgba(255,255,255,.2)"
              : "var(--sf-sfl)";
            const badgeColor = featured ? "#fff" : "var(--sf-sf)";

            return (
              <div
                key={tier.title}
                className="hover-support"
                style={{
                  background: cardBg,
                  borderRadius: 22,
                  padding: "36px 28px",
                  boxShadow: "var(--sf-shadow-sm)",
                }}
              >
                <span
                  className="inline-block"
                  style={{
                    background: badgeBg,
                    color: badgeColor,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 999,
                    marginBottom: 20,
                  }}
                >
                  {tier.badge}
                </span>

                <div style={{ fontSize: 32, marginBottom: 16 }}>
                  {tier.emoji}
                </div>

                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: titleColor,
                    marginBottom: 10,
                  }}
                >
                  {tier.title}
                </h3>

                <p
                  className="font-serif-display"
                  style={{
                    fontSize: 40,
                    lineHeight: 1,
                    color: priceColor,
                    marginBottom: 6,
                  }}
                >
                  {tier.price}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: priceSubColor,
                    marginBottom: 22,
                  }}
                >
                  {tier.priceSub}
                </p>

                <div
                  style={{
                    height: 1,
                    background: dividerBg,
                    marginBottom: 22,
                  }}
                />

                <ul
                  className="flex flex-col"
                  style={{ gap: 10, marginBottom: 24, listStyle: "none", padding: 0 }}
                >
                  {tier.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start"
                      style={{ gap: 10, fontSize: 14, lineHeight: 1.5, color: featureColor }}
                    >
                      <span
                        style={{
                          color: checkColor,
                          fontSize: 13,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className={featured ? "btn-cream" : "btn-sf"}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "14px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  {tier.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
