import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Chat, Message, StatusUpdate, Call, Community } from '../types';
import {
  users as initialUsers,
  chats as initialChats,
  messages as initialMessages,
  statusUpdates as initialStatusUpdates,
  calls as initialCalls,
  communities as initialCommunities,
  currentUser as initialCurrentUser,
} from '../data/mockData';

interface ChatContextType {
  currentUser: User;
  users: User[];
  chats: Chat[];
  messages: Message[];
  statusUpdates: StatusUpdate[];
  calls: Call[];
  communities: Community[];
  
  // Message operations
  sendMessage: (chatId: string, content: string, type?: Message['type'], mediaUrl?: string) => void;
  deleteMessage: (messageId: string, deleteForEveryone: boolean) => void;
  editMessage: (messageId: string, newContent: string) => void;
  starMessage: (messageId: string) => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  replyToMessage: (chatId: string, content: string, replyToId: string) => void;
  forwardMessage: (messageId: string, toChatIds: string[]) => void;
  
  // Chat operations
  createChat: (participantIds: string[], type: Chat['type'], name?: string) => string;
  pinChat: (chatId: string) => void;
  muteChat: (chatId: string) => void;
  archiveChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  markAsRead: (chatId: string) => void;
  
  // Status operations
  addStatus: (content: string, type: StatusUpdate['type'], backgroundColor?: string, mediaUrl?: string) => void;
  deleteStatus: (statusId: string) => void;
  viewStatus: (statusId: string) => void;
  
  // Call operations
  makeCall: (participantId: string, type: Call['type']) => void;
  endCall: (callId: string, duration: number) => void;
  
  // User operations
  updateProfile: (updates: Partial<User>) => void;
  blockUser: (userId: string) => void;
  
  // Group operations
  createGroup: (name: string, participantIds: string[], description?: string) => string;
  addParticipants: (chatId: string, participantIds: string[]) => void;
  removeParticipant: (chatId: string, participantId: string) => void;
  makeAdmin: (chatId: string, participantId: string) => void;
  removeAdmin: (chatId: string, participantId: string) => void;
  updateGroupInfo: (chatId: string, name?: string, description?: string, avatar?: string) => void;
  leaveGroup: (chatId: string) => void;
  
  // Community operations
  createCommunity: (name: string, description: string) => string;
  
