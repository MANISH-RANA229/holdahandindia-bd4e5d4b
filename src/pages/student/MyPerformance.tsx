import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ActivityStatusBadge } from "@/components/ActivityStatusBadge";
import { getActivityStatus } from "@/data/seriousnessData";
import { Student } from "@/data/types";
import { Eye, AlertTriangle } from "lucide-react";

export default function MyPerformance() {
  const { user } = useAuth();
  const { getSeriousnessRecord } = useAppData();
  const student = user as Student;
  const record = getSeriousnessRecord(student.id);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            My Performance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Your attendance and consistency metrics</p>
        </div>

        {record ? (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card className="card-shadow">
                <CardContent className="p-5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Attendance</p>
                  <p className="text-3xl font-bold text-foreground">{record.attendanceRate}%</p>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardContent className="p-5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Consistency</p>
                  <p className="text-3xl font-bold text-foreground">{record.consistencyScore}%</p>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardContent className="p-5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <div className="mt-2">
                    <ActivityStatusBadge status={getActivityStatus(record)} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Detailed Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Attendance Rate</span>
                    <span className="font-semibold text-foreground">{record.attendanceRate}%</span>
                  </div>
                  <Progress value={record.attendanceRate} className="h-2" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Consistency Score</span>
                    <span className="font-semibold text-foreground">{record.consistencyScore}%</span>
                  </div>
                  <Progress value={record.consistencyScore} className="h-2" />
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-border">
                  <span className="text-muted-foreground">Missed Sessions</span>
                  <span className={`font-semibold ${record.missedSessions > 3 ? "text-destructive" : "text-foreground"}`}>
                    {record.missedSessions}
                  </span>
                </div>
              </CardContent>
            </Card>

            {record.consistencyScore < 60 && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">
                  Your consistency is below average. If consistency drops further, mentor priority may reduce. Stay committed!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No performance data available yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
