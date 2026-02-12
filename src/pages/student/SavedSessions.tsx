import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VideoSessionCard } from "@/components/VideoSessionCard";
import { mentors } from "@/data/mentors";
import { Student } from "@/data/types";

export default function SavedSessions() {
  const { user } = useAuth();
  const { sessions, toggleSessionSaved } = useAppData();
  const student = user as Student;
  const mentor = mentors.find(m => m.id === student.assignedMentorId);
  const saved = sessions.filter(s => s.studentId === student.id && s.saved);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Saved Sessions</h1>
          <p className="text-sm text-muted-foreground mt-1">{saved.length} saved session{saved.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="space-y-3">
          {saved.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved sessions yet. Bookmark sessions from the Video Sessions page.</p>
          ) : (
            saved.map(s => (
              <VideoSessionCard
                key={s.id}
                session={s}
                otherName={mentor?.name || "Mentor"}
                onToggleSave={() => toggleSessionSaved(s.id)}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
