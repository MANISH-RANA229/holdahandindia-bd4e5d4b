import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { StudentCard } from "@/components/StudentCard";
import { Users, Video, UserCheck, TrendingUp } from "lucide-react";
import { Mentor } from "@/data/types";

export default function MentorDashboard() {
  const { user } = useAuth();
  const { getSelectedStudents, sessions } = useAppData();
  const mentor = user as Mentor;
  const selected = getSelectedStudents(mentor.id);
  const mentorSessions = sessions.filter(s => s.mentorId === mentor.id);
  const completed = mentorSessions.filter(s => s.status === "completed").length;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Welcome back, {mentor.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's your mentorship overview</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Students Guided" value={mentor.studentsGuided + selected.length} icon={Users} />
          <StatsCard title="Sessions Done" value={mentor.sessionsCompleted + completed} icon={Video} />
          <StatsCard title="Selected Students" value={selected.length} icon={UserCheck} />
          <StatsCard title="Your Field" value={mentor.field} icon={TrendingUp} description={mentor.experience} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Selected Students</h2>
          {selected.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students selected yet. Visit the Discover page to find students.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {selected.map(s => (
                <StudentCard key={s.id} student={s} isSelected showActions={false} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
