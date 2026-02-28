import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { useChatContext } from '../contexts/ChatContext';
import { getUserById, formatCallDuration } from '../data/mockData';
import { toast } from 'sonner';
import { useState } from 'react';

export default function Calls() {
  const { calls, users, makeCall } = useChatContext();
  const [showNewCall, setShowNewCall] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');

  const formatCallTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCallIcon = (call: (typeof calls)[0]) => {
    if (call.status === 'missed') {
      return <PhoneMissed className="w-4 h-4 text-red-500" />;
    }
    if (call.direction === 'incoming') {
      return <PhoneIncoming className="w-4 h-4 text-[#25D366]" />;
    }
    return <PhoneOutgoing className="w-4 h-4 text-gray-400" />;
  };

  const getCallStatus = (call: (typeof calls)[0]) => {
    if (call.status === 'missed') return 'Missed';
    if (call.status === 'rejected') return 'Declined';
    if (call.duration) return formatCallDuration(call.duration);
    return 'No answer';
  };

  const handleMakeCall = (participantId: string, type: 'voice' | 'video') => {
    makeCall(participantId, type);
    setShowNewCall(false);
    const user = getUserById(participantId);
    toast.success(`Calling ${user?.name}...`);
  };

  return (
    <>
      {/* Calls list panel */}
      <div className="w-[400px] bg-[#111111] border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl">Calls</h1>
            <Button
              size="icon"
              className="rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
              onClick={() => setShowNewCall(true)}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Calls list */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-800">
            {calls.map((call) => {
              const user = getUserById(call.participantId);
              if (!user) return null;

              return (
                <div
                  key={call.id}
                  className="p-4 hover:bg-[#1a1a1a] cursor-pointer transition-colors flex items-center gap-3"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getCallIcon(call)}
                      <h3 className="truncate">{user.name}</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                      {formatCallTime(call.timestamp)} • {getCallStatus(call)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info(`Calling ${user.name}...`);
                    }}
                  >
                    {call.type === 'video' ? (
                      <Video className="w-5 h-5 text-[#25D366]" />
                    ) : (
                      <Phone className="w-5 h-5 text-[#25D366]" />
                    )}
                  </Button>
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
            <Phone className="w-10 h-10" />
          </div>
          <h2 className="text-xl mb-2">Make a call</h2>
          <p className="text-gray-500">Start a voice or video call with your contacts</p>
        </div>
      </div>

      {/* New Call Dialog */}
      <Dialog open={showNewCall} onOpenChange={setShowNewCall}>
        <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>New Call</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ScrollArea className="h-[300px] border border-gray-700 rounded-lg">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 hover:bg-[#111111]"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-400">{user.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-[#25D366] hover:bg-gray-800"
                      onClick={() => handleMakeCall(user.id, 'voice')}
                    >
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-[#25D366] hover:bg-gray-800"
                      onClick={() => handleMakeCall(user.id, 'video')}
                    >
                      <Video className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}