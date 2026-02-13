import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SeriousnessRecord, getActivityStatus, getSeriousnessLevel } from "@/data/seriousnessData";
import { ActivityStatusBadge } from "./ActivityStatusBadge";

interface ConsistencyMeterProps {
  record: SeriousnessRecord;
  studentName: string;
}

export function ConsistencyMeter({ record, studentName }: ConsistencyMeterProps) {
  const status = getActivityStatus(record);
  const level = getSeriousnessLevel(record);

  const levelColors = {
    high: "text-success",
    medium: "text-warning",
    low: "text-destructive",
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{studentName}</CardTitle>
          <ActivityStatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Consistency Score</span>
            <span className={`font-semibold ${levelColors[level]}`}>{record.consistencyScore}%</span>
          </div>
          <Progress value={record.consistencyScore} className="h-2" />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Attendance Rate</span>
            <span className="font-semibold text-foreground">{record.attendanceRate}%</span>
          </div>
          <Progress value={record.attendanceRate} className="h-2" />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Missed Sessions</span>
          <span className={`font-semibold ${record.missedSessions > 3 ? "text-destructive" : "text-foreground"}`}>
            {record.missedSessions}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Last Active</span>
          <span className="text-foreground">
            {record.lastActiveDaysAgo === 0 ? "Today" : `${record.lastActiveDaysAgo} day${record.lastActiveDaysAgo > 1 ? "s" : ""} ago`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
