import { Item, User, Message, ItemCategory, ItemStatus } from '../types';

const STORAGE_KEYS = {
  USERS: 'lf_users',
  ITEMS: 'lf_items',
  MESSAGES: 'lf_messages',
  CURRENT_USER: 'lf_current_user',
};

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const StorageService = {
  // --- Auth ---
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },

  login: (email: string): User => {
    // Simulated login - simply finds or creates a user by email
    const users = StorageService.getUsers();
    let user = users.find(u => u.email === email);
    
    if (!user) {
      user = {
        id: generateId(),
        username: email.split('@')[0],
        email,
      };
      users.push(user);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getUsers: (): User[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : [];
  },

  // --- Items ---
  getItems: (): Item[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ITEMS);
    // Return sorted by date desc
    const items: Item[] = stored ? JSON.parse(stored) : [];
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getItemById: (id: string): Item | undefined => {
    const items = StorageService.getItems();
    return items.find(i => i.id === id);
  },

  createItem: (itemData: Omit<Item, 'id' | 'createdAt' | 'status' | 'postedByName' | 'postedBy'>, user: User): Item => {
    const items = StorageService.getItems();
    const newItem: Item = {
      ...itemData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: ItemStatus.UNCLAIMED,
      postedBy: user.id,
      postedByName: user.username,
    };
    items.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    return newItem;
  },

  updateItemStatus: (itemId: string, status: ItemStatus) => {
    const items = StorageService.getItems();
    const index = items.findIndex(i => i.id === itemId);
    if (index !== -1) {
      items[index].status = status;
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    }
  },

  deleteItem: (itemId: string) => {
    let items = StorageService.getItems();
    items = items.filter(i => i.id !== itemId);
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  },

  // --- Messages ---
  sendMessage: (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const messages = StorageService.getMessages();
    const newMessage: Message = {
      ...messageData,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };
    messages.push(newMessage);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  },

  getMessages: (): Message[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return stored ? JSON.parse(stored) : [];
  },

  getUserMessages: (userId: string): Message[] => {
    const messages = StorageService.getMessages();
    return messages.filter(m => m.receiverId === userId || m.senderId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};