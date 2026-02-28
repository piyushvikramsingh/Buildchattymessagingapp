import { useState } from 'react';
import { Plus, Eye, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useChatContext } from '../contexts/ChatContext';
import { getUserById } from '../data/mockData';
import { toast } from 'sonner';

const STATUS_COLORS = [
  '#25D366', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', 
  '#A8E6CF', '#FF8B94', '#FECA57', '#48C9B0', '#A29BFE'
];

export default function Status() {
  const { currentUser, statusUpdates, addStatus, deleteStatus, viewStatus } = useChatContext();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [newStatusText, setNewStatusText] = useState('');
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [selectedColor, setSelectedColor] = useState(STATUS_COLORS[0]);

  const myStatuses = statusUpdates.filter((s) => s.userId === currentUser.id);
  const otherStatuses = statusUpdates.filter((s) => s.userId !== currentUser.id);

  const formatStatusTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return 'yesterday';
  };

  const selectedStatusData = selectedStatus
    ? statusUpdates.find((s) => s.id === selectedStatus)
    : null;
  const selectedUser = selectedStatusData
    ? getUserById(selectedStatusData.userId)
    : null;

  const handleAddStatus = () => {
    if (!newStatusText.trim()) return;
    addStatus(newStatusText, 'text', selectedColor);
    toast.success('Status added!');
    setNewStatusText('');
    setShowAddStatus(false);
  };

  const handleViewStatus = (statusId: string) => {
    viewStatus(statusId);
    setSelectedStatus(statusId);
  };

  const handleDeleteStatus = (statusId: string) => {
    if (confirm('Delete this status?')) {
      deleteStatus(statusId);
      toast.success('Status deleted');
      setSelectedStatus(null);
    }
  };

  return (
    <>
      {/* Status list panel */}
      <div className="w-[400px] bg-[#111111] border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-2xl mb-4">Status</h1>
        </div>

        {/* Status list */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* My status */}
            <div>
              <h3 className="text-sm text-gray-400 mb-3">My status</h3>
              {myStatuses.length > 0 ? (
                <div
                  onClick={() => setSelectedStatus(myStatuses[0].id)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12 ring-2 ring-[#25D366]">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">My Status</h4>
                    <p className="text-sm text-gray-400">
                      {formatStatusTime(myStatuses[0].timestamp)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => setShowAddStatus(true)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#25D366] rounded-full flex items-center justify-center border-2 border-[#111111]">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">My Status</h4>
                    <p className="text-sm text-gray-400">Add status</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent updates */}
            <div>
              <h3 className="text-sm text-gray-400 mb-3">Recent updates</h3>
              <div className="space-y-2">
                {otherStatuses.map((status) => {
                  const user = getUserById(status.userId);
                  if (!user) return null;

                  return (
                    <div
                      key={status.id}
                      onClick={() => setSelectedStatus(status.id)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] cursor-pointer"
                    >
                      <Avatar className="w-12 h-12 ring-2 ring-[#25D366]">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-400">
                          {formatStatusTime(status.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Status preview area */}
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
        {selectedStatusData && selectedUser ? (
          <div className="max-w-md w-full">
            <div
              className="aspect-[9/16] rounded-2xl p-8 flex flex-col justify-between"
              style={{ backgroundColor: selectedStatusData.backgroundColor || '#25D366' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-white/80">
                    {formatStatusTime(selectedStatusData.timestamp)}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                {selectedStatusData.type === 'text' && (
                  <p className="text-2xl text-white leading-relaxed">
                    {selectedStatusData.content}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{selectedStatusData.views.length}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center mx-auto mb-4">
              <Eye className="w-10 h-10" />
            </div>
            <h2 className="text-xl mb-2">Select a status</h2>
            <p className="text-gray-500">Click on a status to view</p>
          </div>
        )}
      </div>

      {/* Add status dialog */}
      <Dialog open={showAddStatus} onOpenChange={setShowAddStatus}>
        <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add Text Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Type your status..."
              value={newStatusText}
              onChange={(e) => setNewStatusText(e.target.value)}
              className="bg-[#111111] border-gray-700 text-white placeholder:text-gray-500"
            />
            <div className="flex items-center gap-2">
              <Label className="text-sm">Color:</Label>
              <div className="flex items-center gap-2">
                {STATUS_COLORS.map((color) => (
                  <div
                    key={color}
                    className={`w-5 h-5 rounded-full border-2 border-gray-700 ${
                      selectedColor === color ? 'border-white' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
            <Button
              onClick={handleAddStatus}
              className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            >
              Add Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}