export enum ItemCategory {
  LOST = 'lost',
  FOUND = 'found',
}

export enum ItemStatus {
  UNCLAIMED = 'unclaimed',
  CLAIMED = 'claimed',
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  location: string;
  date: string;
  imageUrl?: string;
  status: ItemStatus;
  postedBy: string; // User ID
  postedByName: string;
  createdAt: string;
}

export interface Message {
  id: string;
  itemId: string;
  itemTitle: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}