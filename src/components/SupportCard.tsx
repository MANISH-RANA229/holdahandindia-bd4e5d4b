import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SupportProgram } from "@/data/supportPrograms";
import { Heart } from "lucide-react";

interface SupportCardProps {
  program: SupportProgram;
  onSelect?: () => void;
  selected?: boolean;
}

export function SupportCard({ program, onSelect, selected }: SupportCardProps) {
  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Heart className="h-5 w-5 text-accent-foreground" />
          </div>
          <Badge variant="secondary" className="text-xs">₹{program.amount}</Badge>
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-1">{program.type}</h3>
        <p className="text-xs text-muted-foreground mb-4">{program.description}</p>
        {onSelect && (
          <Button
            size="sm"
            variant={selected ? "outline" : "default"}
            onClick={onSelect}
            className="w-full text-xs"
          >
            {selected ? "Requested" : "Request Support"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
