/**
 * StudentChat — Spec 07 redesign.
 * Full-bleed split: single-mentor contact list + chat with saffron sent bubbles.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Calendar, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { useToast } from "@/hooks/use-toast";
import { mentors } from "@/data/mentors";
import { Message, Student } from "@/data/types";

const MAX_DAILY_MESSAGES = 20;

function formatTime(ts: string) {
  try {
    return new Date(ts).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function formatDateLabel(ts: string) {
  try {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
    if (sameDay(d, today)) return "Today";
    if (sameDay(d, yesterday)) return "Yesterday";
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function dateKey(ts: string) {
  return ts.slice(0, 10);
}

export default function StudentChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    messages,
    addMessage,
    dailyMessageCount,
    incrementMessageCount,
  } = useAppData();
  const student = user as Student;
  const mentor = mentors.find((m) => m.id === student.assignedMentorId);

  const [draft, setDraft] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const conversation = useMemo(() => {
    if (!mentor) return [];
    return messages
      .filter(
        (m) =>
          (m.senderId === student.id && m.receiverId === mentor.id) ||
          (m.senderId === mentor.id && m.receiverId === student.id)
      )
      .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
  }, [messages, student.id, mentor]);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation.length, mentor?.id]);

  const isLimitReached = dailyMessageCount >= MAX_DAILY_MESSAGES;

  const handleSend = () => {
    if (!mentor) return;
    const text = draft.trim();
    if (!text) return;
    if (isLimitReached) {
      toast({
        title: "Daily limit reached",
        description: `You've sent ${MAX_DAILY_MESSAGES} messages today. Try again tomorrow.`,
        variant: "destructive",
      });
      return;
    }
    addMessage({
      id: `msg${Date.now()}`,
      senderId: student.id,
      receiverId: mentor.id,
      content: text,
      timestamp: new Date().toISOString(),
    });
    incrementMessageCount();
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!mentor) {
    return (
      <>
        <div
          className="flex items-center justify-center text-center"
          style={{ height: "100%", padding: 32 }}
        >
          <div>
            <p
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--sf-ch)",
                marginBottom: 6,
              }}
            >
              You need an assigned mentor to chat
            </p>
            <p
              style={{
                fontSize: 14,
                color: "var(--sf-mt)",
                marginBottom: 20,
              }}
            >
              A mentor will select you soon. Keep your profile up to date.
            </p>
            <button
              type="button"
              className="ms-btn ms-btn-primary"
              onClick={() => navigate("/student/mentor")}
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const lastMessage = conversation[conversation.length - 1];

  const grouped: { date: string; items: Message[] }[] = [];
  conversation.forEach((m) => {
    const k = dateKey(m.timestamp);
    const last = grouped[grouped.length - 1];
    if (last && last.date === k) last.items.push(m);
    else grouped.push({ date: k, items: [m] });
  });

  return (
    <>
      <div className="flex" style={{ height: "100%" }}>
        {/* Contacts sidebar */}
        <aside
          className="hidden md:flex flex-col"
          style={{
            width: 280,
            flexShrink: 0,
            background: "var(--sf-w)",
            borderRight: "1px solid var(--sf-bd)",
          }}
        >
          <div
            style={{
              padding: "18px 20px",
              borderBottom: "1px solid var(--sf-bd)",
            }}
          >
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--sf-ch)" }}>
              Messages
            </p>
            <p style={{ fontSize: 12, color: "var(--sf-mt)", marginTop: 3 }}>
              Chat with your mentor
            </p>
          </div>

          <div
            className="flex flex-col"
            style={{ flex: 1, overflowY: "auto", padding: 8, gap: 2 }}
          >
            <button
              type="button"
              className="ms-chat-contact ms-chat-contact--saffron active"
            >
              <span className="ms-avatar ms-av-sm ms-av-amber">
                {mentor.avatar.charAt(0)}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  className="flex items-center"
                  style={{ gap: 6, flexWrap: "wrap" }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--sf-ch)",
                    }}
                  >
                    {mentor.name.split(" ")[0]}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--sf-gr)",
                      fontWeight: 600,
                    }}
                  >
                    Mentor
                  </span>
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "var(--sf-mt)",
                    marginTop: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {lastMessage?.content ?? "Start the conversation 👋"}
                </span>
              </span>
              <span
                className="flex flex-col items-end"
                style={{ flexShrink: 0, gap: 4 }}
              >
                <span style={{ fontSize: 10, color: "var(--sf-mtl)" }}>
                  {lastMessage ? formatTime(lastMessage.timestamp) : ""}
                </span>
                <span className="ms-status-dot ms-dot-green" />
              </span>
            </button>
          </div>
        </aside>

        {/* Chat main panel */}
        <section
          className="flex flex-col"
          style={{ flex: 1, overflow: "hidden", minWidth: 0 }}
        >
          {/* Header */}
          <header
            className="flex items-center"
            style={{
              padding: "14px 22px",
              background: "var(--sf-w)",
              borderBottom: "1px solid var(--sf-bd)",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <span className="ms-avatar ms-av-sm ms-av-amber">
              {mentor.avatar.charAt(0)}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--sf-ch)",
                }}
              >
                {mentor.name}
              </p>
              <p
                className="flex items-center"
                style={{ fontSize: 12, color: "#22c55e", gap: 5 }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                  }}
                />
                Online now · Your Mentor
              </p>
            </div>
            <div className="flex items-center" style={{ gap: 8 }}>
              <button
                type="button"
                className="ms-btn ms-btn-outline ms-btn-sm"
                onClick={() => navigate("/student/sessions")}
              >
                <Video size={13} /> Video Call
              </button>
              <button
                type="button"
                className="ms-btn ms-btn-outline ms-btn-sm"
                onClick={() => navigate("/student/sessions")}
              >
                <Calendar size={13} /> Schedule
              </button>
            </div>
          </header>

          {/* Messages */}
          <div
            ref={messagesRef}
            className="flex flex-col"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 22,
              gap: 4,
              background: "var(--sf-cream)",
            }}
          >
            {grouped.length === 0 ? (
              <p
                className="text-center"
                style={{
                  fontSize: 13,
                  color: "var(--sf-mt)",
                  marginTop: 32,
                }}
              >
                Say hello to {mentor.name.split(" ")[0]} to start the conversation.
              </p>
            ) : (
              grouped.map((g) => (
                <div key={g.date}>
                  <div
                    className="text-center"
                    style={{
                      fontSize: 11,
                      color: "var(--sf-mtl)",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      margin: "12px 0 8px",
                    }}
                  >
                    {formatDateLabel(g.items[0].timestamp)}
                  </div>
                  {g.items.map((m) => {
                    const sent = m.senderId === student.id;
                    return (
                      <div
                        key={m.id}
                        className="flex"
                        style={{
                          gap: 8,
                          marginBottom: 6,
                          flexDirection: sent ? "row-reverse" : "row",
                        }}
                      >
                        {!sent && (
                          <span
                            className="ms-avatar ms-av-sm ms-av-amber"
                            style={{ marginTop: 2 }}
                          >
                            {mentor.avatar.charAt(0)}
                          </span>
                        )}
                        <div
                          className="flex flex-col"
                          style={{
                            alignItems: sent ? "flex-end" : "flex-start",
                            maxWidth: "70%",
                          }}
                        >
                          <div
                            className={
                              sent
                                ? "ms-chat-bubble-sent-saffron"
                                : "ms-chat-bubble-recv"
                            }
                          >
                            {m.content}
                          </div>
                          <span
                            style={{
                              fontSize: 10,
                              color: "var(--sf-mtl)",
                              padding: "0 4px",
                              marginTop: 4,
                              marginBottom: 6,
                            }}
                          >
                            {formatTime(m.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Input area */}
          <div
            className="flex items-end"
            style={{
              padding: "14px 18px",
              background: "var(--sf-w)",
              borderTop: "1px solid var(--sf-bd)",
              gap: 9,
              flexShrink: 0,
            }}
          >
            <textarea
              className="ms-chat-textarea"
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isLimitReached
                  ? `Daily limit reached (${MAX_DAILY_MESSAGES}/${MAX_DAILY_MESSAGES})`
                  : "Type a message to your mentor…"
              }
              disabled={isLimitReached}
            />
            <button
              type="button"
              className="ms-chat-send"
              onClick={handleSend}
              disabled={!draft.trim() || isLimitReached}
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </div>
          <p
            style={{
              fontSize: 11,
              color: "var(--sf-mtl)",
              padding: "0 22px 12px",
              background: "var(--sf-w)",
            }}
          >
            Messages today: {dailyMessageCount}/{MAX_DAILY_MESSAGES}
          </p>
        </section>
      </div>
    </>
  );
}
