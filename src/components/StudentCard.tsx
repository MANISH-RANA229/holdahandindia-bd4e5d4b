import { Student } from "@/data/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, UserCheck, MessageCircle } from "lucide-react";

interface StudentCardProps {
  student: Student;
  isSelected?: boolean;
  onSelect?: () => void;
  onUnselect?: () => void;
  onChat?: () => void;
  showActions?: boolean;
}

export function StudentCard({ student, isSelected, onSelect, onUnselect, onChat, showActions = true }: StudentCardProps) {
  return (
    <Card className="card-shadow hover:card-shadow-hover transition-all">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground flex-shrink-0">
            {student.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-sm">{student.name}</h3>
              <Badge variant="secondary" className="text-xs">{student.age} yrs</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{student.goals}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {student.interests.map(i => (
                <Badge key={i} variant="outline" className="text-xs px-2 py-0.5">{i}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground italic line-clamp-2">{student.background}</p>
          </div>
        </div>
        {showActions && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-border">
            {isSelected ? (
              <>
                <Button size="sm" variant="outline" onClick={onUnselect} className="flex-1 text-xs">
                  <UserCheck className="h-3.5 w-3.5 mr-1" />
                  Selected
                </Button>
                <Button size="sm" onClick={onChat} className="flex-1 text-xs">
                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                  Chat
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={onSelect} className="flex-1 text-xs">
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                Select for Mentorship
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
