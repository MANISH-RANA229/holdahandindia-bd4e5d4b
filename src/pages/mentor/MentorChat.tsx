/**
 * MentorChat — Spec 06 redesign.
 * Full-bleed split layout: contacts sidebar + chat panel with bubble messages.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, BarChart3, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { Message, Student } from "@/data/types";

const AVATAR_CYCLE = [
  "ms-av-sf",
  "ms-av-gr",
  "ms-av-amber",
  "ms-av-indigo",
  "ms-av-teal",
  "ms-av-red",
];

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

export default function MentorChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getSelectedStudents, messages, addMessage } = useAppData();
  const selected = getSelectedStudents(user!.id);

  const [activeId, setActiveId] = useState<string>(selected[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selected.find((s) => s.id === activeId) && selected[0]) {
      setActiveId(selected[0].id);
    }
  }, [selected, activeId]);

  const decorated = useMemo(
    () =>
      selected.map((s, i) => ({
        student: s,
        avatarClass: AVATAR_CYCLE[i % AVATAR_CYCLE.length],
      })),
    [selected]
  );

  const activeStudent: Student | undefined = selected.find(
    (s) => s.id === activeId
  );

  const conversation = useMemo(() => {
    if (!activeStudent) return [];
    return messages
      .filter(
        (m) =>
          (m.senderId === user!.id && m.receiverId === activeStudent.id) ||
          (m.senderId === activeStudent.id && m.receiverId === user!.id)
      )
      .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
  }, [messages, user, activeStudent]);

  // Auto-scroll on conversation change / new message
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation.length, activeId]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !activeStudent) return;
    addMessage({
      id: `msg${Date.now()}`,
      senderId: user!.id,
      receiverId: activeStudent.id,
      content: text,
      timestamp: new Date().toISOString(),
    });
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── Empty state (no selected students) ── */
  if (selected.length === 0) {
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
              No conversations yet
            </p>
            <p
              style={{
                fontSize: 14,
                color: "var(--sf-mt)",
                marginBottom: 20,
              }}
            >
              Select students from Discover to start chatting.
            </p>
            <button
              type="button"
              className="ms-btn ms-btn-primary"
              onClick={() => navigate("/mentor/discover")}
            >
              Discover Students
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── Group messages by day for date separators ── */
  const grouped: { date: string; items: Message[] }[] = [];
  conversation.forEach((m) => {
    const k = dateKey(m.timestamp);
    const last = grouped[grouped.length - 1];
    if (last && last.date === k) last.items.push(m);
    else grouped.push({ date: k, items: [m] });
  });

  const activeAvatar =
    decorated.find((d) => d.student.id === activeId)?.avatarClass ?? "ms-av-sf";

  return (
    <>
      <div className="flex" style={{ height: "100%" }}>
        {/* ── Contacts sidebar ── */}
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
              flexShrink: 0,
            }}
          >
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--sf-ch)" }}>
              Messages
            </p>
            <p style={{ fontSize: 12, color: "var(--sf-mt)", marginTop: 3 }}>
              {selected.length} conversation{selected.length === 1 ? "" : "s"}
            </p>
          </div>

          <div
            className="flex flex-col"
            style={{ flex: 1, overflowY: "auto", padding: 8, gap: 2 }}
          >
            {decorated.map(({ student: s, avatarClass }) => {
              const last = [...messages]
                .filter(
                  (m) =>
                    (m.senderId === user!.id && m.receiverId === s.id) ||
                    (m.senderId === s.id && m.receiverId === user!.id)
                )
                .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
                .pop();
              const isActive = activeId === s.id;
              const isOnline = isActive; // demo: active student appears online
              return (
                <button
                  key={s.id}
                  className={`ms-chat-contact${isActive ? " active" : ""}`}
                  onClick={() => setActiveId(s.id)}
                >
                  <span className={`ms-avatar ms-av-sm ${avatarClass}`}>
                    {s.avatar || s.name.charAt(0)}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--sf-ch)",
                      }}
                    >
                      {s.name}
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
                      {last?.content ?? "Say hello 👋"}
                    </span>
                  </span>
                  <span
                    className="flex flex-col items-end"
                    style={{ flexShrink: 0, gap: 4 }}
                  >
                    <span style={{ fontSize: 10, color: "var(--sf-mtl)" }}>
                      {last ? formatTime(last.timestamp) : ""}
                    </span>
                    <span
                      className={`ms-status-dot ${
                        isOnline ? "ms-dot-green" : "ms-dot-gray"
                      }`}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Chat main panel ── */}
        <section
          className="flex flex-col"
          style={{ flex: 1, overflow: "hidden", minWidth: 0 }}
        >
          {activeStudent && (
            <>
              {/* Chat header */}
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
                <span className={`ms-avatar ms-av-sm ${activeAvatar}`}>
                  {activeStudent.avatar || activeStudent.name.charAt(0)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--sf-ch)",
                    }}
                  >
                    {activeStudent.name}
                  </p>
                  <p
                    className="flex items-center"
                    style={{
                      fontSize: 12,
                      color: "#22c55e",
                      gap: 5,
                    }}
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
                    Online now
                  </p>
                </div>
                <div className="flex items-center" style={{ gap: 8 }}>
                  <button
                    type="button"
                    className="ms-btn ms-btn-outline ms-btn-sm"
                    onClick={() => navigate("/mentor/sessions")}
                  >
                    <Video size={13} /> Video Call
                  </button>
                  <button
                    type="button"
                    className="ms-btn ms-btn-outline ms-btn-sm"
                    onClick={() => navigate("/mentor/insights")}
                  >
                    <BarChart3 size={13} /> View Insights
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
                    Start the conversation by sending {activeStudent.name.split(" ")[0]}{" "}
                    a message.
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
                        const sent = m.senderId === user!.id;
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
                                className={`ms-avatar ms-av-sm ${activeAvatar}`}
                                style={{ marginTop: 2 }}
                              >
                                {activeStudent.avatar ||
                                  activeStudent.name.charAt(0)}
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
                                    ? "ms-chat-bubble-sent"
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
                  placeholder="Type a message…"
                />
                <button
                  type="button"
                  className="ms-chat-send"
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
