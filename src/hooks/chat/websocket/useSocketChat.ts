"use client";

import { chatApi } from "@/actions/chat";
import { useAppSelector } from "@/lib/redux/store";
import ChatWebSocket from "@/lib/websocket/chatWebsocket";
import {
  ChatConversation,
  ChatConversationList,
  ChatMessage,
} from "@/utils/types";
import { useState, useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";

export function useChat() {
  const [conversations, setConversations] = useState<ChatConversationList[]>(
    []
  );
  const [currentConversation, setCurrentConversation] =
    useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Map<number, string>>(
    new Map()
  );
  const token = Cookies.get("nexatrade-access");

  const wsRef = useRef<ChatWebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentUserRef = useRef<{ id: number; name: string } | null>(null);
  const { userInfo } = useAppSelector((state) => state.auth);

  // Initialize WebSocket
  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new ChatWebSocket();
    }
  }, []);

  // Get current user info (you'll need to implement this based on your auth system)
  const getCurrentUser = useCallback(() => {
    const user = userInfo.userData;
    return {
      id: user.id,
      name: user.full_name,
    };
  }, [userInfo.userData]);

  // Connect to WebSocket when conversation changes
  useEffect(() => {
    if (!currentConversation || !wsRef.current) return;

    const currentUser = getCurrentUser();
    currentUserRef.current = currentUser;

    wsRef.current.connect(
      currentConversation.id,
      currentUser.id,
      currentUser.name,
      {
        onConnect: () => {
          console.log("WebSocket connected");
          setIsConnected(true);
          setError(null);
        },
        onDisconnect: () => {
          console.log("WebSocket disconnected");
          setIsConnected(false);
        },
        onError: (error) => {
          console.error("WebSocket error:", error);
          setError("Connection error. Trying to reconnect...");
          setIsConnected(false);
        },
        onMessage: (messageData) => {
          console.log("New message received:", messageData);

          // Add message to current conversation
          setMessages((prev) => {
            // Check if message already exists to avoid duplicates
            const exists = prev.some((m) => m.id === messageData.id);
            if (exists) return prev;
            return [...prev, messageData];
          });

          // Update conversations list
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === currentConversation.id
                ? {
                    ...conv,
                    last_message: {
                      message: messageData.message,
                      created_at: messageData.created_at,
                      is_admin: messageData.is_admin,
                      sender: messageData.sender.email,
                    },
                    last_message_at: messageData.created_at,
                    unread_count_user: messageData.is_admin
                      ? conv.unread_count_user + 1
                      : conv.unread_count_user,
                  }
                : conv
            )
          );
        },
        onTyping: (data) => {
          console.log("Typing indicator:", data);

          // Don't show typing indicator for current user
          if (data.user_id === currentUser.id) return;

          setTypingUsers((prev) => {
            const newMap = new Map(prev);
            if (data.is_typing) {
              newMap.set(data.user_id, data.user_name);
            } else {
              newMap.delete(data.user_id);
            }
            return newMap;
          });

          // Auto-clear typing indicator after 3 seconds
          if (data.is_typing) {
            setTimeout(() => {
              setTypingUsers((prev) => {
                const newMap = new Map(prev);
                newMap.delete(data.user_id);
                return newMap;
              });
            }, 3000);
          }
        },
      },
      token
    );

    return () => {
      // Don't disconnect on cleanup, let it persist
    };
  }, [currentConversation, getCurrentUser, token]);

  // Handle typing with debounce
  const handleTyping = useCallback(() => {
    if (!wsRef.current || !wsRef.current.isConnected()) return;

    wsRef.current.sendTyping();

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (wsRef.current && wsRef.current.isConnected()) {
        wsRef.current.sendStopTyping();
      }
    }, 1000);
  }, []);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await chatApi.getConversations();
      console.log("Loaded conversations:", data);
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
      console.log("Loading conversation with ID:", id);
      const conversation = await chatApi.getConversation(id);
      console.log("Loaded conversation:", conversation);

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
        console.log("Creating conversation with subject:", subject);
        const conversation = await chatApi.createConversation(subject);
        console.log("Created conversation:", conversation);

        if (!conversation || !conversation.id) {
          throw new Error("Invalid conversation response - missing ID");
        }

        setCurrentConversation(conversation);
        setMessages(conversation.messages || []);
        setError(null);

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
      if (!currentConversation) {
        throw new Error("No current conversation selected");
      }

      try {
        // Stop typing indicator
        if (wsRef.current && wsRef.current.isConnected()) {
          wsRef.current.sendStopTyping();
        }

        // Send via WebSocket for real-time delivery
        if (wsRef.current && wsRef.current.isConnected()) {
          wsRef.current.sendMessage(message);
        }

        // Also send via API for persistence (optional, depending on your backend setup)
        const newMessage = await chatApi.sendMessage(
          currentConversation.id,
          message
        );

        setError(null);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send message";
        console.error("Send message error:", err);
        setError(errorMessage);
        throw err;
      }
    },
    [currentConversation]
  );

  // Mark conversation as read
  const markAsRead = useCallback(
    async (conversationId?: number) => {
      const id = conversationId || currentConversation?.id;
      if (!id) {
        console.warn("No conversation ID provided for markAsRead");
        return;
      }

      try {
        console.log("Marking conversation as read:", id);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    isConnected,
    typingUsers,
    loadConversations,
    loadConversation,
    createConversation,
    sendMessage,
    markAsRead,
    handleTyping,
    setCurrentConversation,
    setError,
  };
}
