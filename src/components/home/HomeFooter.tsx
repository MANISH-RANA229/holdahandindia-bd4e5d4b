/**
 * HomeFooter — dark forest green, 4-column layout with brand / programs / links / contact.
 */
import { Link } from "react-router-dom";

const programs = [
  { label: "Mentor Matching",    href: "#about" },
  { label: "Guided Learning",    href: "#about" },
  { label: "Growth Tracking",    href: "#about" },
  { label: "Community Support",  href: "#support" },
];

const quickLinks = [
  { label: "About Us",     href: "#about" },
  { label: "How It Works", href: "#how" },
  { label: "Stories",      href: "#stories" },
  { label: "Donate",       href: "#support" },
];

const contact = [
  { icon: "📍", text: "New Delhi, India" },
  { icon: "✉️", text: "hello@holdahandindia.org" },
  { icon: "📞", text: "+91 98XXX XXXXX" },
];

const socials = ["F", "T", "in", "Ig"];

export function HomeFooter() {
  return (
    <footer className="bg-sf-grd text-white" style={{ paddingTop: 72 }}>
      <div className="mx-auto" style={{ maxWidth: 1200, padding: "0 48px" }}>
        {/* Top grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{
            gap: 48,
            paddingBottom: 56,
            borderBottom: "1px solid rgba(255,255,255,.1)",
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: "span 1", maxWidth: 320 }}>
            <div className="flex items-center" style={{ gap: 10, marginBottom: 18 }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "rgba(255,255,255,.15)",
                  color: "white",
                  fontSize: 16,
                }}
              >
                ♥
              </div>
              <span
                className="font-serif-display"
                style={{ fontSize: 17, color: "white" }}
              >
                Hold A Hand India
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.75,
                color: "rgba(255,255,255,.5)",
                maxWidth: 280,
              }}
            >
              A non-profit mentorship initiative connecting India's brightest
              minds with students who need direction.
            </p>

            <div
              className="inline-flex items-center"
              style={{
                marginTop: 20,
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.12)",
                fontSize: 12,
                color: "rgba(255,255,255,.45)",
              }}
            >
              Registered NGO · 80G Approved
            </div>

            <div className="flex" style={{ gap: 10, marginTop: 22 }}>
              {socials.map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label="social link"
                  className="flex items-center justify-center transition-colors"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "rgba(255,255,255,.1)",
                    color: "rgba(255,255,255,.6)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--sf-sf)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,.6)";
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.5)",
                marginBottom: 18,
              }}
            >
              Programs
            </h4>
            <ul className="flex flex-col" style={{ gap: 12, listStyle: "none", padding: 0 }}>
              {programs.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,.55)",
                      transition: "color .15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,.55)")
                    }
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.5)",
                marginBottom: 18,
              }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col" style={{ gap: 12, listStyle: "none", padding: 0 }}>
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,.55)",
                      transition: "color .15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,.55)")
                    }
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.5)",
                marginBottom: 18,
              }}
            >
              Contact
            </h4>
            <ul className="flex flex-col" style={{ gap: 14, listStyle: "none", padding: 0 }}>
              {contact.map((c) => (
                <li
                  key={c.text}
                  className="flex items-start"
                  style={{
                    gap: 10,
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "rgba(255,255,255,.5)",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{c.icon}</span>
                  {c.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between"
          style={{ padding: "24px 0", gap: 12 }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.3)" }}>
            © 2026 Hold A Hand India. All rights reserved.
          </p>
          <div className="flex" style={{ gap: 22 }}>
            <Link
              to="/login"
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,.35)",
                transition: "color .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,.7)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,.35)")
              }
            >
              Privacy
            </Link>
            <Link
              to="/login"
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,.35)",
                transition: "color .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,.7)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,.35)")
              }
            >
              Terms
            </Link>
            <Link
              to="/signup"
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,.35)",
                transition: "color .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,.7)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,.35)")
              }
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
