import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, MessageSquare, Trash2, ExternalLink } from 'lucide-react';
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
      <div className="glass-panel rounded-2xl p-8 shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Hello, {user.username}</h1>
        <p className="text-github-muted text-sm">{user.email}</p>
      </div>

      <div className="flex gap-6 border-b border-github-border mb-8">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'posts' 
              ? 'text-github-accent' 
              : 'text-github-muted hover:text-white'
          }`}
        >
          My Posts
          {activeTab === 'posts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-github-accent rounded-t-full shadow-[0_0_10px_rgba(88,166,255,0.8)]" />}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'messages' 
              ? 'text-github-accent' 
              : 'text-github-muted hover:text-white'
          }`}
        >
          Messages
          {activeTab === 'messages' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-github-accent rounded-t-full shadow-[0_0_10px_rgba(88,166,255,0.8)]" />}
        </button>
      </div>

      {activeTab === 'posts' ? (
        <div className="space-y-4">
          {myItems.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-xl border-dashed border-github-border">
              <Package className="mx-auto text-github-muted mb-3" size={32} />
              <p className="text-github-muted">You haven't posted any items yet.</p>
              <Link to="/post" className="text-github-accent font-medium text-sm mt-2 hover:underline">Post something now</Link>
            </div>
          ) : (
            myItems.map(item => (
              <div key={item.id} className="glass-card p-5 rounded-xl flex gap-5 items-start hover:bg-[#161b22]/80 transition-colors">
                <div className="w-24 h-24 bg-[#010409] rounded-lg flex-shrink-0 overflow-hidden border border-github-border">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-github-border">?</div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white truncate">{item.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-github-muted">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                            item.category === 'lost' 
                              ? 'bg-red-900/20 text-red-400 border-red-500/20' 
                              : 'bg-green-900/20 text-green-400 border-green-500/20'
                         }`}>{item.category}</span>
                         <span>{new Date(item.date).toLocaleDateString()}</span>
                         <span className={item.status === ItemStatus.CLAIMED ? 'text-gray-400 font-bold' : ''}>
                           {item.status === ItemStatus.CLAIMED ? 'CLAIMED' : 'Active'}
                         </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <Link to={`/item/${item.id}`} className="p-2 text-github-muted hover:text-github-accent hover:bg-github-accent/10 rounded-lg transition-colors" title="View">
                         <ExternalLink size={18} />
                       </Link>
                       <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-github-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                  <p className="text-github-text text-sm mt-2 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {myMessages.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-xl border-dashed border-github-border">
              <MessageSquare className="mx-auto text-github-muted mb-3" size={32} />
              <p className="text-github-muted">No messages yet.</p>
            </div>
          ) : (
            myMessages.map(msg => {
              const isSender = msg.senderId === user.id;
              return (
                <div key={msg.id} className={`glass-card p-5 rounded-xl ${!isSender ? 'border-l-4 border-l-github-accent' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs text-github-muted uppercase tracking-wider font-semibold">
                        {isSender ? 'To: ' : 'From: '}
                      </span>
                      <span className="font-medium text-white">
                        {isSender ? 'Item Owner' : msg.senderName}
                      </span>
                      <span className="text-github-border mx-2">•</span>
                      <span className="text-xs text-github-muted">Regarding: <span className="font-medium text-github-text">{msg.itemTitle}</span></span>
                    </div>
                    <span className="text-xs text-github-muted">{new Date(msg.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-github-text text-sm bg-[#010409]/50 p-3 rounded-lg border border-github-border/50">{msg.content}</p>
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