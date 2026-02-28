export interface User {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
  lastSeen?: Date;
  isOnline?: boolean;
  phoneNumber?: string;
  about?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact';
  mediaUrl?: string;
  replyTo?: string;
  isForwarded?: boolean;
  isEdited?: boolean;
  reactions?: { userId: string; emoji: string }[];
  isStarred?: boolean;
}

export interface Chat {
  id: string;
  type: 'individual' | 'group' | 'broadcast';
  name?: string;
  avatar?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  groupAdmins?: string[];
  groupDescription?: string;
  disappearingMessages?: '24h' | '7d' | '90d' | 'off';
  createdAt: Date;
}

export interface StatusUpdate {
  id: string;
  userId: string;
  type: 'text' | 'image' | 'video';
  content?: string;
  mediaUrl?: string;
  backgroundColor?: string;
  timestamp: Date;
  views: string[];
  reactions?: { userId: string; emoji: string }[];
}

export interface Call {
  id: string;
  type: 'voice' | 'video';
  participantId: string;
  direction: 'incoming' | 'outgoing';
  status: 'completed' | 'missed' | 'rejected';
  timestamp: Date;
  duration?: number;
}

export interface Community {
  id: string;
  name: string;
  avatar?: string;
  description: string;
  announcementGroupId: string;
  groups: string[];
  admins: string[];
  createdAt: Date;
}
