import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SkillBar } from "@/components/SkillBar";
import { MentorNotesCard } from "@/components/MentorNotesCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/data/types";
import { TrendingUp } from "lucide-react";

export default function MyGrowth() {
  const { user } = useAuth();
  const { getGrowthRecord } = useAppData();
  const student = user as Student;
  const growth = getGrowthRecord(student.id);

  const skills = ["confidence", "discipline", "communication", "learningSpeed"] as const;
  const skillLabels: Record<string, string> = {
    confidence: "Confidence",
    discipline: "Discipline",
    communication: "Communication",
    learningSpeed: "Learning Speed",
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            My Growth
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track your skill development over time</p>
        </div>

        {growth ? (
          <div className="space-y-6">
            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Skill Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {skills.map(skill => (
                  <SkillBar
                    key={skill}
                    label={skillLabels[skill]}
                    value={growth.ratings[skill]}
                    previousValue={growth.previousRatings[skill]}
                  />
                ))}
              </CardContent>
            </Card>

            <MentorNotesCard
              notes={growth.notes}
              onSave={() => {}}
              readOnly
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No growth data yet. Your mentor will start rating your skills soon!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
