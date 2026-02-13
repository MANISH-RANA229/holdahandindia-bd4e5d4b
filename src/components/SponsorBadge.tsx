import { Badge } from "@/components/ui/badge";
import { SupportRequestStatus } from "@/data/supportPrograms";

interface SponsorBadgeProps {
  status: SupportRequestStatus;
}

export function SponsorBadge({ status }: SponsorBadgeProps) {
  const styles: Record<SupportRequestStatus, string> = {
    Requested: "bg-warning/15 text-warning border-warning/30",
    "Under Review": "bg-primary/15 text-primary border-primary/30",
    Sponsored: "bg-success/15 text-success border-success/30",
  };

  return (
    <Badge variant="outline" className={`text-xs ${styles[status]}`}>
      {status}
    </Badge>
  );
}
