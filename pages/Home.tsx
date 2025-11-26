import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Search } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Item, ItemCategory, ItemStatus } from '../types';

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ItemCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ItemStatus>(ItemStatus.UNCLAIMED);

  useEffect(() => {
    const allItems = StorageService.getItems();
    setItems(allItems);
    setFilteredItems(allItems);
  }, []);

  useEffect(() => {
    let result = items;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerTerm) ||
          item.description.toLowerCase().includes(lowerTerm) ||
          item.location.toLowerCase().includes(lowerTerm)
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter((item) => item.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }

    setFilteredItems(result);
  }, [items, searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Hero / Filter Section */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Community Board</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-github-muted" size={20} />
            <input
              type="text"
              placeholder="Search lost keys, wallets, locations..."
              className="w-full pl-10 pr-4 py-3 rounded-xl glass-input focus:outline-none focus:ring-1 focus:ring-github-accent/50 transition-all placeholder-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <select
              className="px-4 py-3 bg-[#0d1117] border border-github-border rounded-xl text-sm font-medium text-github-text focus:outline-none focus:ring-1 focus:ring-github-accent/50 cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
            >
              <option value="all">All Categories</option>
              <option value={ItemCategory.LOST}>Lost Items</option>
              <option value={ItemCategory.FOUND}>Found Items</option>
            </select>

            <select
              className="px-4 py-3 bg-[#0d1117] border border-github-border rounded-xl text-sm font-medium text-github-text focus:outline-none focus:ring-1 focus:ring-github-accent/50 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value={ItemStatus.UNCLAIMED}>Unclaimed</option>
              <option value={ItemStatus.CLAIMED}>Claimed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl border-dashed border-github-border">
          <div className="mx-auto w-16 h-16 bg-github-bg rounded-full flex items-center justify-center mb-4 border border-github-border">
            <Search className="text-github-muted" size={32} />
          </div>
          <h3 className="text-lg font-medium text-white">No items found</h3>
          <p className="text-github-muted max-w-sm mx-auto mt-2">
            Try adjusting your search or filters. If you found something, please post it!
          </p>
          <Link to="/post" className="mt-6 inline-block px-6 py-2 bg-github-accent hover:bg-blue-400 text-white rounded-full font-medium transition-colors shadow-[0_0_15px_rgba(88,166,255,0.4)]">
            Post an Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className="group glass-card rounded-xl overflow-hidden hover:border-github-accent/30 transition-all duration-300 flex flex-col hover:shadow-[0_0_20px_rgba(0,0,0,0.4)]"
            >
              <div className="aspect-video bg-[#010409] relative overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-github-border">
                    <span className="text-4xl font-light">?</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-md shadow-lg backdrop-blur-md ${
                      item.category === ItemCategory.LOST
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}
                  >
                    {item.category}
                  </span>
                  {item.status === ItemStatus.CLAIMED && (
                     <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-md shadow-lg backdrop-blur-md bg-gray-700/50 text-gray-300 border border-gray-600/50">
                       Claimed
                     </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-white mb-2 line-clamp-1 group-hover:text-github-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-github-muted text-sm mb-4 line-clamp-2 flex-grow">
                  {item.description}
                </p>

                <div className="space-y-2 mt-auto pt-4 border-t border-github-border/50">
                  <div className="flex items-center text-xs text-github-muted">
                    <MapPin size={14} className="mr-1.5 text-gray-500" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center text-xs text-github-muted">
                    <Calendar size={14} className="mr-1.5 text-gray-500" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;