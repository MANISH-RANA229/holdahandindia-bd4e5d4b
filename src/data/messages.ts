import { Message } from "./types";

export const messages: Message[] = [
  {
    id: "msg1",
    senderId: "m1",
    receiverId: "s1",
    content: "Hello Anita! Welcome to the mentorship program. How are your studies going?",
    timestamp: "2025-01-15T10:00:00",
  },
  {
    id: "msg2",
    senderId: "s1",
    receiverId: "m1",
    content: "Thank you sir! I'm working hard on mathematics. I need help with calculus.",
    timestamp: "2025-01-15T10:05:00",
  },
  {
    id: "msg3",
    senderId: "m1",
    receiverId: "s1",
    content: "That's great! Let's schedule a session this week. I'll prepare some resources for you.",
    timestamp: "2025-01-15T10:08:00",
  },
  {
    id: "msg4",
    senderId: "m2",
    receiverId: "s2",
    content: "Ravi, I've watched your cricket videos. You have great potential! Let's work on your technique.",
    timestamp: "2025-01-16T09:00:00",
  },
  {
    id: "msg5",
    senderId: "s2",
    receiverId: "m2",
    content: "Thank you ma'am! I practice every morning. When can we have our first session?",
    timestamp: "2025-01-16T09:15:00",
  },
  {
    id: "msg6",
    senderId: "m3",
    receiverId: "s3",
    content: "Meena, your handicraft work is beautiful. Let's discuss how to turn it into a sustainable business.",
    timestamp: "2025-01-17T14:00:00",
  },
  {
    id: "msg7",
    senderId: "s3",
    receiverId: "m3",
    content: "Sir, I've been thinking about creating an online store. Can you guide me on the first steps?",
    timestamp: "2025-01-17T14:20:00",
  },
];
