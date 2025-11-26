import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, MessageSquare, Trash2, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { StorageService } from '../services/storage';
import { User, Item, Message, ItemStatus } from '../types';

interface ProfileProps {
  user: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'posts' | 'messages'>('posts');
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [myMessages, setMyMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const allItems = StorageService.getItems();
    setMyItems(allItems.filter(item => item.postedBy === user.id));
    setMyMessages(StorageService.getUserMessages(user.id));
  }, [user, navigate]);

  const handleDelete = (itemId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      StorageService.deleteItem(itemId);
      setMyItems(prev => prev.filter(i => i.id !== itemId));
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Hello, {user.username}</h1>
        <p className="text-slate-500 text-sm">{user.email}</p>
      </div>

      <div className="flex gap-6 border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'posts' 
              ? 'text-indigo-600' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          My Posts
          {activeTab === 'posts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'messages' 
              ? 'text-indigo-600' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Messages
          {activeTab === 'messages' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'posts' ? (
        <div className="space-y-4">
          {myItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
              <Package className="mx-auto text-slate-300 mb-3" size={32} />
              <p className="text-slate-500">You haven't posted any items yet.</p>
              <Link to="/post" className="text-indigo-600 font-medium text-sm mt-2 hover:underline">Post something now</Link>
            </div>
          ) : (
            myItems.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 flex gap-5 items-start">
                <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">?</div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                            item.category === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                         }`}>{item.category}</span>
                         <span>{new Date(item.date).toLocaleDateString()}</span>
                         <span className={item.status === ItemStatus.CLAIMED ? 'text-slate-800 font-bold' : ''}>
                           {item.status === ItemStatus.CLAIMED ? 'CLAIMED' : 'Active'}
                         </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <Link to={`/item/${item.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View">
                         <ExternalLink size={18} />
                       </Link>
                       <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mt-2 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {myMessages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
              <MessageSquare className="mx-auto text-slate-300 mb-3" size={32} />
              <p className="text-slate-500">No messages yet.</p>
            </div>
          ) : (
            myMessages.map(msg => {
              const isSender = msg.senderId === user.id;
              return (
                <div key={msg.id} className={`bg-white p-5 rounded-xl border border-slate-200 ${!isSender ? 'border-l-4 border-l-indigo-500' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        {isSender ? 'To: ' : 'From: '}
                      </span>
                      <span className="font-medium text-slate-900">
                        {isSender ? 'Item Owner' : msg.senderName}
                      </span>
                      <span className="text-slate-400 mx-2">•</span>
                      <span className="text-xs text-slate-500">Regarding: <span className="font-medium text-slate-700">{msg.itemTitle}</span></span>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(msg.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">{msg.content}</p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;