"use client";

import React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Search,
  AlertCircle,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminChat } from "@/hooks/chat/websocket/useSocketAdminChat";
import { truncateString } from "@/utils/truncate";

interface Message {
  id: number;
  sender: any;
  message: string;
  is_admin: boolean;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: number;
  user: any;
  admin?: any;
  subject: string;
  status: "active" | "closed" | "pending";
  unread_count_admin: number;
  unread_count_user: number;
  last_message?: {
    message: string;
    created_at: string;
    is_admin: boolean;
    sender: any;
  };
  last_message_at: string;
  created_at: string;
  messages?: Message[];
}

type StatusFilter = "all" | "active" | "closed" | "pending";

// Move ChatArea outside to prevent recreation
const ChatArea: React.FC<{
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isConnected: boolean;
  isMobile: boolean;
  isSending: boolean;
  newMessage: string;
  setNewMessage: (value: string) => void;
  setShowMobileChat: (value: boolean) => void;
  handleSendMessage: () => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCloseChat: () => Promise<void>;
  updateConversationStatus: (
    id: number,
    status: "active" | "closed" | "pending"
  ) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}> = React.memo(
  ({
    currentConversation,
    messages,
    isLoading,
    isConnected,
    isMobile,
    isSending,
    newMessage,
    setNewMessage,
    setShowMobileChat,
    handleSendMessage,
    handleKeyPress,
    handleCloseChat,
    inputRef,
    messagesEndRef,
  }) => {
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
      },
      [setNewMessage]
    );

    const formatTime = (timestamp: string): string => {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const getInitials = (fullName?: string): string => {
      if (!fullName) return "U";
      const names = fullName.trim().split(" ");
      if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
      }
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(
        0
      )}`.toUpperCase();
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case "active":
          return "default";
        case "pending":
          return "secondary";
        case "closed":
          return "outline";
        default:
          return "secondary";
      }
    };

    return (
      <div className="flex-1 flex flex-col h-full">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-start md:justify-between lg:flex-row flex-col">
                <div className="flex items-center gap-3 w-full justify-start">
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMobileChat(false)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(currentConversation.user.full_name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">
                        {currentConversation.user.full_name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {truncateString(
                          currentConversation.user.full_name || "",
                          15
                        )}
                      </span>
                      {isConnected ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <Wifi className="w-3 h-3" />
                          Connected
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <WifiOff className="w-3 h-3" />
                          Connecting...
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {currentConversation.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-2 w-full">
                  <Badge variant={getStatusColor(currentConversation.status)}>
                    {currentConversation.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCloseChat}
                    disabled={currentConversation.status === "closed"}
                  >
                    {currentConversation.status === "closed"
                      ? "Closed"
                      : "Close Chat"}
                  </Button>
                </div>
              </div>
              {currentConversation.subject && (
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Subject:</strong> {currentConversation.subject}
                </p>
              )}
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {isLoading && messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Loading messages...
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.is_admin ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "flex gap-2 max-w-[80%]",
                            message.is_admin ? "flex-row-reverse" : ""
                          )}
                        >
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback
                              className={cn(
                                "text-xs",
                                message.is_admin
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {message.is_admin
                                ? "A"
                                : getInitials(message.sender.full_name || "")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              "p-3 rounded-lg",
                              message.is_admin
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.message}
                            </p>
                            <div className="flex items-center justify-between mt-2 gap-2">
                              <p
                                className={cn(
                                  "text-xs",
                                  message.is_admin
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                )}
                              >
                                {message.sender.full_name} •{" "}
                                {formatTime(message.created_at)}
                              </p>
                              {message.is_admin && message.is_read && (
                                <CheckCircle2 className="h-3 w-3 text-primary-foreground/70" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>
            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={
                    currentConversation.status === "closed" ||
                    isSending ||
                    !isConnected
                  }
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    isSending ||
                    !newMessage.trim() ||
                    currentConversation.status === "closed"
                  }
                  size="sm"
                >
                  {isSending ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {!isConnected && (
                <p className="text-xs text-muted-foreground mt-2">
                  Reconnecting... Messages will be sent when connection is
                  restored.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-semibold mb-2">Select a conversation</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Choose a conversation from the list to start chatting with
                customers
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ChatArea.displayName = "ChatArea";

const AdminSupportChat: React.FC = () => {
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    isConnected,
    loadConversations,
    loadConversation,
    sendMessage,
    updateConversationStatus,
    markAsRead,
    setError,
  } = useAdminChat();

  const [newMessage, setNewMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showMobileChat, setShowMobileChat] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null!);
  const inputRef = useRef<HTMLInputElement>(null!);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Add this useEffect after the mobile check useEffect
  useEffect(() => {
    // Poll for new conversations every 3 seconds
    const pollInterval = setInterval(async () => {
      try {
        await loadConversations();
      } catch (error) {
        console.error("Error polling for new conversations:", error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [loadConversations]);

  // Also add a manual refresh function
  const handleRefreshConversations = useCallback(async () => {
    try {
      await loadConversations();
    } catch (error) {
      console.error("Error refreshing conversations:", error);
    }
  }, [loadConversations]);

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      !searchTerm ||
      conv.user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.subject?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || conv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when conversation is selected
  useEffect(() => {
    if (currentConversation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentConversation]);

  const handleConversationSelect = useCallback(
    async (conversation: Conversation): Promise<void> => {
      try {
        await loadConversation(conversation.id);
        if (isMobile) {
          setShowMobileChat(true);
        }
        // Mark as read for admin
        await markAsRead(conversation.id);
      } catch (error) {
        console.error("Error selecting conversation:", error);
      }
    },
    [loadConversation, isMobile, markAsRead]
  );

  const handleSendMessage = useCallback(async (): Promise<void> => {
    if (!newMessage.trim() || !currentConversation || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  }, [newMessage, currentConversation, isSending, sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleCloseChat = useCallback(async (): Promise<void> => {
    if (!currentConversation) return;

    try {
      await updateConversationStatus(currentConversation.id, "closed");
    } catch (error) {
      console.error("Error closing chat:", error);
    }
  }, [currentConversation, updateConversationStatus]);

  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (fullName?: string): string => {
    if (!fullName) return "U";

    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return `${names[0].charAt(0)}${names[names.length - 1].charAt(
      0
    )}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "closed":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Error display
  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-2 bg-transparent"
              onClick={() => setError(null)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const ConversationsList: React.FC = () => (
    <div className="h-full flex flex-col">
      {/* Header with search and filters */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Support Chat
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshConversations}
              disabled={isLoading}
            >
              <RefreshCw
                className={cn("w-4 h-4", isLoading && "animate-spin")}
              />
            </Button>
            <Badge variant="outline" className="text-xs">
              {filteredConversations.length} conversations
            </Badge>
          </div>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* Status Filter */}
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "closed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("closed")}
          >
            Closed
          </Button>
        </div>
      </div>
      {/* Conversations List */}
      <ScrollArea className="flex-1">
        {isLoading && conversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                currentConversation?.id === conversation.id &&
                  "bg-muted border-l-4 border-l-primary"
              )}
              onClick={() => handleConversationSelect(conversation)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage
                      src={
                        conversation.user.profile_pic || "/assets/default.jpg"
                      }
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(conversation.user.full_name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {conversation.user.full_name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(conversation.last_message_at)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant={getStatusColor(conversation.status)}
                      className="text-xs px-2 py-0"
                    >
                      {conversation.status}
                    </Badge>
                    {conversation.unread_count_admin > 0 && (
                      <Badge
                        variant="destructive"
                        className="text-xs px-2 py-0"
                      >
                        {conversation.unread_count_admin}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {conversation.subject && (
                <p className="text-sm font-medium mb-2 truncate">
                  {conversation.subject}
                </p>
              )}
              {conversation.last_message && (
                <p className="text-xs text-muted-foreground truncate">
                  {conversation.last_message.is_admin ? "You: " : ""}
                  {conversation.last_message.message}
                </p>
              )}
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Created {formatDate(conversation.created_at)}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(conversation.last_message_at)}
                </span>
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );

  // Mobile layout
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col">
        <Card className="flex-1 rounded-none border-0">
          <CardContent className="p-0 h-full">
            {!showMobileChat ? (
              <ConversationsList />
            ) : (
              <ChatArea
                currentConversation={currentConversation}
                messages={messages}
                isLoading={isLoading}
                isConnected={isConnected}
                isMobile={isMobile}
                isSending={isSending}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                setShowMobileChat={setShowMobileChat}
                handleSendMessage={handleSendMessage}
                handleKeyPress={handleKeyPress}
                handleCloseChat={handleCloseChat}
                updateConversationStatus={updateConversationStatus}
                inputRef={inputRef}
                messagesEndRef={messagesEndRef}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="h-screen p-4">
      <Card className="h-full">
        <CardContent className="p-0 h-full">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-96 border-r">
              <ConversationsList />
            </div>
            {/* Chat Area */}
            <ChatArea
              currentConversation={currentConversation}
              messages={messages}
              isLoading={isLoading}
              isConnected={isConnected}
              isMobile={isMobile}
              isSending={isSending}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              setShowMobileChat={setShowMobileChat}
              handleSendMessage={handleSendMessage}
              handleKeyPress={handleKeyPress}
              handleCloseChat={handleCloseChat}
              updateConversationStatus={updateConversationStatus}
              inputRef={inputRef}
              messagesEndRef={messagesEndRef}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSupportChat;
