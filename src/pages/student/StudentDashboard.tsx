import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { VideoSessionCard } from "@/components/VideoSessionCard";
import { SkillBar } from "@/components/SkillBar";
import { SponsorBadge } from "@/components/SponsorBadge";
import { ActivityStatusBadge } from "@/components/ActivityStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mentors } from "@/data/mentors";
import { supportPrograms } from "@/data/supportPrograms";
import { getActivityStatus } from "@/data/seriousnessData";
import { Student } from "@/data/types";
import { MessageCircle, Video, Bookmark, TrendingUp, Eye, Heart } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const {
    sessions, toggleSessionSaved, dailyMessageCount, weeklyCallCount,
    getGrowthRecord, getSeriousnessRecord, getStudentSupportRequests,
  } = useAppData();
  const student = user as Student;
  const mentor = mentors.find(m => m.id === student.assignedMentorId);
  const studentSessions = sessions.filter(s => s.studentId === student.id);
  const saved = studentSessions.filter(s => s.saved);
  const growth = getGrowthRecord(student.id);
  const seriousness = getSeriousnessRecord(student.id);
  const supportReqs = getStudentSupportRequests(student.id);

  const skills = ["confidence", "discipline", "communication", "learningSpeed"] as const;
  const skillLabels: Record<string, string> = {
    confidence: "Confidence", discipline: "Discipline",
    communication: "Communication", learningSpeed: "Learning Speed",
  };

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

        {mentor && (
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
        )}

        {!mentor && (
          <div className="mb-8 p-4 rounded-lg bg-accent/50 border border-border">
            <p className="text-sm text-muted-foreground">No mentor assigned yet. A mentor will select you soon!</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Skill Growth */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Skill Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {growth ? (
                skills.map(skill => (
                  <SkillBar
                    key={skill}
                    label={skillLabels[skill]}
                    value={growth.ratings[skill]}
                    previousValue={growth.previousRatings[skill]}
                  />
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No growth data yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Consistency & Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {seriousness ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <ActivityStatusBadge status={getActivityStatus(seriousness)} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Consistency</span>
                    <span className="font-semibold text-foreground">{seriousness.consistencyScore}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Attendance</span>
                    <span className="font-semibold text-foreground">{seriousness.attendanceRate}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Missed Sessions</span>
                    <span className={`font-semibold ${seriousness.missedSessions > 3 ? "text-destructive" : "text-foreground"}`}>
                      {seriousness.missedSessions}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No performance data yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Support Request Status */}
        {supportReqs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              Support Request Status
            </h2>
            <div className="space-y-2">
              {supportReqs.map(r => {
                const prog = supportPrograms.find(p => p.id === r.programId);
                return (
                  <Card key={r.id} className="card-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{prog?.type}</p>
                        {r.mentorNote && <p className="text-xs text-primary mt-0.5 italic">{r.mentorNote}</p>}
                      </div>
                      <SponsorBadge status={r.status} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
