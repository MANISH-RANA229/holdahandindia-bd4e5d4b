/**
 * ImpactStats — white horizontal stats bar with vertical dividers, sits below hero.
 */
import { stats } from "./homeData";

export function ImpactStats() {
  return (
    <section className="bg-sf-w border-b border-sf-bd">
      <div
        className="mx-auto grid grid-cols-2 md:grid-cols-4"
        style={{ maxWidth: 1200, padding: "0 48px" }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="text-center"
            style={{
              padding: "44px 0",
              borderRight: i < stats.length - 1 ? "1px solid var(--sf-bd)" : "none",
            }}
          >
            <div
              className="bg-sf-sfl mx-auto flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                fontSize: 20,
                marginBottom: 14,
              }}
            >
              {s.emoji}
            </div>
            <p
              className="font-serif-display text-sf-sf"
              style={{ fontSize: 52, lineHeight: 1 }}
            >
              {s.value}
            </p>
            <p
              className="text-sf-mt"
              style={{
                fontSize: 13,
                marginTop: 10,
                letterSpacing: "0.3px",
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
