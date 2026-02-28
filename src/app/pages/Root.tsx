import { Outlet, useNavigate, useLocation } from 'react-router';
import { MessageSquare, Users, Phone, Settings as SettingsIcon, Radio } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { currentUser } from '../data/mockData';

export default function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/chats', icon: MessageSquare, label: 'Chats' },
    { path: '/status', icon: Radio, label: 'Status' },
    { path: '/calls', icon: Phone, label: 'Calls' },
    { path: '/communities', icon: Users, label: 'Communities' },
  ];

  const isActive = (path: string) => {
    if (path === '/chats') {
      return location.pathname === '/' || location.pathname.startsWith('/chat');
    }
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <div className="w-20 bg-[#1a1a1a] border-r border-gray-800 flex flex-col items-center py-4 gap-4">
        {/* Logo */}
        <div className="mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="icon"
              onClick={() => navigate(item.path)}
              className={`w-12 h-12 rounded-xl ${
                isActive(item.path)
                  ? 'bg-[#25D366] text-white hover:bg-[#25D366]/90'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
            </Button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className={`w-12 h-12 rounded-xl ${
              location.pathname === '/settings'
                ? 'bg-[#25D366] text-white hover:bg-[#25D366]/90'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </Button>
          <Avatar className="w-12 h-12 cursor-pointer border-2 border-gray-700 hover:border-[#25D366] transition-colors">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        <Outlet />
      </div>
    </div>
  );
}
