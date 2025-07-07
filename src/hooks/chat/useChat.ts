"use client";

import { chatApi } from "@/actions/chat";
import {
  ChatConversation,
  ChatConversationList,
  ChatMessage,
} from "@/utils/types";
import { useState, useEffect, useCallback } from "react";

export function useChat() {
  const [conversations, setConversations] = useState<ChatConversationList[]>(
    []
  );
  const [currentConversation, setCurrentConversation] =
    useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await chatApi.getConversations();
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

  // Load specific conversation
  const loadConversation = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const conversation = await chatApi.getConversation(id);
      setCurrentConversation(conversation);
      setMessages(conversation.messages || []);
      setError(null);

      // Mark as read
      await chatApi.markAsRead(id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversation"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new conversation
  const createConversation = useCallback(
    async (subject: string) => {
      try {
        setIsLoading(true);
        const conversation = await chatApi.createConversation(subject);
        setCurrentConversation(conversation);
        setMessages(conversation.messages || []);
        setError(null);

        // Refresh conversations list
        await loadConversations();

        return conversation;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create conversation"
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadConversations]
  );

  // Send message
  const sendMessage = useCallback(
    async (message: string) => {
      if (!currentConversation) return;

      try {
        const newMessage = await chatApi.sendMessage(
          currentConversation.id,
          message
        );
        setMessages((prev) => [...prev, newMessage]);
        setError(null);

        // Update conversation in list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentConversation.id
              ? { ...conv, last_message_at: newMessage.created_at }
              : conv
          )
        );

        return newMessage;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        throw err;
      }
    },
    [currentConversation]
  );

  // Mark conversation as read
  const markAsRead = useCallback(
    async (conversationId?: number) => {
      const id = conversationId || currentConversation?.id;
      if (!id) return;

      try {
        await chatApi.markAsRead(id);

        // Update local state
        if (currentConversation && currentConversation.id === id) {
          setCurrentConversation((prev) =>
            prev ? { ...prev, unread_count_user: 0 } : null
          );
        }

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === id ? { ...conv, unread_count_user: 0 } : conv
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
    createConversation,
    sendMessage,
    markAsRead,
    setCurrentConversation,
    setError,
  };
}
