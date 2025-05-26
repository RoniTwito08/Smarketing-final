import { useState, useEffect, useRef, useCallback, memo } from "react";
import styles from "./ChatModal.module.css";
import { User } from "../../types/user";
import { socketService } from "../../services/socket.service";
import { ChatMessage } from "./types";
import { getProfilePictureUrl } from "../../utils/imageUtils";
import { useNavigate } from 'react-router-dom';

interface ChatModalProps {
  token: string;
  currentUser: User;
  selectedUser?: User;
  onClose: () => void;
}

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
}

export const ChatModal = memo(
  ({ token, currentUser, selectedUser, onClose }: ChatModalProps) => {
    // Initialize messages from socketService if available
    const [messages, setMessages] = useState<Message[]>(() => {
      return (selectedUser && selectedUser._id) ? socketService.getChatMessages(selectedUser._id) : [];
    });
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<
      "connecting" | "connected" | "disconnected"
    >("connecting");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef(socketService.socket);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Handle typing
    const handleTyping = useCallback(() => {
      if (!selectedUser) return;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      socketRef.current?.emit("typing", {
        userId: currentUser._id,
        receiverId: selectedUser._id,
      });

      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit("stopTyping", {
          userId: currentUser._id,
          receiverId: selectedUser._id,
        });
      }, 3000);
    }, [selectedUser, currentUser._id]);

    // Handle typing events
    const handleTypingEvent = useCallback(
      (userId: string) => {
        if (selectedUser && userId === selectedUser._id) {
          setIsTyping(true);
          // Clear typing indicator after 3 seconds
          setTimeout(() => setIsTyping(false), 3000);
        }
      },
      [selectedUser]
    );

    // Handle online users updates
    const handleOnlineUsers = useCallback(
      (users: User[]) => {
        const filteredUsers = users.filter(
          (user) => user._id !== currentUser._id
        );
        setOnlineUsers(filteredUsers);
      },
      [currentUser._id]
    );

    // Handle receiving messages
    const handleReceiveMessage = useCallback(
      (chatMessage: ChatMessage) => {
        if (
          selectedUser &&
          ((chatMessage.senderId === currentUser._id &&
            chatMessage.recipientId === selectedUser._id) ||
            (chatMessage.senderId === selectedUser._id &&
              chatMessage.recipientId === currentUser._id))
        ) {
          const message: Message = {
            _id: chatMessage._id || "",
            sender: chatMessage.senderId,
            receiver: chatMessage.recipientId,
            content: chatMessage.content,
            timestamp: new Date(chatMessage.timestamp),
          };

          setMessages((prev) => {
            // Check if message already exists (either by ID or as a temp message)
            const isDuplicate = prev.some(m => 
              // Check if IDs match
              (message._id && m._id === message._id) ||
              // Or if it's a temp message with matching content and timestamp
              (m._id.startsWith('temp-') && 
               m.content === message.content && 
               m.sender === message.sender &&
               Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000)
            );

            if (isDuplicate) {
              return prev;
            }

            const newMessages = [...prev, message];
            if (selectedUser._id) {
              socketService.setChatMessages(selectedUser._id, newMessages);
            }
            return newMessages;
          });
        }
      },
      [currentUser._id, selectedUser]
    );

    // Handle chat history
    const handleChatHistory = useCallback(
      (history: ChatMessage[]) => {
        if (!selectedUser?._id) {
          console.warn("[ChatModal] No selected user, skipping chat history");
          return;
        }

        
        const formattedHistory = history
          .map((msg) => {
            const isRelevant =
              (msg.senderId === currentUser._id &&
                msg.recipientId === selectedUser._id) ||
              (msg.senderId === selectedUser._id &&
                msg.recipientId === currentUser._id);

            if (isRelevant) {
              return {
                _id: msg._id || "",
                sender: msg.senderId,
                receiver: msg.recipientId,
                content: msg.content,
                timestamp: new Date(msg.timestamp),
              };
            }
            return null;
          })
          .filter((msg) => msg !== null) as Message[];
        
        
        // Always update both state and cache with server data
        setMessages(formattedHistory);
        socketService.setChatMessages(selectedUser._id, formattedHistory);
      },
      [selectedUser, currentUser._id]
    );

    // Add a new function to fetch history
    // const fetchChatHistory = useCallback(async () => {
    //   if (!selectedUser?._id || !currentUser._id) return;
      
    //   try {
        
    //     // Always request fresh data from server
    //     socketRef.current?.emit("getChatHistory", {
    //       userId: currentUser._id,
    //       partnerId: selectedUser._id,
    //     });
    //   } catch (error) {
    //     console.error("[ChatModal] Failed to fetch chat history:", error);
    //     setError("Failed to load chat history");
    //   }
    // }, [selectedUser?._id, currentUser._id]);

    // Socket connection effect
    useEffect(() => {
      if (!token || !selectedUser) {
        return;
      }

      const cleanToken = token.replace('Bearer ', '');
      
      try {
        socketService.connect(cleanToken);
        const socket = socketService.socket;

        if (!socket) {
          setError('Failed to establish chat connection');
          return;
        }

        // Remove any existing handlers first
        socketService.removeAllHandlers();

        // Set up event handlers
        const messageCleanup = socketService.onMessage(handleReceiveMessage);
        const typingCleanup = socketService.onTyping(handleTypingEvent);
        const onlineUsersCleanup = socketService.onOnlineUsers(handleOnlineUsers);
        const chatHistoryCleanup = socketService.onChatHistory(handleChatHistory);

        socket.on('connect', () => {
          setConnectionStatus('connected');
          setError(null);
          socket.emit("getChatHistory", {
            userId: currentUser._id,
            partnerId: selectedUser._id,
          });
        });

        // If already connected, fetch immediately
        if (socket.connected) {
          socket.emit("getChatHistory", {
            userId: currentUser._id,
            partnerId: selectedUser._id,
          });
        }

        // Clean up function
        return () => {
          messageCleanup();
          typingCleanup();
          onlineUsersCleanup();
          chatHistoryCleanup();
          socket.off('connect');
          socket.off('disconnect');
          socket.off('connect_error');
        };
      } catch (error) {
        console.error('[ChatModal] Socket setup error:', error);
        setError('Failed to setup chat connection');
      }
    }, [token, selectedUser, currentUser._id, handleReceiveMessage, handleTypingEvent, handleOnlineUsers, handleChatHistory]);

    // Scroll effect
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle sending messages
    const handleSendMessage = useCallback(() => {
      if (!newMessage.trim() || !selectedUser) return;

      const now = new Date();
      const message = {
        senderId: currentUser._id,
        recipientId: selectedUser._id,
        content: newMessage,
        timestamp: now,
      };

      socketRef.current?.emit("private_message", message);

      const tempMessage: Message = {
        _id: `temp-${now.getTime()}`,
        sender: currentUser._id || "",
        receiver: selectedUser._id || "",
        content: newMessage,
        timestamp: now,
      };

      setMessages((prev) => {
        return [...prev, tempMessage];
      });
      setNewMessage("");
    }, [newMessage, selectedUser, currentUser._id]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        handleTyping();
      },
      [handleTyping]
    );

    const handleCloseChat = useCallback(() => {
      // Clear the messages when closing
      setMessages([]);
      // Call the parent's onClose handler
      onClose();
      // Navigate to /chats to remount the component
      navigate('/profile');
    }, [onClose, navigate]);

    if (error) {
      return <div className={styles.error}>{error}</div>;
    }

    return (
      <div className={styles.chatModal}>
        <div className={styles.header}>
          <div className={styles.selectedUserInfo}>
            <img
              src={getProfilePictureUrl(selectedUser?.profilePicture)}
              alt={selectedUser?.fullName || selectedUser?.email}
              className={styles.userAvatar}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/40x40";
              }}
            />
            <div className={styles.userDetails}>
              <h2>{selectedUser?.fullName || selectedUser?.email}</h2>
              <span className={styles.userEmail}>{selectedUser?.email}</span>
              <span className={styles.onlineStatus}>
                {onlineUsers.some((u) => u._id === selectedUser?._id)
                  ? "מחובר"
                  : "לא מחובר"}
              </span>
            </div>
          </div>
          <button onClick={handleCloseChat} className={styles.closeButton}>
            ✕
          </button>
        </div>

        {connectionStatus === "disconnected" && (
          <div className={styles.connectionError}>
            מתנתק מהשרת... מנסה להתחבר מחדש
          </div>
        )}

        <div className={styles.messageList}>
          {messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`${styles.message} ${
                message.sender === currentUser._id
                  ? styles.sent
                  : styles.received
              }`}
            >
              <p>{message.content}</p>
              <span className={styles.timestamp}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className={styles.typingIndicator}>
              {selectedUser?.fullName} מקליד...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="הקלד הודעה..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>שלח</button>
        </div>
      </div>
    );
  }
);

ChatModal.displayName = "ChatModal";
