import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SkillBar } from "@/components/SkillBar";
import { MentorNotesCard } from "@/components/MentorNotesCard";
import { ConsistencyMeter } from "@/components/ConsistencyMeter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSeriousnessLevel, getActivityStatus } from "@/data/seriousnessData";
import { supportPrograms } from "@/data/supportPrograms";
import { SponsorBadge } from "@/components/SponsorBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mentor } from "@/data/types";
import { useState } from "react";
import {
  TrendingUp, Eye, Heart, ArrowUpDown,
} from "lucide-react";

type SortMode = "growth" | "serious" | "active";

export default function StudentInsights() {
  const { user } = useAuth();
  const {
    getSelectedStudents, getGrowthRecord, getSeriousnessRecord,
    updateGrowthRating, updateGrowthNote,
    getStudentSupportRequests, markStudentNeedsSupport,
  } = useAppData();
  const mentor = user as Mentor;
  const selected = getSelectedStudents(mentor.id);
  const [activeStudent, setActiveStudent] = useState(selected[0]?.id || "");
  const [sortMode, setSortMode] = useState<SortMode>("growth");
  const [supportNote, setSupportNote] = useState("");
  const [supportProgram, setSupportProgram] = useState("");

  const sortedStudents = [...selected].sort((a, b) => {
    if (sortMode === "growth") {
      const ga = getGrowthRecord(a.id);
      const gb = getGrowthRecord(b.id);
      const sa = ga ? Object.values(ga.ratings).reduce((x, y) => x + y, 0) : 0;
      const sb = gb ? Object.values(gb.ratings).reduce((x, y) => x + y, 0) : 0;
      return sb - sa;
    }
    if (sortMode === "serious") {
      const sa = getSeriousnessRecord(a.id)?.consistencyScore || 0;
      const sb = getSeriousnessRecord(b.id)?.consistencyScore || 0;
      return sb - sa;
    }
    const sa = getSeriousnessRecord(a.id)?.lastActiveDaysAgo ?? 99;
    const sb = getSeriousnessRecord(b.id)?.lastActiveDaysAgo ?? 99;
    return sa - sb;
  });

  const student = selected.find(s => s.id === activeStudent);
  const growth = student ? getGrowthRecord(student.id) : undefined;
  const seriousness = student ? getSeriousnessRecord(student.id) : undefined;
  const requests = student ? getStudentSupportRequests(student.id) : [];

  const skills = ["confidence", "discipline", "communication", "learningSpeed"] as const;
  const skillLabels: Record<string, string> = {
    confidence: "Confidence",
    discipline: "Discipline",
    communication: "Communication",
    learningSpeed: "Learning Speed",
  };

  const handleMarkSupport = () => {
    if (student && supportProgram && supportNote) {
      markStudentNeedsSupport(student.id, supportProgram, supportNote);
      setSupportNote("");
      setSupportProgram("");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Student Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">Growth tracking, seriousness metrics & support needs</p>
        </div>

        {selected.length === 0 ? (
          <p className="text-sm text-muted-foreground">No selected students. Visit Discover to select students first.</p>
        ) : (
          <div className="grid lg:grid-cols-[280px_1fr] gap-6">
            {/* Student list sidebar */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={sortMode}
                  onChange={e => setSortMode(e.target.value as SortMode)}
                  className="text-xs bg-secondary text-secondary-foreground rounded-md px-2 py-1 border border-border"
                >
                  <option value="growth">Highest Growth</option>
                  <option value="serious">Most Serious</option>
                  <option value="active">Most Active</option>
                </select>
              </div>
              {sortedStudents.map(s => {
                const sr = getSeriousnessRecord(s.id);
                const level = sr ? getSeriousnessLevel(sr) : "low";
                const dotColor = { high: "bg-success", medium: "bg-warning", low: "bg-destructive" }[level];
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveStudent(s.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      activeStudent === s.id ? "bg-accent" : "hover:bg-secondary"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                      {s.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.interests[0]}</p>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            {student && (
              <Tabs defaultValue="growth" className="space-y-4">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                  <TabsTrigger value="growth" className="text-xs gap-1"><TrendingUp className="h-3.5 w-3.5" />Growth</TabsTrigger>
                  <TabsTrigger value="seriousness" className="text-xs gap-1"><Eye className="h-3.5 w-3.5" />Seriousness</TabsTrigger>
                  <TabsTrigger value="support" className="text-xs gap-1"><Heart className="h-3.5 w-3.5" />Support</TabsTrigger>
                </TabsList>

                <TabsContent value="growth" className="space-y-4">
                  <Card className="card-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Skill Ratings — {student.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {skills.map(skill => (
                        <div key={skill} className="space-y-2">
                          <SkillBar
                            label={skillLabels[skill]}
                            value={growth?.ratings[skill] || 5}
                            previousValue={growth?.previousRatings[skill]}
                          />
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[growth?.ratings[skill] || 5]}
                            onValueChange={([v]) => updateGrowthRating(student.id, mentor.id, skill, v)}
                            className="py-1"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <MentorNotesCard
                    notes={growth?.notes || ""}
                    onSave={note => updateGrowthNote(student.id, mentor.id, note)}
                  />
                </TabsContent>

                <TabsContent value="seriousness">
                  {seriousness ? (
                    <ConsistencyMeter record={seriousness} studentName={student.name} />
                  ) : (
                    <p className="text-sm text-muted-foreground">No seriousness data available.</p>
                  )}
                </TabsContent>

                <TabsContent value="support" className="space-y-4">
                  {requests.length > 0 && (
                    <Card className="card-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Existing Requests</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {requests.map(r => {
                          const prog = supportPrograms.find(p => p.id === r.programId);
                          return (
                            <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                              <div>
                                <p className="text-sm font-medium text-foreground">{prog?.type}</p>
                                {r.mentorNote && <p className="text-xs text-muted-foreground mt-0.5">{r.mentorNote}</p>}
                              </div>
                              <SponsorBadge status={r.status} />
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}
                  <Card className="card-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Flag for Support</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <select
                        value={supportProgram}
                        onChange={e => setSupportProgram(e.target.value)}
                        className="w-full text-sm bg-background border border-border rounded-md px-3 py-2"
                      >
                        <option value="">Select support type...</option>
                        {supportPrograms.map(p => (
                          <option key={p.id} value={p.id}>{p.type} — ₹{p.amount}</option>
                        ))}
                      </select>
                      <Input
                        placeholder="Add a note (e.g., Needs cricket academy fee)"
                        value={supportNote}
                        onChange={e => setSupportNote(e.target.value)}
                        className="text-sm"
                      />
                      <Button size="sm" onClick={handleMarkSupport} disabled={!supportProgram || !supportNote} className="text-xs">
                        Mark as Needs Support
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
