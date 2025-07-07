"use client";

import { adminChatApi } from "@/actions/chat";
import { ChatConversation, ChatMessage } from "@/utils/types";
import { useState, useEffect, useCallback } from "react";

export function useAdminChat() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all conversations (admin can see all)
  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminChatApi.getConversations();
      console.log("Loaded admin conversations:", data);
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load specific conversation with messages
  const loadConversation = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      console.log("Loading conversation with ID:", id);
      const conversation = await adminChatApi.getConversation(id);
      console.log("Loaded conversation:", conversation);

      setCurrentConversation(conversation);
      setMessages(conversation.messages || []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversation"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send message as admin
  const sendMessage = useCallback(
    async (message: string) => {
      console.log("Admin sending message:", { message, currentConversation });

      if (!currentConversation) {
        const error = "No current conversation selected";
        console.error(error);
        setError(error);
        throw new Error(error);
      }

      if (!currentConversation.id) {
        const error = "Current conversation has no ID";
        console.error(error, currentConversation);
        setError(error);
        throw new Error(error);
      }

      try {
        console.log(
          "Sending admin message to conversation ID:",
          currentConversation.id
        );
        const newMessage = await adminChatApi.sendMessage(
          currentConversation.id,
          message
        );
        console.log("Admin message sent successfully:", newMessage);

        setMessages((prev) => [...prev, newMessage]);
        setError(null);

        // Update conversation in list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentConversation.id
              ? {
                  ...conv,
                  last_message: {
                    id: newMessage.id,
                    conversation: newMessage.conversation,
                    message: newMessage.message,
                    created_at: newMessage.created_at,
                    is_admin: newMessage.is_admin,
                    is_read: newMessage.is_read,
                    sender: newMessage.sender,
                  },
                  last_message_at: newMessage.created_at,
                }
              : conv
          )
        );

        return newMessage;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send message";
        console.error("Send admin message error:", err);
        setError(errorMessage);
        throw err;
      }
    },
    [currentConversation]
  );

  // Update conversation status (admin only)
  const updateConversationStatus = useCallback(
    async (conversationId: number, status: "active" | "closed" | "pending") => {
      try {
        console.log("Updating conversation status:", {
          conversationId,
          status,
        });
        await adminChatApi.updateConversationStatus(conversationId, status);

        // Update local state
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId ? { ...conv, status } : conv
          )
        );

        if (currentConversation && currentConversation.id === conversationId) {
          setCurrentConversation((prev) => (prev ? { ...prev, status } : null));
        }

        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update conversation status";
        console.error("Update conversation status error:", err);
        setError(errorMessage);
        throw err;
      }
    },
    [currentConversation]
  );

  // Mark conversation as read (admin)
  const markAsRead = useCallback(
    async (conversationId?: number) => {
      const id = conversationId || currentConversation?.id;
      if (!id) {
        console.warn("No conversation ID provided for markAsRead");
        return;
      }

      try {
        console.log("Admin marking conversation as read:", id);
        await adminChatApi.markAsRead(id);

        // Update local state
        if (currentConversation && currentConversation.id === id) {
          setCurrentConversation((prev) =>
            prev ? { ...prev, unread_count_admin: 0 } : null
          );
        }

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === id ? { ...conv, unread_count_admin: 0 } : conv
          )
        );
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    },
    [currentConversation]
  );

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    loadConversations,
    loadConversation,
    sendMessage,
    updateConversationStatus,
    markAsRead,
    setCurrentConversation,
    setError,
  };
}
