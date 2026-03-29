/**
 * Tests for ChatWindow — rendering messages, sending, and disabled state.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatWindow } from "../ChatWindow";
import { Message } from "@/data/types";

const mockMessages: Message[] = [
  { id: "1", senderId: "me", receiverId: "other", content: "Hello!", timestamp: new Date().toISOString() },
  { id: "2", senderId: "other", receiverId: "me", content: "Hi there!", timestamp: new Date().toISOString() },
];

describe("ChatWindow", () => {
  it("renders all messages", () => {
    render(
      <ChatWindow
        messages={mockMessages}
        currentUserId="me"
        otherUserName="Mentor"
        otherUserAvatar="M"
        onSend={vi.fn()}
      />
    );
    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });

  it("renders the other user's name in the header", () => {
    render(
      <ChatWindow
        messages={[]}
        currentUserId="me"
        otherUserName="Rajesh"
        otherUserAvatar="R"
        onSend={vi.fn()}
      />
    );
    expect(screen.getByText("Rajesh")).toBeInTheDocument();
  });

  it("calls onSend when user types and presses Enter", () => {
    const onSend = vi.fn();
    render(
      <ChatWindow
        messages={[]}
        currentUserId="me"
        otherUserName="Test"
        otherUserAvatar="T"
        onSend={onSend}
      />
    );
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "New message" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSend).toHaveBeenCalledWith("New message");
  });

  it("does not send empty messages", () => {
    const onSend = vi.fn();
    render(
      <ChatWindow
        messages={[]}
        currentUserId="me"
        otherUserName="Test"
        otherUserAvatar="T"
        onSend={onSend}
      />
    );
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("shows disabled message when chat is disabled", () => {
    render(
      <ChatWindow
        messages={[]}
        currentUserId="me"
        otherUserName="Test"
        otherUserAvatar="T"
        onSend={vi.fn()}
        disabled
        disabledMessage="Chat limit reached"
      />
    );
    expect(screen.getByText("Chat limit reached")).toBeInTheDocument();
  });
});
