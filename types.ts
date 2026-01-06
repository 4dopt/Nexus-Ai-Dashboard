
export type NavigationItem = 'dashboard' | 'reservations' | 'orders' | 'knowledge' | 'analytics' | 'growth' | 'settings' | 'security' | 'help';

export interface Reservation {
  id: string;
  guestName: string;
  partySize: number;
  time: string;
  status: 'confirmed' | 'seated' | 'cancelled' | 'pending';
  notes?: string;
  avatarUrl: string;
  email?: string;
  phone?: string;
  table?: string;
  date?: string;
}

export interface Metric {
  label: string;
  value: string;
  subValue?: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  status: 'indexed' | 'processing' | 'error';
}

export interface CrmEntry {
  id: string;
  name: string;
  phone: string;
  tags: ('Regular' | 'New' | 'No-Show' | 'VIP')[];
  lastVisit: string;
  totalVisits: number;
  blocked: boolean;
}

export interface InsightMetric {
  keyword: string;
  count: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  serverName: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid';
  items: OrderItem[];
  total: number;
  createdAt: string; 
}