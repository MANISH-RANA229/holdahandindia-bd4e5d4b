import { Session } from "@/data/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkCheck, Calendar, Clock } from "lucide-react";

interface VideoSessionCardProps {
  session: Session;
  otherName: string;
  onToggleSave?: () => void;
}

export function VideoSessionCard({ session, otherName, onToggleSave }: VideoSessionCardProps) {
  return (
    <Card className="card-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-sm text-foreground">{session.topic}</h4>
            <p className="text-xs text-muted-foreground mt-1">with {otherName}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" /> {session.date}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {session.duration}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={session.status === "completed" ? "default" : session.status === "scheduled" ? "secondary" : "destructive"} className="text-xs">
              {session.status}
            </Badge>
            {onToggleSave && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleSave}>
                {session.saved ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
