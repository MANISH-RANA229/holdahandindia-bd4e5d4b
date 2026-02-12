import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { VideoSessionCard } from "@/components/VideoSessionCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mentors } from "@/data/mentors";
import { Student, Mentor } from "@/data/types";
import { User, MessageCircle, Video, Bookmark } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { sessions, toggleSessionSaved, dailyMessageCount, weeklyCallCount } = useAppData();
  const student = user as Student;
  const mentor = mentors.find(m => m.id === student.assignedMentorId);
  const studentSessions = sessions.filter(s => s.studentId === student.id);
  const saved = studentSessions.filter(s => s.saved);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Welcome, {student.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">Your learning journey at a glance</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Messages Today" value={`${dailyMessageCount}/20`} icon={MessageCircle} description="Daily limit" />
          <StatsCard title="Calls This Week" value={`${weeklyCallCount}/2`} icon={Video} description="Weekly limit" />
          <StatsCard title="Sessions" value={studentSessions.length} icon={Video} />
          <StatsCard title="Saved" value={saved.length} icon={Bookmark} />
        </div>

        {mentor ? (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-3">Your Mentor</h2>
            <Card className="card-shadow">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {mentor.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                  <Badge variant="secondary" className="mt-1 text-xs capitalize">{mentor.field}</Badge>
                  <p className="text-sm text-muted-foreground mt-2">{mentor.bio}</p>
                  <p className="text-xs text-muted-foreground mt-1">{mentor.experience}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mb-8 p-4 rounded-lg bg-accent/50 border border-border">
            <p className="text-sm text-muted-foreground">No mentor assigned yet. A mentor will select you soon!</p>
          </div>
        )}

        {studentSessions.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Recent Sessions</h2>
            <div className="space-y-3">
              {studentSessions.slice(0, 3).map(s => (
                <VideoSessionCard
                  key={s.id}
                  session={s}
                  otherName={mentor?.name || "Mentor"}
                  onToggleSave={() => toggleSessionSaved(s.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
