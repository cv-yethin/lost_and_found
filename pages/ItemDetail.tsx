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

  if (!item) return <div className="p-8 text-center">Loading...</div>;

  const isOwner = user?.id === item.postedBy;

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Board
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <span className="text-6xl">?</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 text-sm font-bold uppercase tracking-wide rounded-full ${
                item.category === 'lost' 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}>
                {item.category}
              </span>
              {item.status === ItemStatus.CLAIMED && (
                <span className="px-3 py-1 text-sm font-bold uppercase tracking-wide rounded-full bg-slate-800 text-white">
                  Claimed
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{item.title}</h1>
            <div className="flex items-center text-slate-500 text-sm gap-4">
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

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <UserIcon size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Posted by</p>
                <p className="font-semibold text-slate-900">{item.postedByName}</p>
              </div>
            </div>

            {isOwner ? (
              item.status === ItemStatus.UNCLAIMED && (
                <button
                  onClick={handleMarkAsClaimed}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Mark as Claimed
                </button>
              )
            ) : (
              <button
                onClick={() => user ? setShowContactForm(true) : navigate('/login')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">Message {item.postedByName}</h3>
              <button onClick={() => setShowContactForm(false)} className="text-slate-400 hover:text-slate-600">
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {messageSent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} />
                </div>
                <p className="font-medium text-slate-900">Message Sent!</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Hi, I think I found your ${item.title}...`}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
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