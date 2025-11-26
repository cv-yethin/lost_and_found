import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, Search, Filter } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Item, ItemCategory, ItemStatus } from '../types';

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ItemCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ItemStatus>(ItemStatus.UNCLAIMED);

  useEffect(() => {
    // Simulate fetching data
    const allItems = StorageService.getItems();
    setItems(allItems);
    setFilteredItems(allItems);
  }, []);

  useEffect(() => {
    let result = items;

    // Filter by Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerTerm) ||
          item.description.toLowerCase().includes(lowerTerm) ||
          item.location.toLowerCase().includes(lowerTerm)
      );
    }

    // Filter by Category
    if (categoryFilter !== 'all') {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Filter by Status (default to unclaimed usually)
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }

    setFilteredItems(result);
  }, [items, searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Hero / Filter Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Community Board</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search lost keys, wallets, locations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <select
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
            >
              <option value="all">All Categories</option>
              <option value={ItemCategory.LOST}>Lost Items</option>
              <option value={ItemCategory.FOUND}>Found Items</option>
            </select>

            <select
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
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
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Search className="text-slate-300" size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No items found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">
            Try adjusting your search or filters. If you found something, please post it!
          </p>
          <Link to="/post" className="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors">
            Post an Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <span className="text-4xl">?</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-md shadow-sm ${
                      item.category === ItemCategory.LOST
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {item.category}
                  </span>
                  {item.status === ItemStatus.CLAIMED && (
                     <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-md shadow-sm bg-slate-800 text-white">
                       Claimed
                     </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
                  {item.description}
                </p>

                <div className="space-y-2 mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center text-xs text-slate-500">
                    <MapPin size={14} className="mr-1.5 text-slate-400" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar size={14} className="mr-1.5 text-slate-400" />
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