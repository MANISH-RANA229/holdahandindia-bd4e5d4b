import { Progress } from "@/components/ui/progress";

interface SkillBarProps {
  label: string;
  value: number;
  previousValue?: number;
  max?: number;
}

export function SkillBar({ label, value, previousValue, max = 10 }: SkillBarProps) {
  const percentage = (value / max) * 100;
  const diff = previousValue !== undefined ? value - previousValue : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">{value}/{max}</span>
          {diff !== 0 && (
            <span className={`text-xs font-medium ${diff > 0 ? "text-success" : "text-destructive"}`}>
              {diff > 0 ? `+${diff}` : diff}
            </span>
          )}
        </div>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
