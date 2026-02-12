import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChatWindow } from "@/components/ChatWindow";
import { mentors } from "@/data/mentors";
import { Student } from "@/data/types";

const MAX_DAILY_MESSAGES = 20;

export default function StudentChat() {
  const { user } = useAuth();
  const { messages, addMessage, dailyMessageCount, incrementMessageCount } = useAppData();
  const student = user as Student;
  const mentor = mentors.find(m => m.id === student.assignedMentorId);

  if (!mentor) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-foreground mb-2">Chat</h1>
          <p className="text-sm text-muted-foreground">You need an assigned mentor to chat.</p>
        </div>
      </DashboardLayout>
    );
  }

  const chatMessages = messages.filter(
    m => (m.senderId === student.id && m.receiverId === mentor.id) ||
         (m.senderId === mentor.id && m.receiverId === student.id)
  );

  const isLimitReached = dailyMessageCount >= MAX_DAILY_MESSAGES;

  const handleSend = (content: string) => {
    if (isLimitReached) return;
    addMessage({
      id: `msg${Date.now()}`,
      senderId: student.id,
      receiverId: mentor.id,
      content,
      timestamp: new Date().toISOString(),
    });
    incrementMessageCount();
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Chat with {mentor.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Messages today: {dailyMessageCount}/{MAX_DAILY_MESSAGES}
          </p>
        </div>
        <ChatWindow
          messages={chatMessages}
          currentUserId={student.id}
          otherUserName={mentor.name}
          otherUserAvatar={mentor.avatar}
          onSend={handleSend}
          disabled={isLimitReached}
          disabledMessage={`Daily message limit reached (${MAX_DAILY_MESSAGES}/${MAX_DAILY_MESSAGES}). Try again tomorrow!`}
        />
      </div>
    </DashboardLayout>
  );
}
