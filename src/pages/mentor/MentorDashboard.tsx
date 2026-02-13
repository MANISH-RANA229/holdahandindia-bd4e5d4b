import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { StudentCard } from "@/components/StudentCard";
import { ConsistencyMeter } from "@/components/ConsistencyMeter";
import { SponsorBadge } from "@/components/SponsorBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supportPrograms } from "@/data/supportPrograms";
import { getSeriousnessLevel } from "@/data/seriousnessData";
import { Users, Video, UserCheck, TrendingUp, Heart, BarChart3 } from "lucide-react";
import { Mentor } from "@/data/types";

export default function MentorDashboard() {
  const { user } = useAuth();
  const { getSelectedStudents, sessions, growthRecords, getSeriousnessRecord, getStudentSupportRequests } = useAppData();
  const mentor = user as Mentor;
  const selected = getSelectedStudents(mentor.id);
  const mentorSessions = sessions.filter(s => s.mentorId === mentor.id);
  const completed = mentorSessions.filter(s => s.status === "completed").length;

  // Top growing students
  const topGrowing = [...selected]
    .map(s => {
      const g = growthRecords.find(r => r.studentId === s.id);
      const total = g ? Object.values(g.ratings).reduce((a, b) => a + b, 0) : 0;
      return { student: s, total };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  // Most serious students
  const mostSerious = [...selected]
    .map(s => ({ student: s, record: getSeriousnessRecord(s.id) }))
    .filter(x => x.record)
    .sort((a, b) => (b.record!.consistencyScore - a.record!.consistencyScore))
    .slice(0, 3);

  // Students needing support
  const needsSupport = selected.filter(s => getStudentSupportRequests(s.id).length > 0);

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

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Growing Students */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Top Growing Students
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topGrowing.length === 0 ? (
                <p className="text-xs text-muted-foreground">No growth data yet.</p>
              ) : (
                topGrowing.map(({ student: s, total }) => (
                  <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/50">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                      {s.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.interests[0]}</p>
                    </div>
                    <span className="text-xs font-semibold text-primary">{total}/40</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Students Needing Support */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Students Who Need Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {needsSupport.length === 0 ? (
                <p className="text-xs text-muted-foreground">No support requests from selected students.</p>
              ) : (
                needsSupport.map(s => {
                  const reqs = getStudentSupportRequests(s.id);
                  return (
                    <div key={s.id} className="p-2.5 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                          {s.avatar}
                        </div>
                        <p className="text-sm font-medium text-foreground">{s.name}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {reqs.map(r => {
                          const prog = supportPrograms.find(p => p.id === r.programId);
                          return (
                            <div key={r.id} className="flex items-center gap-1.5">
                              <span className="text-xs text-muted-foreground">{prog?.type}</span>
                              <SponsorBadge status={r.status} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
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
