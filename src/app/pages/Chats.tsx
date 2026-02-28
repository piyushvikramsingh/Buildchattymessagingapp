import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, MoreVertical, Pin, MessageSquarePlus, UserPlus, Users as UsersIcon } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useChatContext } from '../contexts/ChatContext';
import { getUserById } from '../data/mockData';
import { Chat } from '../types';
import { toast } from 'sonner';

export default function Chats() {
  const navigate = useNavigate();
  const { chats, users, currentUser, createChat, createGroup, pinChat, muteChat, archiveChat, deleteChat } = useChatContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getChatName = (chat: Chat) => {
    if (chat.type === 'group') return chat.name;
    const participantId = chat.participants.find(id => id !== currentUser.id);
    const participant = getUserById(participantId || '');
    return participant?.name || 'Unknown';
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.type === 'group') return chat.avatar;
    const participantId = chat.participants.find(id => id !== currentUser.id);
    const participant = getUserById(participantId || '');
    return participant?.avatar;
  };

  const isUserOnline = (chat: Chat) => {
    if (chat.type === 'group') return false;
    const participantId = chat.participants.find(id => id !== currentUser.id);
    const participant = getUserById(participantId || '');
    return participant?.isOnline || false;
  };

  const filteredChats = chats
    .filter((chat) => {
      if (chat.isArchived) return false;
      if (!searchQuery) return true;
      const name = getChatName(chat);
      return name?.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const aTime = a.lastMessage?.timestamp.getTime() || 0;
      const bTime = b.lastMessage?.timestamp.getTime() || 0;
      return bTime - aTime;
    });

  const handleCreateNewChat = () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    const chatId = createChat(selectedUsers, 'individual');
    setShowNewChat(false);
    setSelectedUsers([]);
    navigate(`/chat/${chatId}`);
    toast.success('Chat created!');
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }

    const chatId = createGroup(groupName, selectedUsers, groupDescription);
    setShowNewGroup(false);
    setSelectedUsers([]);
    setGroupName('');
    setGroupDescription('');
    navigate(`/chat/${chatId}`);
    toast.success('Group created!');
  };

  const handleChatAction = (e: React.MouseEvent, chatId: string, action: string) => {
    e.stopPropagation();
    
    switch (action) {
      case 'pin':
        pinChat(chatId);
        const chat = chats.find(c => c.id === chatId);
        toast.success(chat?.isPinned ? 'Chat unpinned' : 'Chat pinned');
        break;
      case 'mute':
        muteChat(chatId);
        const mutedChat = chats.find(c => c.id === chatId);
        toast.success(mutedChat?.isMuted ? 'Chat unmuted' : 'Chat muted');
        break;
      case 'archive':
        archiveChat(chatId);
        toast.success('Chat archived');
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this chat?')) {
          deleteChat(chatId);
          toast.success('Chat deleted');
        }
        break;
    }
  };

  return (
    <>
      {/* Chat list panel */}
      <div className="w-[400px] bg-[#111111] border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl">Chats</h1>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => setShowNewChat(true)}
              >
                <MessageSquarePlus className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-700">
                  <DropdownMenuItem 
                    className="text-white hover:bg-gray-800"
                    onClick={() => setShowNewGroup(true)}
                  >
                    New group
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-800">Starred messages</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-800" onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Chat list */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-800">
            {filteredChats.map((chat) => {
              const chatName = getChatName(chat);
              const chatAvatar = getChatAvatar(chat);
              const lastMessage = chat.lastMessage;
              const senderName =
                lastMessage && chat.type === 'group'
                  ? getUserById(lastMessage.senderId)?.name
                  : null;

              return (
                <div
                  key={chat.id}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className="p-4 hover:bg-[#1a1a1a] cursor-pointer transition-colors flex items-start gap-3 group relative"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chatAvatar} alt={chatName} />
                      <AvatarFallback>{chatName?.[0]}</AvatarFallback>
                    </Avatar>
                    {isUserOnline(chat) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#111111]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate">{chatName}</h3>
                        {chat.isPinned && <Pin className="w-3 h-3 text-gray-500" />}
                      </div>
                      <span className="text-xs text-gray-500">
                        {lastMessage && formatMessageTime(lastMessage.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400 truncate">
                        {lastMessage ? (
                          <>
                            {senderName && <span className="text-gray-500">{senderName}: </span>}
                            {lastMessage.content}
                          </>
                        ) : (
                          'No messages yet'
                        )}
                      </p>
                      <div className="flex items-center gap-2">
                        {chat.isMuted && (
                          <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-[10px]">🔇</span>
                          </div>
                        )}
                        {chat.unreadCount > 0 && (
                          <Badge className="bg-[#25D366] text-black hover:bg-[#25D366]/90 min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick actions dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-700">
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800"
                        onClick={(e) => handleChatAction(e, chat.id, 'pin')}
                      >
                        {chat.isPinned ? 'Unpin chat' : 'Pin chat'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800"
                        onClick={(e) => handleChatAction(e, chat.id, 'mute')}
                      >
                        {chat.isMuted ? 'Unmute' : 'Mute notifications'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800"
                        onClick={(e) => handleChatAction(e, chat.id, 'archive')}
                      >
                        Archive chat
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500 hover:bg-gray-800"
                        onClick={(e) => handleChatAction(e, chat.id, 'delete')}
                      >
                        Delete chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Empty state */}
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center mx-auto mb-4">
            <MessageSquarePlus className="w-10 h-10" />
          </div>
          <h2 className="text-xl mb-2">Select a chat</h2>
          <p className="text-gray-500 mb-4">Choose a conversation to start messaging</p>
          <Button 
            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            onClick={() => setShowNewChat(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Start New Chat
          </Button>
        </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
        <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>New Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Select a contact</Label>
              <ScrollArea className="h-[300px] border border-gray-700 rounded-lg">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 hover:bg-[#111111] cursor-pointer"
                    onClick={() => {
                      setSelectedUsers([user.id]);
                      const chatId = createChat([user.id], 'individual');
                      setShowNewChat(false);
                      navigate(`/chat/${chatId}`);
                      toast.success('Chat created!');
                    }}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-400">{user.status}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Group Dialog */}
      <Dialog open={showNewGroup} onOpenChange={setShowNewGroup}>
        <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="group-name" className="mb-2 block">Group Name</Label>
              <Input
                id="group-name"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-[#111111] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label htmlFor="group-description" className="mb-2 block">Description (optional)</Label>
              <Input
                id="group-description"
                placeholder="Enter group description..."
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="bg-[#111111] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label className="mb-2 block">Select Participants</Label>
              <ScrollArea className="h-[200px] border border-gray-700 rounded-lg">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 hover:bg-[#111111] cursor-pointer"
                    onClick={() => {
                      setSelectedUsers(prev =>
                        prev.includes(user.id)
                          ? prev.filter(id => id !== user.id)
                          : [...prev, user.id]
                      );
                    }}
                  >
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers(prev => [...prev, user.id]);
                        } else {
                          setSelectedUsers(prev => prev.filter(id => id !== user.id));
                        }
                      }}
                    />
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-400">{user.status}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateGroup}
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            >
              <UsersIcon className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
