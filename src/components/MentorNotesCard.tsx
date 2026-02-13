import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

interface MentorNotesCardProps {
  notes: string;
  onSave: (note: string) => void;
  readOnly?: boolean;
}

export function MentorNotesCard({ notes, onSave, readOnly }: MentorNotesCardProps) {
  const [value, setValue] = useState(notes);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Mentor Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {readOnly ? (
          <p className="text-sm text-muted-foreground italic">
            {notes || "No notes from your mentor yet."}
          </p>
        ) : (
          <div className="space-y-3">
            <Textarea
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Add notes about this student's progress..."
              className="text-sm resize-none"
              rows={3}
            />
            <Button size="sm" onClick={handleSave} className="text-xs">
              {saved ? "Saved ✓" : "Save Notes"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
