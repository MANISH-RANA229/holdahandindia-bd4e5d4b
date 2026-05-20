/**
 * HomeNavbar — sticky top navigation, Saffron India theme.
 * Cream background, forest-green logo, saffron pill CTA.
 */
import { Link } from "react-router-dom";

const navLinks = [
  { href: "#about",    label: "About" },
  { href: "#how",      label: "Our Programs" },
  { href: "#stories",  label: "Stories" },
  { href: "#support",  label: "Donate" },
];

export function HomeNavbar() {
  return (
    <nav className="bg-sf-cream border-b border-sf-bd sticky top-0 z-[100]">
      <div
        className="mx-auto flex items-center justify-between h-[70px]"
        style={{ maxWidth: 1200, padding: "0 48px" }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="w-[38px] h-[38px] rounded-[10px] bg-sf-gr flex items-center justify-center text-white"
            style={{ fontSize: 18 }}
          >
            ♥
          </div>
          <span
            className="font-serif-display text-sf-gr"
            style={{ fontSize: 19, letterSpacing: "0.2px" }}
          >
            Hold A Hand India
          </span>
        </Link>

        {/* Center links (desktop) */}
        <div className="hidden md:flex items-center" style={{ gap: 6 }}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sf-mt rounded-lg transition-colors duration-150 hover:text-sf-gr hover:bg-sf-grl"
              style={{ fontSize: 14, fontWeight: 500, padding: "8px 16px" }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center" style={{ gap: 8 }}>
          <Link
            to="/login"
            className="text-sf-mt rounded-lg transition-colors duration-150 hover:text-sf-gr hover:bg-sf-grl"
            style={{ fontSize: 14, fontWeight: 500, padding: "8px 16px" }}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="btn-sf text-white"
            style={{
              fontSize: 14,
              fontWeight: 600,
              padding: "10px 24px",
              borderRadius: 24,
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
