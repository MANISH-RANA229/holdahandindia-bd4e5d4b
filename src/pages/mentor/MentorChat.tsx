import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChatWindow } from "@/components/ChatWindow";
import { Button } from "@/components/ui/button";

export default function MentorChat() {
  const { user } = useAuth();
  const { getSelectedStudents, messages, addMessage } = useAppData();
  const selected = getSelectedStudents(user!.id);
  const [activeStudentId, setActiveStudentId] = useState(selected[0]?.id || "");

  const activeStudent = selected.find(s => s.id === activeStudentId);
  const chatMessages = messages.filter(
    m => (m.senderId === user!.id && m.receiverId === activeStudentId) ||
         (m.senderId === activeStudentId && m.receiverId === user!.id)
  );

  const handleSend = (content: string) => {
    addMessage({
      id: `msg${Date.now()}`,
      senderId: user!.id,
      receiverId: activeStudentId,
      content,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Chat</h1>
          <p className="text-sm text-muted-foreground mt-1">Message your selected students</p>
        </div>

        {selected.length === 0 ? (
          <p className="text-sm text-muted-foreground">Select students first to start chatting.</p>
        ) : (
          <div className="grid md:grid-cols-[200px_1fr] gap-4">
            <div className="space-y-1">
              {selected.map(s => (
                <Button
                  key={s.id}
                  variant={activeStudentId === s.id ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => setActiveStudentId(s.id)}
                >
                  <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] mr-2 flex-shrink-0">
                    {s.avatar}
                  </span>
                  {s.name}
                </Button>
              ))}
            </div>
            {activeStudent && (
              <ChatWindow
                messages={chatMessages}
                currentUserId={user!.id}
                otherUserName={activeStudent.name}
                otherUserAvatar={activeStudent.avatar}
                onSend={handleSend}
              />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
