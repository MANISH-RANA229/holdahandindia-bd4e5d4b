/**
 * Login page — validates input with Zod before attempting auth.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mentors } from "@/data/mentors";
import { students } from "@/data/students";
import { loginSchema } from "@/lib/validation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    /* Validate with Zod */
    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const success = login(result.data.username, result.data.password);
    if (success) {
      toast({ title: "Welcome back!", description: "Logged in successfully." });
      const allUsers = [...mentors, ...students];
      const user = allUsers.find(u => u.username === result.data.username);
      if (user?.role === "mentor") navigate("/mentor/dashboard");
      else navigate("/student/dashboard");
    } else {
      toast({ title: "Login failed", description: "Invalid username or password.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
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
            <CardTitle className="text-lg">Welcome back</CardTitle>
            <CardDescription>Log in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm">Username</Label>
                <Input id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" required />
                {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full">Log In</Button>
              <p className="text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
              </p>
            </form>
          </CardContent>
        </Card>
        <div className="mt-4 p-3 rounded-lg bg-accent/50 border border-border">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Demo Accounts:</p>
          <p className="text-xs text-muted-foreground">Mentor: <code className="bg-muted px-1 rounded">rajesh_mentor</code> / <code className="bg-muted px-1 rounded">password123</code></p>
          <p className="text-xs text-muted-foreground">Student: <code className="bg-muted px-1 rounded">anita_student</code> / <code className="bg-muted px-1 rounded">password123</code></p>
        </div>
      </div>
    </div>
  );
}
