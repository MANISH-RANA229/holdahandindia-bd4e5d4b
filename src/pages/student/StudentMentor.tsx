import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mentors } from "@/data/mentors";
import { Student } from "@/data/types";

export default function StudentMentor() {
  const { user } = useAuth();
  const student = user as Student;
  const mentor = mentors.find(m => m.id === student.assignedMentorId);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">My Mentor</h1>
        </div>
        {mentor ? (
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center text-lg font-bold text-primary-foreground flex-shrink-0">
                  {mentor.avatar}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{mentor.name}</h2>
                  <Badge variant="secondary" className="mt-1 capitalize">{mentor.field}</Badge>
                  <p className="text-sm text-muted-foreground mt-3">{mentor.bio}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="text-sm text-foreground">{mentor.experience}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Students Guided</p>
                      <p className="text-sm text-foreground">{mentor.studentsGuided}+</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No mentor assigned yet. A mentor will select you soon!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
