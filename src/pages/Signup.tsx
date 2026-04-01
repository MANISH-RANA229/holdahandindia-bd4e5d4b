/**
 * Signup page — validates all fields with Zod schema before account creation.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/data/types";
import { mentorSignupSchema, studentSignupSchema } from "@/lib/validation";

export default function Signup() {
  const [role, setRole] = useState<UserRole | "">("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState("");
  const [goals, setGoals] = useState("");
  const [background, setBackground] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    /* Validate with the appropriate Zod schema based on role */
    const raw = role === "mentor"
      ? { role, username, password, name, field, experience, bio }
      : { role, username, password, name, age, interests, goals, background };

    const schema = role === "mentor" ? mentorSignupSchema : studentSignupSchema;
    const result = schema.safeParse(raw);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const baseData = { username, password, name, role: role as UserRole };
    let userData: any;
    if (role === "mentor") {
      userData = { ...baseData, field, experience, bio, avatar: name.split(" ").map(w => w[0]).join("").toUpperCase(), studentsGuided: 0, sessionsCompleted: 0 };
    } else {
      userData = { ...baseData, age: parseInt(age), interests: interests.split(",").map(s => s.trim()), goals, background, avatar: name.split(" ").map(w => w[0]).join("").toUpperCase(), assignedMentorId: null };
    }

    const success = signup(userData);
    if (success) {
      toast({ title: "Account created!", description: "Welcome to Hold A Hand India." });
      navigate(role === "mentor" ? "/mentor/dashboard" : "/student/dashboard");
    } else {
      toast({ title: "Signup failed", description: "Username already exists.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>
        <Card className="card-shadow">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-lg">Join the mission</CardTitle>
            <CardDescription>Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">I am a</Label>
                <Select value={role} onValueChange={(v) => { setRole(v as UserRole); setErrors({}); }}>
                  <SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">Username</Label>
                  <Input value={username} onChange={e => setUsername(e.target.value)} maxLength={30} required />
                  {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Password</Label>
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} maxLength={100} required />
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Full Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} maxLength={60} required />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              {role === "mentor" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm">Field</Label>
                    <Select value={field} onValueChange={setField}>
                      <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.field && <p className="text-xs text-destructive">{errors.field}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Experience</Label>
                    <Input value={experience} onChange={e => setExperience(e.target.value)} maxLength={200} placeholder="e.g., 10 years in..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Short Bio</Label>
                    <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} maxLength={500} placeholder="Tell students about yourself..." />
                  </div>
                </>
              )}

              {role === "student" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Age</Label>
                      <Input type="number" value={age} onChange={e => setAge(e.target.value)} min={5} max={25} />
                      {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Interests</Label>
                      <Input value={interests} onChange={e => setInterests(e.target.value)} maxLength={200} placeholder="Math, Sports..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Goals</Label>
                    <Textarea value={goals} onChange={e => setGoals(e.target.value)} rows={2} maxLength={500} placeholder="What do you want to achieve?" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Background</Label>
                    <Textarea value={background} onChange={e => setBackground(e.target.value)} rows={2} maxLength={500} placeholder="Tell us about yourself..." />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={!role}>Create Account</Button>
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">Log in</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
