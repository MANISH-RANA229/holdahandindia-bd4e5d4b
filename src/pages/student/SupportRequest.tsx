import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SupportCard } from "@/components/SupportCard";
import { SponsorBadge } from "@/components/SponsorBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supportPrograms } from "@/data/supportPrograms";
import { Student } from "@/data/types";
import { Heart } from "lucide-react";

export default function SupportRequest() {
  const { user } = useAuth();
  const { getStudentSupportRequests, addSupportRequest } = useAppData();
  const student = user as Student;
  const requests = getStudentSupportRequests(student.id);
  const requestedProgramIds = requests.map(r => r.programId);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Support Requests
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Request support for your learning journey</p>
        </div>

        {requests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-3">Your Requests</h2>
            <div className="space-y-3">
              {requests.map(r => {
                const prog = supportPrograms.find(p => p.id === r.programId);
                return (
                  <Card key={r.id} className="card-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{prog?.type}</p>
                        <p className="text-xs text-muted-foreground">{prog?.description}</p>
                        {r.mentorNote && (
                          <p className="text-xs text-primary mt-1 italic">Mentor: {r.mentorNote}</p>
                        )}
                      </div>
                      <SponsorBadge status={r.status} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Available Support Programs</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {supportPrograms.map(p => (
              <SupportCard
                key={p.id}
                program={p}
                selected={requestedProgramIds.includes(p.id)}
                onSelect={() => {
                  if (!requestedProgramIds.includes(p.id)) {
                    addSupportRequest(student.id, p.id);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
