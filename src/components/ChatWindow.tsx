/**
 * ChatWindow — Reusable chat UI with message validation and send throttling.
 * Messages are validated with Zod before dispatch.
 * Send is throttled to 1 message per second to prevent spam.
 */
import { useState, useRef, useEffect, memo } from "react";
import { Message } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, AlertCircle } from "lucide-react";
import { chatMessageSchema } from "@/lib/validation";
import { useThrottle } from "@/hooks/useThrottle";

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  onSend: (content: string) => void;
  disabled?: boolean;
  disabledMessage?: string;
}

export const ChatWindow = memo(function ChatWindow({
  messages, currentUserId, otherUserName, otherUserAvatar, onSend, disabled, disabledMessage,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Throttled send — max 1 message per second */
  const throttledSend = useThrottle((content: string) => {
    onSend(content);
  }, 1000);

  const handleSend = () => {
    const result = chatMessageSchema.safeParse({ content: input });
    if (!result.success) {
      setValidationError(result.error.errors[0]?.message ?? "Invalid message");
      return;
    }
    setValidationError(null);
    throttledSend(result.data.content);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px] border border-border rounded-lg bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
          {otherUserAvatar}
        </div>
        <span className="font-medium text-sm text-foreground">{otherUserName}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-xl px-3.5 py-2 text-sm ${
                isMine
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}>
                {msg.content}
                <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      {disabled && disabledMessage && (
        <div className="px-4 py-2 bg-destructive/10 border-t border-border flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
          <span className="text-xs text-destructive">{disabledMessage}</span>
        </div>
      )}
      {validationError && (
        <div className="px-4 py-1.5 bg-warning/10 border-t border-border">
          <span className="text-xs text-warning">{validationError}</span>
        </div>
      )}
      <div className="p-3 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={e => { setInput(e.target.value); setValidationError(null); }}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          disabled={disabled}
          maxLength={1000}
          className="text-sm"
        />
        <Button size="icon" onClick={handleSend} disabled={disabled || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});
