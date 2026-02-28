import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <h1 className="text-6xl mb-4">404</h1>
        <h2 className="text-2xl mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
        <Button
          onClick={() => navigate('/chats')}
          className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
        >
          <Home className="w-4 h-4 mr-2" />
          Go to Chats
        </Button>
      </div>
    </div>
  );
}
