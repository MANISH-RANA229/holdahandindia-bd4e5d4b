import { API_CONFIG, ENDPOINTS } from "./apiConfig";
import { httpClient } from "./httpClient";
import { Message } from "@/data/types";
import { messages as staticMessages } from "@/data/messages";

export const messageService = {
  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    if (API_CONFIG.USE_STATIC_DATA) {
      return staticMessages.filter(
        (m) =>
          (m.senderId === userId1 && m.receiverId === userId2) ||
          (m.senderId === userId2 && m.receiverId === userId1)
      );
    }
    const res = await httpClient.get<Message[]>(
      ENDPOINTS.MESSAGES.CONVERSATION(userId1, userId2)
    );
    return res.data;
  },

  async send(message: Omit<Message, "id">): Promise<Message> {
    if (API_CONFIG.USE_STATIC_DATA) {
      return { ...message, id: `msg${Date.now()}` };
    }
    const res = await httpClient.post<Message>(ENDPOINTS.MESSAGES.SEND, {
      body: message,
    });
    return res.data;
  },
};
