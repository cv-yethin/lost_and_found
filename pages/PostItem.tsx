import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Sparkles, MapPin, Calendar, Type as TypeIcon, Upload, X } from 'lucide-react';
import { StorageService } from '../services/storage';
import { analyzeImage } from '../services/gemini';
import { ItemCategory, User } from '../types';

interface PostItemProps {
  user: User | null;
}

const PostItem: React.FC<PostItemProps> = ({ user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
      <div className="max-w-md mx-auto mt-20 text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
          <Sparkles size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Login Required</h2>
        <p className="text-slate-500 mb-6">Please login to post a lost or found item to the community.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all w-full"
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

  const handleAIAnalyze = async () => {
    if (!imagePreview) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(imagePreview);
      if (result) {
        setFormData(prev => ({
          ...prev,
          title: result.title,
          description: result.description,
          category: result.category.toLowerCase() === 'found' ? ItemCategory.FOUND : ItemCategory.LOST
        }));
      }
    } catch (error) {
      console.error("Analysis failed", error);
      alert("AI Analysis failed. Please check your API Key or try again.");
    } finally {
      setIsAnalyzing(false);
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
        <h1 className="text-2xl font-bold text-slate-900">Post an Item</h1>
        <p className="text-slate-500">Share details about what you lost or found.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-4">Item Image</label>
          
          <div className="flex flex-col items-center gap-4">
            {imagePreview ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100 group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value = '' }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
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

            {imagePreview && (
              <button
                type="button"
                onClick={handleAIAnalyze}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium text-sm hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Auto-fill with AI
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Details Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, category: ItemCategory.LOST})}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.category === ItemCategory.LOST 
                      ? 'bg-white text-rose-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Lost
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, category: ItemCategory.FOUND})}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.category === ItemCategory.FOUND 
                      ? 'bg-white text-emerald-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Found
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
            <div className="relative">
              <TypeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                placeholder="e.g., Blue Leather Wallet"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                placeholder="e.g., Central Park, near the fountain"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Provide as much detail as possible..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-4 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2.5 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
          >
            {isLoading ? 'Posting...' : 'Post Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostItem;