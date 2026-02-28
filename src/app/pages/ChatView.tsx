import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Search,
  Smile,
  Paperclip,
  Send,
  Mic,
  Check,
  CheckCheck,
  Reply,
  Forward,
  Star,
  Trash2,
  Edit,
  Copy,
  Image as ImageIcon,
  File,
  MapPin,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Checkbox } from '../components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useChatContext } from '../contexts/ChatContext';
import { getUserById, formatLastSeen } from '../data/mockData';
import { Message } from '../types';
import { toast } from 'sonner';

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export default function ChatView() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { 
    chats, 
    messages: allMessages, 
    currentUser, 
    sendMessage, 
    deleteMessage, 
    editMessage, 
    starMessage,
    reactToMessage,
    replyToMessage,
    forwardMessage,
    makeCall,
    markAsRead,
  } = useChatContext();

  const [messageInput, setMessageInput] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null);
  const [selectedChatsForForward, setSelectedChatsForForward] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const chat = chatId ? chats.find(c => c.id === chatId) : undefined;
  const messages = chatId ? allMessages.filter(msg => msg.chatId === chatId).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) : [];

  useEffect(() => {
    if (chatId) {
      markAsRead(chatId);
    }
  }, [chatId, markAsRead]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-gray-500">Chat not found</p>
      </div>
    );
  }

  const chatParticipantId = chat.type === 'individual' 
    ? chat.participants.find(id => id !== currentUser.id) 
    : null;
  const chatParticipant = chatParticipantId ? getUserById(chatParticipantId) : null;
  const chatName = chat.type === 'group' ? chat.name : chatParticipant?.name;
  const chatAvatar = chat.type === 'group' ? chat.avatar : chatParticipant?.avatar;
  const isOnline = chat.type === 'individual' && chatParticipant?.isOnline;
  const lastSeen = chat.type === 'individual' && chatParticipant?.lastSeen;

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    if (editingMessage) {
      editMessage(editingMessage.id, messageInput);
      setEditingMessage(null);
      toast.success('Message edited');
    } else if (replyingTo) {
      replyToMessage(chat.id, messageInput, replyingTo.id);
      setReplyingTo(null);
      toast.success('Reply sent');
    } else {
      sendMessage(chat.id, messageInput);
    }

    setMessageInput('');
  };

  const handleDeleteMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    if (message.senderId === currentUser.id) {
      const deleteForEveryone = confirm('Delete for everyone?');
      deleteMessage(messageId, deleteForEveryone);
      toast.success(deleteForEveryone ? 'Message deleted for everyone' : 'Message deleted');
    } else {
      deleteMessage(messageId, false);
      toast.success('Message deleted');
    }
  };

  const handleStarMessage = (messageId: string) => {
    starMessage(messageId);
    const message = messages.find(m => m.id === messageId);
    toast.success(message?.isStarred ? 'Message unstarred' : 'Message starred');
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    reactToMessage(messageId, emoji);
    setShowEmojiPicker(false);
  };

  const handleForwardMessage = () => {
    if (!forwardingMessage || selectedChatsForForward.length === 0) {
      toast.error('Please select at least one chat');
      return;
    }

    forwardMessage(forwardingMessage.id, selectedChatsForForward);
    setShowForwardDialog(false);
    setForwardingMessage(null);
    setSelectedChatsForForward([]);
    toast.success(`Message forwarded to ${selectedChatsForForward.length} chat(s)`);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied');
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getStatusIcon = (status: Message['status']) => {
    if (status === 'sent') return <Check className="w-3 h-3" />;
    if (status === 'delivered') return <CheckCheck className="w-3 h-3" />;
    if (status === 'read') return <CheckCheck className="w-3 h-3 text-[#53BDEB]" />;
    return null;
  };

  const filteredMessages = searchQuery
    ? messages.filter(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="h-16 bg-[#111111] border-b border-gray-800 flex items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/chats')}
          className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <Avatar className="w-10 h-10 cursor-pointer" onClick={() => toast.info('View profile')}>
          <AvatarImage src={chatAvatar} alt={chatName} />
          <AvatarFallback>{chatName?.[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 cursor-pointer" onClick={() => toast.info('View profile')}>
          <h2 className="font-medium">{chatName}</h2>
          <p className="text-xs text-gray-400">
            {chat.type === 'group'
              ? `${chat.participants.length} participants`
              : isOnline
              ? 'online'
              : lastSeen
              ? formatLastSeen(lastSeen)
              : 'offline'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => {
              if (chatParticipantId) {
                makeCall(chatParticipantId, 'voice');
                toast.success('Starting voice call...');
              }
            }}
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => {
              if (chatParticipantId) {
                makeCall(chatParticipantId, 'video');
                toast.success('Starting video call...');
              }
            }}
          >
            <Video className="w-5 h-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Search className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-700 w-64">
              <div className="p-2">
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#111111] border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-700">
              <DropdownMenuItem className="text-white hover:bg-gray-800">Contact info</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800">Select messages</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800">Mute notifications</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800">Disappearing messages</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800">Clear chat</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800">Export chat</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800">Block</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-8 py-4" style={{ backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <div className="space-y-2 max-w-4xl mx-auto">
          {filteredMessages.map((message, index) => {
            const isOwnMessage = message.senderId === currentUser.id;
            const sender = getUserById(message.senderId);
            const showSenderName = chat.type === 'group' && !isOwnMessage;
            const replyToMessage = message.replyTo ? messages.find(m => m.id === message.replyTo) : null;

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
              >
                <div className="relative">
                  <div
                    className={`max-w-[65%] rounded-lg px-3 py-2 ${
                      isOwnMessage
                        ? 'bg-[#005C4B] text-white'
                        : 'bg-[#1a1a1a] text-white'
                    }`}
                  >
                    {message.isForwarded && (
                      <p className="text-xs text-gray-400 italic mb-1 flex items-center gap-1">
                        <Forward className="w-3 h-3" />
                        Forwarded
                      </p>
                    )}
                    {showSenderName && (
                      <p className="text-xs text-[#25D366] mb-1 font-medium">{sender?.name}</p>
                    )}
                    {replyToMessage && (
                      <div className="bg-black/20 rounded px-2 py-1 mb-2 border-l-2 border-[#25D366]">
                        <p className="text-xs text-gray-400">{getUserById(replyToMessage.senderId)?.name}</p>
                        <p className="text-xs truncate">{replyToMessage.content}</p>
                      </div>
                    )}
                    <p className="break-words">{message.content}</p>
                    {message.isEdited && (
                      <span className="text-xs text-gray-400 italic ml-2">edited</span>
                    )}
                    <div className="flex items-center justify-end gap-2 mt-1">
                      {message.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                      <span className="text-[10px] text-gray-400">
                        {formatMessageTime(message.timestamp)}
                      </span>
                      {isOwnMessage && (
                        <span className="text-gray-400">{getStatusIcon(message.status)}</span>
                      )}
                    </div>
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {message.reactions.map((reaction, idx) => (
                          <span key={idx} className="text-xs bg-black/20 rounded-full px-2 py-0.5">
                            {reaction.emoji}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-6 w-6"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-700">
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800"
                        onClick={() => setReplyingTo(message)}
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800"
                        onClick={() => {
                          setForwardingMessage(message);
                          setShowForwardDialog(true);
                        }}
                      >
                        <Forward className="w-4 h-4 mr-2" />
                        Forward
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800"
                        onClick={() => handleStarMessage(message.id)}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {message.isStarred ? 'Unstar' : 'Star'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800"
                        onClick={() => handleCopyMessage(message.content)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </DropdownMenuItem>
                      {isOwnMessage && (
                        <DropdownMenuItem 
                          className="text-white hover:bg-gray-800"
                          onClick={() => {
                            setEditingMessage(message);
                            setMessageInput(message.content);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-red-500 hover:bg-gray-800"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                      <div className="border-t border-gray-700 my-1" />
                      <div className="p-2">
                        <p className="text-xs text-gray-400 mb-2">React</p>
                        <div className="flex gap-1">
                          {EMOJI_LIST.map((emoji) => (
                            <button
                              key={emoji}
                              className="text-lg hover:bg-gray-800 rounded p-1"
                              onClick={() => handleReactToMessage(message.id, emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Reply/Edit bar */}
      {(replyingTo || editingMessage) && (
        <div className="px-4 py-2 bg-[#1a1a1a] border-t border-gray-800 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-[#25D366]">
              {editingMessage ? 'Editing message' : `Replying to ${getUserById(replyingTo?.senderId || '')?.name}`}
            </p>
            <p className="text-sm text-gray-400 truncate">
              {editingMessage ? editingMessage.content : replyingTo?.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => {
              setReplyingTo(null);
              setEditingMessage(null);
              setMessageInput('');
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Message input */}
      <div className="p-4 bg-[#111111] border-t border-gray-800">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="w-5 h-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-[#1a1a1a] border-gray-700">
              <DropdownMenuItem className="text-white hover:bg-gray-800" onClick={() => toast.info('Photo/Video coming soon')}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Photo & Video
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800" onClick={() => toast.info('Document coming soon')}>
                <File className="w-4 h-4 mr-2" />
                Document
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-800" onClick={() => toast.info('Location coming soon')}>
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500"
          />
          {messageInput.trim() ? (
            <Button
              size="icon"
              onClick={handleSendMessage}
              className="rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => toast.info('Voice message coming soon')}
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="mt-2 p-2 bg-[#1a1a1a] rounded-lg border border-gray-700">
            <div className="flex gap-2 flex-wrap">
              {['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '👍', '👎', '👏', '🙌', '👋', '🤝', '🙏', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️'].map((emoji) => (
                <button
                  key={emoji}
                  className="text-xl hover:bg-gray-800 rounded p-1"
                  onClick={() => {
                    setMessageInput(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Forward Dialog */}
      <Dialog open={showForwardDialog} onOpenChange={setShowForwardDialog}>
        <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Forward Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ScrollArea className="h-[300px] border border-gray-700 rounded-lg">
              {chats.filter(c => c.id !== chatId).map((chatItem) => {
                const chatName = chatItem.type === 'group' 
                  ? chatItem.name 
                  : getUserById(chatItem.participants.find(id => id !== currentUser.id) || '')?.name;
                
                return (
                  <div
                    key={chatItem.id}
                    className="flex items-center gap-3 p-3 hover:bg-[#111111] cursor-pointer"
                    onClick={() => {
                      setSelectedChatsForForward(prev =>
                        prev.includes(chatItem.id)
                          ? prev.filter(id => id !== chatItem.id)
                          : [...prev, chatItem.id]
                      );
                    }}
                  >
                    <Checkbox
                      checked={selectedChatsForForward.includes(chatItem.id)}
                    />
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={chatItem.type === 'group' ? chatItem.avatar : getUserById(chatItem.participants.find(id => id !== currentUser.id) || '')?.avatar} />
                      <AvatarFallback>{chatName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{chatName}</h4>
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button
              onClick={handleForwardMessage}
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
              disabled={selectedChatsForForward.length === 0}
            >
              <Forward className="w-4 h-4 mr-2" />
              Forward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
