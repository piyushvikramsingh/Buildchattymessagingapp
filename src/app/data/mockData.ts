import { User, Chat, Message, StatusUpdate, Call, Community } from '../types';

export const currentUser: User = {
  id: 'user-1',
  name: 'You',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
  status: 'Hey there! I am using Chatty',
  isOnline: true,
  phoneNumber: '+1 234 567 8900',
  about: 'Available',
};

export const users: User[] = [
  {
    id: 'user-2',
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    status: 'Busy at work',
    isOnline: true,
    phoneNumber: '+1 234 567 8901',
    about: 'Busy',
  },
  {
    id: 'user-3',
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    status: 'At the gym 💪',
    lastSeen: new Date(Date.now() - 1000 * 60 * 5),
    isOnline: false,
    phoneNumber: '+1 234 567 8902',
    about: 'Hey there! I am using Chatty',
  },
  {
    id: 'user-4',
    name: 'Carol Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    status: 'Sleeping...',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    isOnline: false,
    phoneNumber: '+1 234 567 8903',
    about: 'Available',
  },
  {
    id: 'user-5',
    name: 'David Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    status: 'On vacation 🏖️',
    isOnline: true,
    phoneNumber: '+1 234 567 8904',
    about: 'At work',
  },
  {
    id: 'user-6',
    name: 'Emily Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    status: 'Coffee lover ☕',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isOnline: false,
    phoneNumber: '+1 234 567 8905',
    about: 'Available',
  },
  {
    id: 'user-7',
    name: 'Frank Miller',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank',
    status: 'Available',
    isOnline: true,
    phoneNumber: '+1 234 567 8906',
    about: 'Battery about to die',
  },
  {
    id: 'user-8',
    name: 'Grace Lee',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace',
    status: 'Coding all day',
    lastSeen: new Date(Date.now() - 1000 * 60 * 15),
    isOnline: false,
    phoneNumber: '+1 234 567 8907',
    about: 'Available',
  },
  {
    id: 'user-9',
    name: 'Henry Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry',
    status: 'Gaming 🎮',
    isOnline: true,
    phoneNumber: '+1 234 567 8908',
    about: 'Hey there! I am using Chatty',
  },
  {
    id: 'user-10',
    name: 'Isabelle Taylor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabelle',
    status: 'Traveling the world 🌍',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60),
    isOnline: false,
    phoneNumber: '+1 234 567 8909',
    about: 'Available',
  },
];

export const messages: Message[] = [
  // Chat with Alice
  {
    id: 'msg-1',
    chatId: 'chat-1',
    senderId: 'user-2',
    content: 'Hey! How are you doing?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: 'read',
    type: 'text',
  },
  {
    id: 'msg-2',
    chatId: 'chat-1',
    senderId: 'user-1',
    content: 'Hi Alice! I\'m great, thanks! How about you?',
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    status: 'read',
    type: 'text',
  },
  {
    id: 'msg-3',
    chatId: 'chat-1',
    senderId: 'user-2',
    content: 'I\'m doing well! Just finished a big project at work 🎉',
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    status: 'read',
    type: 'text',
  },
  {
    id: 'msg-4',
    chatId: 'chat-1',
    senderId: 'user-1',
    content: 'That\'s awesome! Congratulations! 🎊',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'read',
    type: 'text',
  },
  {
    id: 'msg-5',
    chatId: 'chat-1',
    senderId: 'user-2',
    content: 'Thanks! Want to grab coffee later to celebrate?',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    status: 'delivered',
    type: 'text',
  },
  // Chat with Bob
  {
    id: 'msg-6',
    chatId: 'chat-2',
    senderId: 'user-1',
    content: 'Hey Bob, are you coming to the gym today?',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    status: 'read',
    type: 'text',
  },
  {
    id: 'msg-7',
    chatId: 'chat-2',
    senderId: 'user-3',
    content: 'Yeah, I\'ll be there in 30 minutes!',
    timestamp: new Date(Date.now() - 1000 * 60 * 115),
    status: 'read',
    type: 'text',
  },
  {
    id: 'msg-8',
    chatId: 'chat-2',
    senderId: 'user-3',
    content: 'Just finished my workout. Great session today! 💪',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    status: 'delivered',
    type: 'text',
  },
  // Chat with Carol
  {
    id: 'msg-9',
    chatId: 'chat-3',
    senderId: 'user-4',
    content: 'Good night! Talk to you tomorrow 😴',
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    status: 'read',
    type: 'text',
  },
  // Group chat
  {
    id: 'msg-10',
    chatId: 'chat-4',
    senderId: 'user-5',
    content: 'Hey everyone! Planning to organize a team outing next week. Any suggestions?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    status: 'read',
    type: 'text',
  },
  {
    id: 'msg-11',
    chatId: 'chat-4',
    senderId: 'user-6',
    content: 'How about a beach picnic? 🏖️',
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    status: 'read',
    type: 'text',
  },
  {
    id: 'msg-12',
    chatId: 'chat-4',
    senderId: 'user-7',
    content: 'That sounds great! Count me in!',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    status: 'read',
    type: 'text',
  },
  {
    id: 'msg-13',
    chatId: 'chat-4',
    senderId: 'user-2',
    content: 'Perfect! Let\'s finalize the date',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: 'delivered',
    type: 'text',
  },
  // Chat with David
  {
    id: 'msg-14',
    chatId: 'chat-5',
    senderId: 'user-5',
    content: 'Check out this view! 🌅',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    status: 'read',
    type: 'text',
  },
  // Chat with Emily
  {
    id: 'msg-15',
    chatId: 'chat-6',
    senderId: 'user-1',
    content: 'Do you want to meet up for coffee this weekend?',
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    status: 'read',
    type: 'text',
  },
  {
    id: 'msg-16',
    chatId: 'chat-6',
    senderId: 'user-6',
    content: 'Yes! I know a great new café downtown ☕',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    status: 'read',
    type: 'text',
  },
];