  // Search
  searchChats: (query: string) => Chat[];
  searchMessages: (chatId: string, query: string) => Message[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(initialCurrentUser);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>(initialStatusUpdates);
  const [calls, setCalls] = useState<Call[]>(initialCalls);
  const [communities, setCommunities] = useState<Community[]>(initialCommunities);

  // Message operations
  const sendMessage = useCallback((chatId: string, content: string, type: Message['type'] = 'text', mediaUrl?: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      chatId,
      senderId: currentUser.id,
      content,
      timestamp: new Date(),
      status: 'sent',
      type,
      mediaUrl,
    };

    setMessages(prev => [...prev, newMessage]);
    
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: newMessage,
        };
      }
      return chat;
    }));

    // Simulate message delivery after 1 second
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);
  }, [currentUser.id]);

  const deleteMessage = useCallback((messageId: string, deleteForEveryone: boolean) => {
    if (deleteForEveryone) {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } else {
      // In a real app, this would mark the message as deleted for the current user only
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }
  }, []);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, isEdited: true }
        : msg
    ));
  }, []);

  const starMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isStarred: !msg.isStarred }
        : msg
    ));
  }, []);

  const reactToMessage = useCallback((messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.userId === currentUser.id);
        
        if (existingReaction) {
          // Remove reaction if same emoji, otherwise update
          if (existingReaction.emoji === emoji) {
            return {
              ...msg,
              reactions: reactions.filter(r => r.userId !== currentUser.id),
            };
          } else {
            return {
              ...msg,
              reactions: reactions.map(r => 
                r.userId === currentUser.id ? { ...r, emoji } : r
              ),
            };
          }
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...reactions, { userId: currentUser.id, emoji }],
          };
        }
      }
      return msg;
    }));
  }, [currentUser.id]);

  const replyToMessage = useCallback((chatId: string, content: string, replyToId: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      chatId,
      senderId: currentUser.id,
      content,
      timestamp: new Date(),
      status: 'sent',
      type: 'text',
      replyTo: replyToId,
    };

    setMessages(prev => [...prev, newMessage]);
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, lastMessage: newMessage } : chat
    ));
  }, [currentUser.id]);

  const forwardMessage = useCallback((messageId: string, toChatIds: string[]) => {
    const originalMessage = messages.find(msg => msg.id === messageId);
    if (!originalMessage) return;

    toChatIds.forEach(chatId => {
      const newMessage: Message = {
        ...originalMessage,
        id: `msg-${Date.now()}-${Math.random()}`,
        chatId,
        timestamp: new Date(),
        isForwarded: true,
        replyTo: undefined,
      };
      setMessages(prev => [...prev, newMessage]);
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, lastMessage: newMessage } : chat
      ));
    });
  }, [messages]);

  // Chat operations
  const createChat = useCallback((participantIds: string[], type: Chat['type'], name?: string): string => {
    const newChatId = `chat-${Date.now()}-${Math.random()}`;
    const newChat: Chat = {
      id: newChatId,
      type,
      name,
      participants: [currentUser.id, ...participantIds],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: new Date(),
      groupAdmins: type === 'group' ? [currentUser.id] : undefined,
    };

    setChats(prev => [newChat, ...prev]);
    return newChatId;
  }, [currentUser.id]);

  const pinChat = useCallback((chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
    ));
  }, []);

  const muteChat = useCallback((chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat
    ));
  }, []);

  const archiveChat = useCallback((chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, isArchived: !chat.isArchived } : chat
    ));
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    setMessages(prev => prev.filter(msg => msg.chatId !== chatId));
  }, []);

  const markAsRead = useCallback((chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ));
    setMessages(prev => prev.map(msg => 
      msg.chatId === chatId && msg.senderId !== currentUser.id
        ? { ...msg, status: 'read' }
        : msg
    ));
  }, [currentUser.id]);

  // Status operations
  const addStatus = useCallback((content: string, type: StatusUpdate['type'], backgroundColor?: string, mediaUrl?: string) => {
    const newStatus: StatusUpdate = {
      id: `status-${Date.now()}-${Math.random()}`,
      userId: currentUser.id,
      type,
      content,
      backgroundColor: backgroundColor || '#25D366',
      mediaUrl,
      timestamp: new Date(),
      views: [],
    };

    setStatusUpdates(prev => [newStatus, ...prev]);
  }, [currentUser.id]);

  const deleteStatus = useCallback((statusId: string) => {
    setStatusUpdates(prev => prev.filter(status => status.id !== statusId));
  }, []);

  const viewStatus = useCallback((statusId: string) => {
    setStatusUpdates(prev => prev.map(status => {
      if (status.id === statusId && !status.views.includes(currentUser.id)) {
        return {
          ...status,
          views: [...status.views, currentUser.id],
        };
      }
      return status;
    }));
  }, [currentUser.id]);

  // Call operations
  const makeCall = useCallback((participantId: string, type: Call['type']) => {
    const newCall: Call = {
      id: `call-${Date.now()}-${Math.random()}`,
      type,
      participantId,
      direction: 'outgoing',
      status: 'completed',
      timestamp: new Date(),
    };

    setCalls(prev => [newCall, ...prev]);
  }, []);

  const endCall = useCallback((callId: string, duration: number) => {
    setCalls(prev => prev.map(call => 
      call.id === callId ? { ...call, duration } : call
    ));
  }, []);

  // User operations
  const updateProfile = useCallback((updates: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  }, []);

  const blockUser = useCallback((userId: string) => {
    // In a real app, this would update the blocked users list
    console.log('Blocking user:', userId);
  }, []);

  // Group operations
  const createGroup = useCallback((name: string, participantIds: string[], description?: string): string => {
    const newChatId = `chat-${Date.now()}-${Math.random()}`;
    const newChat: Chat = {
      id: newChatId,
      type: 'group',
      name,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${name}`,
      participants: [currentUser.id, ...participantIds],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      groupAdmins: [currentUser.id],
      groupDescription: description,
      createdAt: new Date(),
    };

    setChats(prev => [newChat, ...prev]);
    return newChatId;
  }, [currentUser.id]);

  const addParticipants = useCallback((chatId: string, participantIds: string[]) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          participants: [...chat.participants, ...participantIds],
        };
      }
      return chat;
    }));
  }, []);

  const removeParticipant = useCallback((chatId: string, participantId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          participants: chat.participants.filter(id => id !== participantId),
        };
      }
      return chat;
    }));
  }, []);

  const makeAdmin = useCallback((chatId: string, participantId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId && chat.groupAdmins) {
        return {
          ...chat,
          groupAdmins: [...chat.groupAdmins, participantId],
        };
      }
      return chat;
    }));
  }, []);

  const removeAdmin = useCallback((chatId: string, participantId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId && chat.groupAdmins) {
        return {
          ...chat,
          groupAdmins: chat.groupAdmins.filter(id => id !== participantId),
        };
      }
      return chat;
    }));
  }, []);

  const updateGroupInfo = useCallback((chatId: string, name?: string, description?: string, avatar?: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          ...(name && { name }),
          ...(description && { groupDescription: description }),
          ...(avatar && { avatar }),
        };
      }
      return chat;
    }));
  }, []);

  const leaveGroup = useCallback((chatId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          participants: chat.participants.filter(id => id !== currentUser.id),
        };
      }
      return chat;
    }));
  }, [currentUser.id]);

  // Community operations
  const createCommunity = useCallback((name: string, description: string): string => {
    const newCommunityId = `community-${Date.now()}-${Math.random()}`;
    const newCommunity: Community = {
      id: newCommunityId,
      name,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${name}`,
      description,
      announcementGroupId: `group-${Date.now()}`,
      groups: [],
      admins: [currentUser.id],
      createdAt: new Date(),
    };

    setCommunities(prev => [newCommunity, ...prev]);
    return newCommunityId;
  }, [currentUser.id]);

  // Search
  const searchChats = useCallback((query: string): Chat[] => {
    if (!query) return chats;
    
    const lowerQuery = query.toLowerCase();
    return chats.filter(chat => {
      if (chat.type === 'group') {
        return chat.name?.toLowerCase().includes(lowerQuery);
      } else {
        const participant = chat.participants.find(id => id !== currentUser.id);
        const user = users.find(u => u.id === participant);
        return user?.name.toLowerCase().includes(lowerQuery);
      }
    });
  }, [chats, users, currentUser.id]);

  const searchMessages = useCallback((chatId: string, query: string): Message[] => {
    if (!query) return messages.filter(msg => msg.chatId === chatId);
    
    const lowerQuery = query.toLowerCase();
    return messages.filter(msg => 
      msg.chatId === chatId && msg.content.toLowerCase().includes(lowerQuery)
    );
  }, [messages]);

  const value: ChatContextType = {
    currentUser,
    users,
    chats,
    messages,
    statusUpdates,
    calls,
    communities,
    sendMessage,
    deleteMessage,
    editMessage,
    starMessage,
    reactToMessage,
    replyToMessage,
    forwardMessage,
    createChat,
    pinChat,
    muteChat,
    archiveChat,
    deleteChat,
    markAsRead,
    addStatus,
    deleteStatus,
    viewStatus,
    makeCall,
    endCall,
    updateProfile,
    blockUser,
    createGroup,
    addParticipants,
    removeParticipant,
    makeAdmin,
    removeAdmin,
    updateGroupInfo,
    leaveGroup,
    createCommunity,
    searchChats,
    searchMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
