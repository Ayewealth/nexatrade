"use client";

import ChatWebSocket from "@/lib/websocket/chatWebsocket";
import { ChatConversation, ChatMessage } from "@/utils/types";
import { useState, useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";
import { useAppSelector } from "@/lib/redux/store";
import { adminChatApi } from "@/actions/chat";

export function useAdminChat() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Map<number, string>>(
    new Map()
  );

  const wsRef = useRef<ChatWebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { userInfo } = useAppSelector((state) => state.auth);

  // Get auth token
  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return Cookies.get("nexatrade-access") || "";
    }
    return "";
  }, []);

  // Get current admin user info
  const getCurrentUser = useCallback(() => {
    const user = userInfo.userData;
    return {
      id: user.id,
      name: user.full_name,
    };
  }, [userInfo.userData]);

  // Initialize WebSocket instance
  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new ChatWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
        wsRef.current = null;
      }
    };
  }, []);

  // Handle WebSocket message
  const handleWebSocketMessage = useCallback(
    (messageData: any) => {
      console.log("New message received via WebSocket (Admin):", messageData);

      // Add message to current conversation if it matches
      if (
        currentConversation &&
        messageData.conversation === currentConversation.id
      ) {
        setMessages((prev) => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some((m) => m.id === messageData.id);
          if (exists) return prev;
          return [...prev, messageData];
        });
      }

      // Update conversations list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === messageData.conversation
            ? {
                ...conv,
                last_message: {
                  ...messageData,
                },
                last_message_at: messageData.created_at,
                unread_count_admin: !messageData.is_admin
                  ? conv.unread_count_admin + 1
                  : conv.unread_count_admin,
              }
            : conv
        )
      );
    },
    [currentConversation]
  );

  // Handle typing indicator
  const handleTypingIndicator = useCallback(
    (data: { user_id: number; user_name: string; is_typing: boolean }) => {
      console.log("Typing indicator (Admin):", data);

      const currentUser = getCurrentUser();
      // Don't show typing indicator for current admin
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
    [getCurrentUser]
  );

  // Connect to WebSocket when conversation changes
  useEffect(() => {
    if (!currentConversation || !wsRef.current) return;

    const currentUser = getCurrentUser();
    const token = getAuthToken();

    console.log(
      "Connecting to WebSocket for conversation:",
      currentConversation.id
    );

    wsRef.current.connect(
      currentConversation.id,
      currentUser.id,
      currentUser.name,
      {
        onConnect: () => {
          console.log("Admin WebSocket connected");
          setIsConnected(true);
          setError(null);
        },
        onDisconnect: () => {
          console.log("Admin WebSocket disconnected");
          setIsConnected(false);
        },
        onError: (error) => {
          console.error("Admin WebSocket error:", error);
          setError("Connection error. Trying to reconnect...");
          setIsConnected(false);
        },
        onMessage: handleWebSocketMessage,
        onTyping: handleTypingIndicator,
      },
      token
    );

    return () => {
      // Don't disconnect on cleanup to allow connection persistence
      // The connection will be managed by the WebSocket class itself
    };
  }, [
    currentConversation,
    getCurrentUser,
    getAuthToken,
    handleWebSocketMessage,
    handleTypingIndicator,
  ]);
  

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

        // Stop typing indicator
        if (wsRef.current && wsRef.current.isConnected()) {
          wsRef.current.sendStopTyping();
        }

        // Send via WebSocket first for real-time delivery
        if (wsRef.current && wsRef.current.isConnected()) {
          wsRef.current.sendMessage(message);
        }

        // Also send via API for persistence
        // Uncomment when API is implemented
        const newMessage = await adminChatApi.sendMessage(
          currentConversation.id,
          message
        );

        setError(null);
        return true;
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

        // Uncomment when API is implemented
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

        // Uncomment when API is implemented
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

  // Load all conversations (admin can see all)
  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);

      // Uncomment when API is implemented
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

      // Uncomment when API is implemented
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
    sendMessage,
    updateConversationStatus,
    markAsRead,
    handleTyping,
    setCurrentConversation,
    setError,
    setConversations,
    setMessages,
  };
}
