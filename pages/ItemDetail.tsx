import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User as UserIcon, MessageCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Item, User, ItemStatus } from '../types';

interface ItemDetailProps {
  user: User | null;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [message, setMessage] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    if (id) {
      const foundItem = StorageService.getItemById(id);
      if (foundItem) {
        setItem(foundItem);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !item) return;

    StorageService.sendMessage({
      itemId: item.id,
      itemTitle: item.title,
      senderId: user.id,
      senderName: user.username,
      receiverId: item.postedBy,
      content: message,
    });

    setMessageSent(true);
    setMessage('');
    setTimeout(() => {
      setShowContactForm(false);
      setMessageSent(false);
    }, 2000);
  };

  const handleMarkAsClaimed = () => {
    if (item && user && item.postedBy === user.id) {
      StorageService.updateItemStatus(item.id, ItemStatus.CLAIMED);
      setItem({ ...item, status: ItemStatus.CLAIMED });
    }
  };

  if (!item) return <div className="p-8 text-center text-github-text">Loading...</div>;

  const isOwner = user?.id === item.postedBy;

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-github-muted hover:text-github-accent mb-6 transition-colors"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Board
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-[#010409] rounded-2xl overflow-hidden border border-github-border">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-github-border">
                <span className="text-6xl font-thin">?</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 text-sm font-bold uppercase tracking-wide rounded-full backdrop-blur-md ${
                item.category === 'lost' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                {item.category}
              </span>
              {item.status === ItemStatus.CLAIMED && (
                <span className="px-3 py-1 text-sm font-bold uppercase tracking-wide rounded-full bg-gray-700 text-gray-200 border border-gray-600">
                  Claimed
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{item.title}</h1>
            <div className="flex items-center text-github-muted text-sm gap-4">
              <span className="flex items-center">
                <Calendar size={16} className="mr-1.5" />
                {new Date(item.date).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <MapPin size={16} className="mr-1.5" />
                {item.location}
              </span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-semibold text-white mb-2">Description</h3>
            <p className="text-github-text leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>

          <div className="bg-[#161b22]/40 backdrop-blur-md p-6 rounded-2xl border border-github-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-github-accent/10 rounded-full flex items-center justify-center text-github-accent border border-github-accent/20">
                <UserIcon size={20} />
              </div>
              <div>
                <p className="text-xs text-github-muted font-medium uppercase tracking-wider">Posted by</p>
                <p className="font-semibold text-white">{item.postedByName}</p>
              </div>
            </div>

            {isOwner ? (
              item.status === ItemStatus.UNCLAIMED && (
                <button
                  onClick={handleMarkAsClaimed}
                  className="px-4 py-2 bg-github-border text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Mark as Claimed
                </button>
              )
            ) : (
              <button
                onClick={() => user ? setShowContactForm(true) : navigate('/login')}
                className="px-4 py-2 bg-github-accent text-white rounded-lg text-sm font-medium hover:bg-blue-400 transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(88,166,255,0.3)]"
              >
                <MessageCircle size={16} />
                Contact Poster
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border-github-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Message {item.postedByName}</h3>
              <button onClick={() => setShowContactForm(false)} className="text-github-muted hover:text-white">
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {messageSent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/30">
                  <CheckCircle size={24} />
                </div>
                <p className="font-medium text-white">Message Sent!</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-github-text mb-1">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Hi, I think I found your ${item.title}...`}
                    className="w-full p-3 rounded-lg glass-input focus:outline-none focus:ring-1 focus:ring-github-accent/50 resize-none placeholder-gray-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-github-accent text-white rounded-lg font-medium hover:bg-blue-400 transition-colors shadow-[0_0_15px_rgba(88,166,255,0.4)]"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;