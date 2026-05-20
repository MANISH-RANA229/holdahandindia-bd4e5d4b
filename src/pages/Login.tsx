/**
 * Login page — split layout: forest-green brand panel + saffron-themed form.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/lib/validation";
import { BrandPanel, BrandLoginMiddle } from "@/components/auth/BrandPanel";

const stats = [
  { value: "500+", label: "Students" },
  { value: "120+", label: "Mentors" },
  { value: "85%",  label: "Success" },
];

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setIsLoading(true);
    try {
      const loggedInUser = await login(result.data.username, result.data.password);
      if (loggedInUser) {
        toast({ title: "Welcome back!", description: "Logged in successfully." });
        navigate(
          loggedInUser.role === "mentor" ? "/mentor/dashboard" : "/student/dashboard"
        );
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-sf-cream"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 44fr) minmax(0, 56fr)",
        minHeight: "100vh",
      }}
    >
      {/* Left: brand panel */}
      <BrandPanel
        headlineLead="Welcome back to the"
        headlineAccent="mission"
        sub="Log in to continue mentoring students or tracking your growth journey with a guide who understands you."
        middle={<BrandLoginMiddle />}
        stats={stats}
      />

      {/* Right: form */}
      <main
        className="bg-sf-w flex flex-col overflow-y-auto"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="flex-1 flex flex-col justify-center mx-auto w-full"
          style={{
            maxWidth: 520,
            padding: "56px clamp(24px, 6vw, 64px)",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <span className="sf-eyebrow">
              <span aria-hidden>♥</span> Log in
            </span>
            <h2
              className="font-serif-display"
              style={{
                fontSize: 38,
                lineHeight: 1.1,
                color: "#0f1f14",
                marginBottom: 10,
              }}
            >
              Welcome back
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--sf-mt)",
                lineHeight: 1.6,
              }}
            >
              Pick up where you left off — your mentor, sessions, and progress
              are waiting.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="username"
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 7,
                  letterSpacing: "0.1px",
                }}
              >
                Username
              </label>
              <input
                id="username"
                className="sf-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
                autoComplete="username"
              />
              {errors.username && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#dc2626",
                    marginTop: 5,
                  }}
                >
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: 7 }}
              >
                <label
                  htmlFor="password"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    letterSpacing: "0.1px",
                  }}
                >
                  Password
                </label>
                <Link
                  to="/login"
                  style={{
                    fontSize: 12,
                    color: "var(--sf-gr)",
                    fontWeight: 600,
                  }}
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  className="sf-input"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--sf-mtl)",
                    padding: 4,
                    display: "inline-flex",
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#dc2626",
                    marginTop: 5,
                  }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="sf-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>

            {/* Footer link */}
            <p
              className="text-center"
              style={{
                marginTop: 20,
                fontSize: 14,
                color: "var(--sf-mt)",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "var(--sf-gr)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                Sign up free
              </Link>
            </p>
          </form>

          {/* Demo credentials */}
          <div
            style={{
              marginTop: 48,
              background: "var(--sf-cream)",
              borderRadius: 14,
              border: "1px solid rgba(27,92,61,.1)",
              padding: 20,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--sf-mtl)",
                marginBottom: 12,
              }}
            >
              Quick access demo
            </p>
            <div className="flex" style={{ gap: 10 }}>
              <DemoCard
                role="mentor"
                title="👨‍🏫 Mentor"
                username="mentor1"
                password="demo123"
              />
              <DemoCard
                role="student"
                title="🎓 Student"
                username="student1"
                password="demo123"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

interface DemoCardProps {
  role: "mentor" | "student";
  title: string;
  username: string;
  password: string;
}

function DemoCard({ role, title, username, password }: DemoCardProps) {
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        border: "1px solid rgba(0,0,0,.08)",
        borderRadius: 10,
        padding: "12px 14px",
      }}
    >
      <p
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: role === "mentor" ? "var(--sf-gr)" : "var(--sf-sf)",
          marginBottom: 6,
        }}
      >
        {title}
      </p>
      <p style={{ fontSize: 12, color: "var(--sf-mt)", lineHeight: 1.7 }}>
        <code style={codeStyle}>{username}</code>
        {" / "}
        <code style={codeStyle}>{password}</code>
      </p>
    </div>
  );
}

const codeStyle: React.CSSProperties = {
  background: "#f3f4f6",
  padding: "1px 5px",
  borderRadius: 4,
  fontSize: 11,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};
