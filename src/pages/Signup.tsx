/**
 * Signup page — split layout: forest-green brand panel + form with role cards.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/data/types";
import { mentorSignupSchema, studentSignupSchema } from "@/lib/validation";
import { BrandPanel, BrandSignupMiddle } from "@/components/auth/BrandPanel";

const stats = [
  { value: "2K+", label: "Sessions" },
  { value: "120+", label: "Mentors" },
  { value: "85%", label: "Success" },
];

const fieldErrText: React.CSSProperties = {
  fontSize: 12,
  color: "#dc2626",
  marginTop: 5,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 7,
  letterSpacing: "0.1px",
};

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "var(--sf-mtl)",
  marginBottom: 14,
  marginTop: 4,
};

export default function Signup() {
  const [role, setRole] = useState<UserRole | "">("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState("");
  const [goals, setGoals] = useState("");
  const [background, setBackground] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const selectRole = (next: UserRole) => {
    setRole(next);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setErrors({ role: "Please choose a role to continue" });
      return;
    }

    const raw =
      role === "mentor"
        ? { role, username, password, name, field, experience, bio }
        : { role, username, password, name, age, interests, goals, background };

    const schema = role === "mentor" ? mentorSignupSchema : studentSignupSchema;
    const result = schema.safeParse(raw);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const baseData = { username, password, name, role: role as UserRole };
    let userData: any;
    if (role === "mentor") {
      userData = {
        ...baseData,
        field,
        experience,
        bio,
        avatar: name.split(" ").map((w) => w[0]).join("").toUpperCase(),
        studentsGuided: 0,
        sessionsCompleted: 0,
      };
    } else {
      userData = {
        ...baseData,
        age: parseInt(age),
        interests: interests.split(",").map((s) => s.trim()),
        goals,
        background,
        avatar: name.split(" ").map((w) => w[0]).join("").toUpperCase(),
        assignedMentorId: null,
      };
    }

    setIsLoading(true);
    try {
      const createdUser = await signup(userData);
      if (createdUser) {
        toast({
          title: "Account created!",
          description: "Welcome to Hold A Hand India.",
        });
        navigate(
          createdUser.role === "mentor" ? "/mentor/dashboard" : "/student/dashboard"
        );
      } else {
        toast({
          title: "Signup failed",
          description: "Username already exists.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Signup failed",
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
        gridTemplateColumns: "minmax(0, 40fr) minmax(0, 60fr)",
        minHeight: "100vh",
      }}
    >
      {/* Left: brand panel */}
      <BrandPanel
        headlineLead="Start your"
        headlineAccent="story"
        headlineTail=" with us"
        sub="Join a community where every student finds direction and every mentor leaves a mark — completely free."
        middle={<BrandSignupMiddle />}
        stats={stats}
      />

      {/* Right: form */}
      <main
        className="bg-sf-w flex flex-col overflow-y-auto"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="flex-1 flex flex-col mx-auto w-full"
          style={{
            maxWidth: 580,
            padding: "48px clamp(24px, 6vw, 64px)",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <span className="sf-eyebrow">
              <span aria-hidden>♥</span> Create account
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
              Join the mission
            </h2>
            <p style={{ fontSize: 15, color: "var(--sf-mt)", lineHeight: 1.6 }}>
              It takes 2 minutes. Choose who you are and we'll set up the rest.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Role selector */}
            <p style={sectionLabel}>I am a…</p>
            <div
              className="grid grid-cols-1 sm:grid-cols-2"
              style={{ gap: 10, marginBottom: 24 }}
            >
              <RoleCard
                emoji="🎓"
                title="Student"
                desc="I want a mentor to guide my journey."
                selected={role === "student"}
                disabled={isLoading}
                onClick={() => selectRole("student")}
              />
              <RoleCard
                emoji="🤝"
                title="Mentor"
                desc="I want to share what I've learned."
                selected={role === "mentor"}
                disabled={isLoading}
                onClick={() => selectRole("mentor")}
              />
            </div>
            {errors.role && <p style={fieldErrText}>{errors.role}</p>}

            <div className="sf-divider">
              <span>Account details</span>
            </div>

            {/* Username + Password */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2"
              style={{ gap: 16, marginBottom: 20 }}
            >
              <div>
                <label htmlFor="username" style={labelStyle}>
                  Username
                </label>
                <input
                  id="username"
                  className="sf-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  maxLength={30}
                  required
                  disabled={isLoading}
                  autoComplete="username"
                />
                {errors.username && <p style={fieldErrText}>{errors.username}</p>}
              </div>
              <div>
                <label htmlFor="password" style={labelStyle}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    className="sf-input"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    maxLength={100}
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
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
                {errors.password && <p style={fieldErrText}>{errors.password}</p>}
              </div>
            </div>

            {/* Full name */}
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="name" style={labelStyle}>
                Full Name
              </label>
              <input
                id="name"
                className="sf-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                maxLength={60}
                required
                disabled={isLoading}
                autoComplete="name"
              />
              {errors.name && <p style={fieldErrText}>{errors.name}</p>}
            </div>

            {/* Mentor-only fields */}
            {role === "mentor" && (
              <>
                <div className="sf-divider">
                  <span>About you</span>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="field" style={labelStyle}>
                    Field
                  </label>
                  <select
                    id="field"
                    className="sf-input"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">Select a field</option>
                    <option value="study">Study</option>
                    <option value="sports">Sports</option>
                    <option value="business">Business</option>
                    <option value="arts">Arts</option>
                  </select>
                  {errors.field && <p style={fieldErrText}>{errors.field}</p>}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="experience" style={labelStyle}>
                    Experience
                  </label>
                  <input
                    id="experience"
                    className="sf-input"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 5 years in tech"
                    maxLength={200}
                    disabled={isLoading}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="bio" style={labelStyle}>
                    Short Bio
                  </label>
                  <textarea
                    id="bio"
                    className="sf-input"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell students about yourself..."
                    rows={3}
                    maxLength={500}
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {/* Student-only fields */}
            {role === "student" && (
              <>
                <div className="sf-divider">
                  <span>About you</span>
                </div>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2"
                  style={{ gap: 16, marginBottom: 20 }}
                >
                  <div>
                    <label htmlFor="age" style={labelStyle}>
                      Age
                    </label>
                    <input
                      id="age"
                      className="sf-input"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Your age"
                      min={5}
                      max={25}
                      disabled={isLoading}
                    />
                    {errors.age && <p style={fieldErrText}>{errors.age}</p>}
                  </div>
                  <div>
                    <label htmlFor="interests" style={labelStyle}>
                      Interests
                    </label>
                    <input
                      id="interests"
                      className="sf-input"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="Math, Cricket, Art..."
                      maxLength={200}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="goals" style={labelStyle}>
                    Goals
                  </label>
                  <textarea
                    id="goals"
                    className="sf-input"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="What do you want to achieve?"
                    rows={3}
                    maxLength={500}
                    disabled={isLoading}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="background" style={labelStyle}>
                    Background
                  </label>
                  <textarea
                    id="background"
                    className="sf-input"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    maxLength={500}
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="sf-submit"
              disabled={!role || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p
              className="text-center"
              style={{
                marginTop: 20,
                fontSize: 14,
                color: "var(--sf-mt)",
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
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
                Log in
              </Link>
            </p>

            <p
              className="text-center"
              style={{
                marginTop: 16,
                fontSize: 12,
                color: "var(--sf-mtl)",
                lineHeight: 1.6,
              }}
            >
              By signing up you agree to our terms of service and acknowledge
              our privacy policy.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

interface RoleCardProps {
  emoji: string;
  title: string;
  desc: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

function RoleCard({ emoji, title, desc, selected, disabled, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`sf-role-opt${selected ? " selected" : ""}`}
      aria-pressed={selected}
    >
      <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }} aria-hidden>
        {emoji}
      </span>
      <span style={{ textAlign: "left" }}>
        <span className="sf-role-title" style={{ display: "block" }}>
          {title}
        </span>
        <span className="sf-role-desc" style={{ display: "block" }}>
          {desc}
        </span>
      </span>
    </button>
  );
}
