"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MessageCircle,
  Send,
  Headphones,
  Plus,
  CheckCircle2,
  Minimize2,
  Maximize2,
  X,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/chat/websocket/useSocketChat";

export default function SupportChat() {
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    isConnected,
    typingUsers,
    loadConversation,
    createConversation,
    sendMessage,
    handleTyping,
    setCurrentConversation,
    setError,
  } = useChat();

  const [newMessage, setNewMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [showNewChatForm, setShowNewChatForm] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when conversation starts
  useEffect(() => {
    if (currentConversation && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [currentConversation, isMinimized]);

  // Check for existing active conversation on mount (only if not manually closed)
  useEffect(() => {
    if (isClosed) return;

    const activeConversation = (
      Array.isArray(conversations) ? conversations : []
    )?.find((conv) => conv.status === "active");
    if (activeConversation && !currentConversation) {
      loadConversation(activeConversation.id);
    }
  }, [conversations, currentConversation, loadConversation, isClosed]);

  const handleStartNewChat = async () => {
    if (!subject.trim()) return;

    try {
      setIsClosed(false);
      await createConversation(subject.trim());
      setSubject("");
      setShowNewChatForm(false);
    } catch (err) {
      // Error is handled by the hook
      console.error("Failed to create new conversation", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentConversation || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(newMessage.trim());
      setNewMessage("");
    } catch (err) {
      // Error is handled by the hook
      console.error("Failed to send message", err)
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showNewChatForm) {
        handleStartNewChat();
      } else {
        handleSendMessage();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    handleTyping(); // Send typing indicator
  };

  const handleCloseChat = () => {
    setIsClosed(true);
    setCurrentConversation(null);
    setIsMinimized(false);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return formatTime(dateString);
    } else if (diffInHours < 48) {
      return `Yesterday ${formatTime(dateString)}`;
    } else {
      return date.toLocaleDateString();
    }
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

  const getInitials = (fullName?: string) => {
    if (!fullName) return "U";
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(
      0
    )}`.toUpperCase();
  };

  // Error display
  if (error) {
    return (
      <div className="max-w-md mx-auto">
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
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Welcome screen
  if (!currentConversation && !showNewChatForm) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <Headphones className="w-8 h-8 text-primary-foreground" />
                </div>
                <div
                  className={cn(
                    "absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center",
                    isConnected ? "bg-green-500" : "bg-red-500"
                  )}
                >
                  {isConnected ? (
                    <Wifi className="w-3 h-3 text-white" />
                  ) : (
                    <WifiOff className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl">Customer Support</CardTitle>
            <p className="text-muted-foreground">
              We&apos;re here to help you 24/7
              {isConnected ? " • Connected" : " • Connecting..."}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold">Average Response</div>
                <div className="text-muted-foreground">&lt; 2 minutes</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-semibold">Satisfaction Rate</div>
                <div className="text-muted-foreground">98.5%</div>
              </div>
            </div>

            {/* Show existing conversations if any */}
            {conversations.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Recent Conversations</h3>
                {conversations.slice(0, 3).map((conv) => (
                  <Button
                    key={conv.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 bg-transparent"
                    onClick={() => {
                      setIsClosed(false);
                      loadConversation(conv.id);
                    }}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{conv.subject}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(conv.last_message_at)}
                      </div>
                    </div>
                    {conv.unread_count_user > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {conv.unread_count_user}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            )}

            <Button
              onClick={() => setShowNewChatForm(true)}
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start New Conversation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // New chat form
  if (showNewChatForm) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>New Support Request</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewChatForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">What can we help you with?</Label>
              <Textarea
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Describe your issue or question..."
                className="min-h-[100px] resize-none"
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleStartNewChat}
              disabled={isLoading || !subject.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Start Chat
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="max-w-4xl mx-auto">
      <Card
        className={cn(
          "flex flex-col transition-all duration-300",
          isMinimized ? "h-16" : "h-[700px]"
        )}
      >
        {/* Header */}
        <CardHeader className="border-b flex-shrink-0">
          <div className="flex sm:items-center sm:justify-between sm:flex-row flex-col-reverse gap-2 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={
                      currentConversation?.admin?.profile_pic ||
                      "/assets/default.jpg"
                    }
                  />
                  <AvatarFallback>
                    {currentConversation?.admin
                      ? getInitials(currentConversation.admin.full_name || "")
                      : "S"}
                  </AvatarFallback>
                </Avatar>
                {currentConversation?.admin && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold line-clamp-1">
                  {currentConversation?.subject}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {currentConversation?.admin ? (
                    <span>{currentConversation.admin.full_name}</span>
                  ) : (
                    <span>Waiting for agent...</span>
                  )}
                  {currentConversation?.admin && (
                    <span className="text-green-600">• Online</span>
                  )}
                  {isConnected ? (
                    <span className="text-green-600">• Connected</span>
                  ) : (
                    <span className="text-red-600">• Connecting...</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Badge
                variant={getStatusColor(
                  currentConversation?.status || "active"
                )}
              >
                {currentConversation?.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCloseChat}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages - Fixed height container */}
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
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Start the conversation by sending a message
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isUser = !message.is_admin;
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3 max-w-[85%]",
                            isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                          )}
                        >
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage
                              src={
                                isUser
                                  ? undefined
                                  : currentConversation?.admin?.profile_pic ??
                                    undefined
                              }
                            />
                            <AvatarFallback className="text-xs">
                              {isUser
                                ? "You"
                                : currentConversation?.admin
                                ? getInitials(
                                    currentConversation.admin.full_name ??
                                      undefined
                                  )
                                : "S"}
                            </AvatarFallback>
                          </Avatar>

                          <div
                            className={cn(
                              "flex flex-col",
                              isUser ? "items-end" : "items-start"
                            )}
                          >
                            <div
                              className={cn(
                                "rounded-2xl px-4 py-2 max-w-full break-words",
                                isUser
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              )}
                            >
                              <p className="text-sm leading-relaxed">
                                {message.message}
                              </p>
                            </div>
                            <div
                              className={cn(
                                "flex items-center gap-1 mt-1 text-xs text-muted-foreground",
                                isUser ? "flex-row-reverse" : ""
                              )}
                            >
                              <span>{formatDate(message.created_at)}</span>
                              {isUser && message.is_read && (
                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Typing indicator */}
                  {typingUsers.size > 0 && (
                    <div className="flex gap-3 max-w-[85%] mr-auto">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="text-xs">S</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-2xl px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Input - Fixed at bottom */}
            <div className="border-t p-4 flex-shrink-0">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={isSending || !isConnected}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending || !isConnected}
                >
                  {isSending ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
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
        )}
      </Card>
    </div>
  );
}