export const chats: Chat[] = [
  {
    id: 'chat-1',
    type: 'individual',
    participants: ['user-1', 'user-2'],
    lastMessage: messages.find(m => m.id === 'msg-5'),
    unreadCount: 1,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: 'chat-2',
    type: 'individual',
    participants: ['user-1', 'user-3'],
    lastMessage: messages.find(m => m.id === 'msg-8'),
    unreadCount: 1,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: 'chat-3',
    type: 'individual',
    participants: ['user-1', 'user-4'],
    lastMessage: messages.find(m => m.id === 'msg-9'),
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: 'chat-4',
    type: 'group',
    name: 'Team Awesome 🚀',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=TeamAwesome',
    participants: ['user-1', 'user-2', 'user-5', 'user-6', 'user-7'],
    lastMessage: messages.find(m => m.id === 'msg-13'),
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    groupAdmins: ['user-1', 'user-5'],
    groupDescription: 'Our awesome team group!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
  {
    id: 'chat-5',
    type: 'individual',
    participants: ['user-1', 'user-5'],
    lastMessage: messages.find(m => m.id === 'msg-14'),
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
  },
  {
    id: 'chat-6',
    type: 'individual',
    participants: ['user-1', 'user-6'],
    lastMessage: messages.find(m => m.id === 'msg-16'),
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    isArchived: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
  },
  {
    id: 'chat-7',
    type: 'individual',
    participants: ['user-1', 'user-7'],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: 'chat-8',
    type: 'group',
    name: 'Family 👨‍👩‍👧‍👦',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Family',
    participants: ['user-1', 'user-8', 'user-9', 'user-10'],
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    groupAdmins: ['user-1'],
    groupDescription: 'Family group chat',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
];

export const statusUpdates: StatusUpdate[] = [
  {
    id: 'status-1',
    userId: 'user-1',
    type: 'text',
    content: 'Hey there! I am using Chatty 🎉',
    backgroundColor: '#25D366',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    views: ['user-2', 'user-3', 'user-5'],
  },
  {
    id: 'status-2',
    userId: 'user-2',
    type: 'text',
    content: 'Just completed my project! 🎊',
    backgroundColor: '#FF6B6B',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    views: ['user-1'],
  },
  {
    id: 'status-3',
    userId: 'user-3',
    type: 'text',
    content: 'Gym time! 💪',
    backgroundColor: '#4ECDC4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    views: ['user-1', 'user-7'],
  },
  {
    id: 'status-4',
    userId: 'user-5',
    type: 'text',
    content: 'Beach vibes 🏖️☀️',
    backgroundColor: '#FFE66D',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    views: ['user-1', 'user-6'],
  },
  {
    id: 'status-5',
    userId: 'user-6',
    type: 'text',
    content: 'Coffee makes everything better ☕',
    backgroundColor: '#95E1D3',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    views: ['user-1', 'user-2', 'user-5'],
  },
];

export const calls: Call[] = [
  {
    id: 'call-1',
    type: 'video',
    participantId: 'user-2',
    direction: 'incoming',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    duration: 1245,
  },
  {
    id: 'call-2',
    type: 'voice',
    participantId: 'user-3',
    direction: 'outgoing',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    duration: 325,
  },
  {
    id: 'call-3',
    type: 'video',
    participantId: 'user-5',
    direction: 'incoming',
    status: 'missed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: 'call-4',
    type: 'voice',
    participantId: 'user-6',
    direction: 'outgoing',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    duration: 890,
  },
  {
    id: 'call-5',
    type: 'video',
    participantId: 'user-7',
    direction: 'incoming',
    status: 'rejected',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
];

export const communities: Community[] = [
  {
    id: 'community-1',
    name: 'Tech Enthusiasts',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechCommunity',
    description: 'A community for tech lovers and developers',
    announcementGroupId: 'group-1',
    groups: ['group-1', 'group-2', 'group-3'],
    admins: ['user-1', 'user-5'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
  {
    id: 'community-2',
    name: 'Local Neighborhood',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=NeighborhoodCommunity',
    description: 'Stay connected with your neighbors',
    announcementGroupId: 'group-4',
    groups: ['group-4', 'group-5'],
    admins: ['user-8'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
  },
];

export const getUserById = (userId: string): User | undefined => {
  if (userId === currentUser.id) return currentUser;
  return users.find(user => user.id === userId);
};

export const getChatById = (chatId: string): Chat | undefined => {
  return chats.find(chat => chat.id === chatId);
};

export const getMessagesByChatId = (chatId: string): Message[] => {
  return messages.filter(msg => msg.chatId === chatId).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export const getChatParticipant = (chat: Chat, currentUserId: string): User | undefined => {
  if (chat.type === 'group') return undefined;
  const otherUserId = chat.participants.find(id => id !== currentUserId);
  return otherUserId ? getUserById(otherUserId) : undefined;
};

export const formatLastSeen = (lastSeen: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - lastSeen.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return lastSeen.toLocaleDateString();
};

export const formatCallDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
