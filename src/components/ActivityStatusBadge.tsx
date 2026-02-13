import { Badge } from "@/components/ui/badge";
import { ActivityStatus } from "@/data/seriousnessData";

interface ActivityStatusBadgeProps {
  status: ActivityStatus;
}

export function ActivityStatusBadge({ status }: ActivityStatusBadgeProps) {
  const variants: Record<ActivityStatus, string> = {
    Active: "bg-success/15 text-success border-success/30",
    Irregular: "bg-warning/15 text-warning border-warning/30",
    Inactive: "bg-destructive/15 text-destructive border-destructive/30",
  };

  return (
    <Badge variant="outline" className={`text-xs ${variants[status]}`}>
      {status}
    </Badge>
  );
}
