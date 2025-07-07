interface WebSocketMessage {
  type: "message" | "typing" | "stop_typing";
  message?: string;
  user_id?: number;
  user_name?: string;
}

interface WebSocketCallbacks {
  onMessage?: (message: any) => void;
  onTyping?: (data: {
    user_id: number;
    user_name: string;
    is_typing: boolean;
  }) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

const API_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

class ChatWebSocket {
  private ws: WebSocket | null = null;
  private callbacks: WebSocketCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private shouldReconnect = true;
  private conversationId: number | null = null;
  private currentUserId: number | null = null;
  private currentUserName: string | null = null;

  constructor() {}

  connect(
    conversationId: number,
    userId: number,
    userName: string,
    callbacks: WebSocketCallbacks = {},
    token?: string
  ) {
    // Close existing connection if switching conversations
    if (this.conversationId !== conversationId) {
      this.disconnect();
    }

    if (
      this.isConnecting ||
      (this.ws && this.ws.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    this.conversationId = conversationId;
    this.currentUserId = userId;
    this.currentUserName = userName;
    this.callbacks = callbacks;
    this.isConnecting = true;
    this.shouldReconnect = true;

    const query = token ? `?token=${token}` : "";
    const wsUrl = `${API_URL}/chat/${conversationId}/${query}`;
    console.log("Connecting to WebSocket:", wsUrl);

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected to conversation:", conversationId);
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.callbacks.onConnect?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);

          // Handle different message types
          if (data.type === "typing") {
            this.callbacks.onTyping?.({
              user_id: data.user_id,
              user_name: data.user_name,
              is_typing: true,
            });
          } else if (data.type === "stop_typing") {
            this.callbacks.onTyping?.({
              user_id: data.user_id,
              user_name: data.user_name,
              is_typing: false,
            });
          } else {
            // Regular message
            this.callbacks.onMessage?.(data);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        this.isConnecting = false;
        this.callbacks.onDisconnect?.();

        if (
          this.shouldReconnect &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.reconnectAttempts++;
          console.log(
            `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
          );

          setTimeout(() => {
            if (
              this.conversationId &&
              this.currentUserId &&
              this.currentUserName
            ) {
              this.connect(
                this.conversationId,
                this.currentUserId,
                this.currentUserName,
                this.callbacks
              );
            }
          }, this.reconnectDelay * this.reconnectAttempts);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
        this.callbacks.onError?.(error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.isConnecting = false;
    }
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.conversationId = null;
    this.currentUserId = null;
    this.currentUserName = null;
  }

  sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "message",
          message: message,
        })
      );
    } else {
      console.warn("WebSocket not connected, cannot send message");
    }
  }

  sendTyping() {
    if (
      this.ws &&
      this.ws.readyState === WebSocket.OPEN &&
      this.currentUserId &&
      this.currentUserName
    ) {
      this.ws.send(
        JSON.stringify({
          type: "typing",
          user_id: this.currentUserId,
          user_name: this.currentUserName,
        })
      );
    }
  }

  sendStopTyping() {
    if (
      this.ws &&
      this.ws.readyState === WebSocket.OPEN &&
      this.currentUserId &&
      this.currentUserName
    ) {
      this.ws.send(
        JSON.stringify({
          type: "stop_typing",
          user_id: this.currentUserId,
          user_name: this.currentUserName,
        })
      );
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getCurrentConversationId(): number | null {
    return this.conversationId;
  }
}

export default ChatWebSocket;
