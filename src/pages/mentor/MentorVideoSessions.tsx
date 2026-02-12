import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VideoSessionCard } from "@/components/VideoSessionCard";
import { mentors } from "@/data/mentors";
import { students } from "@/data/students";

export default function MentorVideoSessions() {
  const { user } = useAuth();
  const { sessions, toggleSessionSaved } = useAppData();
  const mentorSessions = sessions.filter(s => s.mentorId === user!.id);

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || "Unknown";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Video Sessions</h1>
          <p className="text-sm text-muted-foreground mt-1">{mentorSessions.length} total sessions</p>
        </div>
        <div className="space-y-3">
          {mentorSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions yet.</p>
          ) : (
            mentorSessions.map(s => (
              <VideoSessionCard
                key={s.id}
                session={s}
                otherName={getStudentName(s.studentId)}
                onToggleSave={() => toggleSessionSaved(s.id)}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
