import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VideoSessionCard } from "@/components/VideoSessionCard";
import { Button } from "@/components/ui/button";
import { mentors } from "@/data/mentors";
import { Student } from "@/data/types";
import { Video, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MAX_WEEKLY_CALLS = 2;

export default function StudentVideoSessions() {
  const { user } = useAuth();
  const { sessions, addSession, toggleSessionSaved, weeklyCallCount, incrementCallCount } = useAppData();
  const { toast } = useToast();
  const student = user as Student;
  const mentor = mentors.find(m => m.id === student.assignedMentorId);
  const studentSessions = sessions.filter(s => s.studentId === student.id);
  const isLimitReached = weeklyCallCount >= MAX_WEEKLY_CALLS;

  const handleRequest = () => {
    if (isLimitReached || !mentor) return;
    addSession({
      id: `ses${Date.now()}`,
      mentorId: mentor.id,
      studentId: student.id,
      date: new Date().toISOString().split("T")[0],
      duration: "30 min",
      topic: "Requested Session",
      status: "scheduled",
      saved: false,
    });
    incrementCallCount();
    toast({ title: "Session requested!", description: "Your mentor will be notified." });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Video Sessions</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Calls this week: {weeklyCallCount}/{MAX_WEEKLY_CALLS}
            </p>
          </div>
          <Button onClick={handleRequest} disabled={isLimitReached || !mentor} size="sm">
            <Video className="h-4 w-4 mr-1" />
            Request Session
          </Button>
        </div>

        {isLimitReached && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">Weekly video call limit reached. Try next week!</span>
          </div>
        )}

        <div className="space-y-3">
          {studentSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions yet. Request one above!</p>
          ) : (
            studentSessions.map(s => (
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
