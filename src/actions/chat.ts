import api from "@/api";
import {
  ChatConversation,
  ChatConversationList,
  ChatMessage,
} from "@/utils/types";

export const chatApi = {
  // Get all conversations for current user
  getConversations: async (): Promise<ChatConversationList[]> => {
    const { data } = await api.get("/support/chat/conversations/");

    return data;
  },

  // Get specific conversation with messages
  getConversation: async (id: number): Promise<ChatConversation> => {
    const { data } = await api.get(`/support/chat/conversations/${id}/`);

    return data;
  },

  // Create new conversation
  createConversation: async (subject: string): Promise<ChatConversation> => {
    const { data } = await api.post("/support/chat/conversations/", {
      subject,
    });

    return data;
  },

  // Send message in conversation
  sendMessage: async (
    conversationId: number,
    message: string
  ): Promise<ChatMessage> => {
    const { data } = await api.post(
      `/support/chat/conversations/${conversationId}/send_message/`,
      {
        message,
      }
    );

    return data;
  },

  // Mark conversation as read
  markAsRead: async (conversationId: number): Promise<{ status: string }> => {
    const { data } = await api.post(
      `/support/chat/conversations/${conversationId}/mark_as_read/`
    );

    return data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<{ unread_count: number }> => {
    const { data } = await api.get("/support/chat/conversations/unread_count/");

    return data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId: number): Promise<ChatMessage[]> => {
    const { data } = await api(
      `chat/messages/?conversation_id=${conversationId}`
    );

    return data;
  },
};

export const adminChatApi = {
  // Get all conversations (admin can see all)
  getConversations: async (): Promise<ChatConversation[]> => {
    const { data } = await api.get("/support/chat/conversations/");

    return data;
  },

  // Get specific conversation with messages
  getConversation: async (id: number): Promise<ChatConversation> => {
    if (!id || isNaN(id)) {
      throw new Error(`Invalid conversation ID: ${id}`);
    }
    const { data } = await api.get(`/support/chat/conversations/${id}/`);

    return data;
  },

  // Send message in conversation (as admin)
  sendMessage: async (
    conversationId: number,
    message: string
  ): Promise<ChatMessage> => {
    if (!conversationId || isNaN(conversationId)) {
      throw new Error(`Invalid conversation ID: ${conversationId}`);
    }

    if (!message || !message.trim()) {
      throw new Error("Message cannot be empty");
    }

    console.log("Sending admin message API call:", { conversationId, message });

    const { data } = await api.post(
      `/support/chat/conversations/${conversationId}/send_message/`,
      {
        message: message.trim(),
      }
    );

    return data;
  },

  // Update conversation status (admin only)
  updateConversationStatus: async (
    conversationId: number,
    status: "active" | "closed" | "pending"
  ): Promise<ChatConversation> => {
    if (!conversationId || isNaN(conversationId)) {
      throw new Error(`Invalid conversation ID: ${conversationId}`);
    }

    const { data } = await api.patch(
      `/support/chat/conversations/${conversationId}/update_status/`,
      {
        status,
      }
    );

    return data;
  },

  // Mark conversation as read (admin)
  markAsRead: async (conversationId: number): Promise<{ status: string }> => {
    if (!conversationId || isNaN(conversationId)) {
      throw new Error(`Invalid conversation ID: ${conversationId}`);
    }

    const { data } = await api.post(
      `/support/chat/conversations/${conversationId}/mark_as_read/`
    );

    return data;
  },

  // Get admin statistics
  getStats: async (): Promise<{
    total_conversations: number;
    active_conversations: number;
    pending_conversations: number;
    total_unread: number;
  }> => {
    const { data } = await api.get("/support/chat/admin/stats/");

    return data;
  },
};
