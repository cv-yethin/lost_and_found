import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Calendar, Type as TypeIcon, X, AlertCircle } from 'lucide-react';
import { StorageService } from '../services/storage';
import { ItemCategory, User } from '../types';

interface PostItemProps {
  user: User | null;
}

const PostItem: React.FC<PostItemProps> = ({ user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ItemCategory.LOST,
    location: '',
    date: new Date().toISOString().split('T')[0],
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-8 glass-panel rounded-2xl shadow-xl">
        <div className="w-16 h-16 bg-github-accent/10 border border-github-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 text-github-accent">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Login Required</h2>
        <p className="text-github-muted mb-6">Please login to post a lost or found item to the community.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-github-accent hover:bg-blue-400 text-white rounded-full font-medium transition-all w-full shadow-[0_0_15px_rgba(88,166,255,0.3)]"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      StorageService.createItem({
        ...formData,
        imageUrl: imagePreview || undefined,
        date: formData.date
      }, user);
      
      setIsLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Post an Item</h1>
        <p className="text-github-muted">Share details about what you lost or found.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl">
          <label className="block text-sm font-medium text-github-text mb-4">Item Image</label>
          
          <div className="flex flex-col items-center gap-4">
            {imagePreview ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#010409] border border-github-border group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value = '' }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-sm"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-github-border rounded-xl flex flex-col items-center justify-center text-github-muted cursor-pointer hover:border-github-accent hover:text-github-accent hover:bg-github-accent/5 transition-all"
              >
                <Camera size={32} className="mb-2" />
                <span className="text-sm font-medium">Click to upload photo</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        {/* Details Form */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-github-text mb-2">Category</label>
              <div className="flex bg-[#010409] p-1 rounded-lg border border-github-border">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, category: ItemCategory.LOST})}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.category === ItemCategory.LOST 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'text-github-muted hover:text-white'
                  }`}
                >
                  Lost
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, category: ItemCategory.FOUND})}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.category === ItemCategory.FOUND 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'text-github-muted hover:text-white'
                  }`}
                >
                  Found
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-github-text mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-github-muted" size={18} />
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 rounded-lg glass-input focus:outline-none focus:border-github-accent focus:ring-1 focus:ring-github-accent/50 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-github-text mb-2">Title</label>
            <div className="relative">
              <TypeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-github-muted" size={18} />
              <input
                type="text"
                required
                placeholder="e.g., Blue Leather Wallet"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full pl-10 pr-4 py-2 rounded-lg glass-input focus:outline-none focus:border-github-accent focus:ring-1 focus:ring-github-accent/50 placeholder-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-github-text mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-github-muted" size={18} />
              <input
                type="text"
                required
                placeholder="e.g., Central Park, near the fountain"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full pl-10 pr-4 py-2 rounded-lg glass-input focus:outline-none focus:border-github-accent focus:ring-1 focus:ring-github-accent/50 placeholder-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-github-text mb-2">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Provide as much detail as possible..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-4 rounded-lg glass-input focus:outline-none focus:border-github-accent focus:ring-1 focus:ring-github-accent/50 resize-none placeholder-gray-600"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2.5 text-github-muted font-medium hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2.5 bg-github-accent text-white font-medium rounded-full hover:bg-blue-400 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(88,166,255,0.4)]"
          >
            {isLoading ? 'Posting...' : 'Post Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostItem;