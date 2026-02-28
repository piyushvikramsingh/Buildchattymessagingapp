import { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Palette,
  Database,
  Shield,
  HelpCircle,
  ChevronRight,
  Edit as EditIcon,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Switch } from '../components/ui/switch';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useChatContext } from '../contexts/ChatContext';
import { toast } from 'sonner';

export default function Settings() {
  const { currentUser, updateProfile } = useChatContext();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editStatus, setEditStatus] = useState(currentUser.status || '');
  const [editAbout, setEditAbout] = useState(currentUser.about || '');

  const handleSaveProfile = () => {
    updateProfile({
      name: editName,
      status: editStatus,
      about: editAbout,
    });
    setShowEditProfile(false);
    toast.success('Profile updated successfully!');
  };

  const settingsSections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Profile', onClick: () => toast.info('Opening profile') },
        { label: 'Phone number', onClick: () => toast.info('Change phone number') },
        { label: 'Two-step verification', onClick: () => toast.info('Setup 2FA') },
        { label: 'Change email', onClick: () => toast.info('Change email') },
      ],
    },
    {
      title: 'Privacy',
      icon: Lock,
      items: [
        {
          label: 'Last seen & online',
          toggle: true,
          value: onlineStatus,
          onChange: setOnlineStatus,
        },
        { label: 'Profile photo', onClick: () => toast.info('Profile photo privacy') },
        { label: 'About', onClick: () => toast.info('About privacy') },
        {
          label: 'Read receipts',
          toggle: true,
          value: readReceipts,
          onChange: setReadReceipts,
        },
        { label: 'Groups', onClick: () => toast.info('Groups privacy') },
        { label: 'Blocked contacts', onClick: () => toast.info('Manage blocked contacts') },
        { label: 'Disappearing messages', onClick: () => toast.info('Default timer') },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Show notifications',
          toggle: true,
          value: notifications,
          onChange: setNotifications,
        },
        { label: 'Message notifications', onClick: () => toast.info('Message settings') },
        { label: 'Group notifications', onClick: () => toast.info('Group settings') },
        { label: 'Call notifications', onClick: () => toast.info('Call settings') },
      ],
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          label: 'Dark mode',
          toggle: true,
          value: darkMode,
          onChange: setDarkMode,
        },
        { label: 'Chat wallpaper', onClick: () => toast.info('Change wallpaper') },
        { label: 'Theme', onClick: () => toast.info('Choose theme') },
      ],
    },
    {
      title: 'Storage',
      icon: Database,
      items: [
        { label: 'Manage storage', onClick: () => toast.info('Storage manager') },
        { label: 'Network usage', onClick: () => toast.info('Network settings') },
        { label: 'Auto-download media', onClick: () => toast.info('Auto-download settings') },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Show security notifications', onClick: () => toast.info('Security settings') },
        { label: 'App lock', onClick: () => toast.info('Setup app lock') },
        { label: 'Chat lock', onClick: () => toast.info('Lock specific chats') },
      ],
    },
    {
      title: 'Help',
      icon: HelpCircle,
      items: [
        { label: 'Help center', onClick: () => toast.info('Opening help center') },
        { label: 'Contact us', onClick: () => toast.info('Contact support') },
        { label: 'Terms and Privacy Policy', onClick: () => toast.info('Legal info') },
        { label: 'App info', onClick: () => toast.info('Chatty v2.0.0') },
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          {/* Profile section */}
          <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl mb-1">{currentUser.name}</h2>
                <p className="text-gray-400 mb-2">{currentUser.status}</p>
                <p className="text-sm text-gray-500">{currentUser.phoneNumber}</p>
              </div>
              <Button
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800"
                onClick={() => setShowEditProfile(true)}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Settings sections */}
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-[#111111] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-[#25D366]" />
                </div>
                <h3 className="text-lg">{section.title}</h3>
              </div>
              <Separator className="mb-4 bg-gray-800" />
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      !item.toggle ? 'hover:bg-[#1a1a1a] cursor-pointer' : ''
                    }`}
                    onClick={!item.toggle ? item.onClick : undefined}
                  >
                    <span className="text-gray-200">{item.label}</span>
                    {item.toggle ? (
                      <Switch
                        checked={item.value}
                        onCheckedChange={item.onChange}
                        className="data-[state=checked]:bg-[#25D366]"
                      />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* About section */}
          <div className="text-center text-sm text-gray-500 py-4">
            <p>Chatty © 2026</p>
            <p className="mt-1">End-to-end encrypted messaging app</p>
          </div>
        </div>
      </ScrollArea>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={editAbout}
                onChange={(e) => setEditAbout(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="border-gray-700 text-white hover:bg-gray-800"
              onClick={handleSaveProfile}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}