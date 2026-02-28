import { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useChatContext } from '../contexts/ChatContext';
import { toast } from 'sonner';

export default function Communities() {
  const { communities, createCommunity } = useChatContext();
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [communityDescription, setCommunityDescription] = useState('');

  const handleCreateCommunity = () => {
    if (!communityName.trim()) {
      toast.error('Please enter a community name');
      return;
    }
    if (!communityDescription.trim()) {
      toast.error('Please enter a community description');
      return;
    }

    createCommunity(communityName, communityDescription);
    setShowCreateCommunity(false);
    setCommunityName('');
    setCommunityDescription('');
    toast.success('Community created successfully!');
  };

  return (
    <>
      {/* Communities list panel */}
      <div className="w-[400px] bg-[#111111] border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl">Communities</h1>
            <Button
              size="icon"
              className="rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
              onClick={() => setShowCreateCommunity(true)}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            Stay connected with a community — a place for related groups.
          </p>
        </div>

        {/* Communities list */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-800">
            {communities.map((community) => (
              <div
                key={community.id}
                className="p-4 hover:bg-[#1a1a1a] cursor-pointer transition-colors"
                onClick={() => toast.info(`Opening ${community.name}`)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={community.avatar} alt={community.name} />
                    <AvatarFallback>{community.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1">{community.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{community.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-[#1a1a1a] text-gray-400 hover:bg-[#1a1a1a]">
                        {community.groups.length} groups
                      </Badge>
                      <Badge variant="secondary" className="bg-[#1a1a1a] text-gray-400 hover:bg-[#1a1a1a]">
                        <Users className="w-3 h-3 mr-1" />
                        Community
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Empty state */}
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-xl mb-2">Stay connected with a community</h2>
          <p className="text-gray-500 mb-6">
            Communities bring members together in topic-based groups, and make it easy to get
            admin announcements. Any community you're added to will appear here.
          </p>
          <Button
            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            onClick={() => setShowCreateCommunity(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Start a community
          </Button>
        </div>
      </div>

      {/* Create Community Dialog */}
      <Dialog open={showCreateCommunity} onOpenChange={setShowCreateCommunity}>
        <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Create Community</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="community-name" className="mb-2 block">Community Name</Label>
              <Input
                id="community-name"
                placeholder="Enter community name..."
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                className="bg-[#111111] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label htmlFor="community-description" className="mb-2 block">Description</Label>
              <Textarea
                id="community-description"
                placeholder="Enter community description..."
                value={communityDescription}
                onChange={(e) => setCommunityDescription(e.target.value)}
                className="bg-[#111111] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateCommunity}
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Create Community
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}