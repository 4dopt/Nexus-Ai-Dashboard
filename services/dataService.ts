import { Reservation, CrmEntry, Order, DocumentFile } from '../types';
import { MOCK_ORDERS, MOCK_RESERVATIONS, NAV_ITEMS } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

type Listener<T> = (payload: T) => void;

export interface SearchResult {
    id: string;
    type: 'Page' | 'Guest' | 'Order' | 'Reservation' | 'File' | 'Action';
    title: string;
    subtitle?: string;
    route: string; // The tab ID to navigate to
    icon?: any;
    metadata?: any;
}

class DataService {
  // --- LOCAL STATE (Fallbacks & Cache) ---
  private reservations: Reservation[] = MOCK_RESERVATIONS as Reservation[];
  private orders: Order[] = [...MOCK_ORDERS];
  private crmData: CrmEntry[] = [
    { id: 'c1', name: 'James Miller', phone: '+1 555-0101', tags: ['Regular', 'VIP'], lastVisit: '2023-10-25', totalVisits: 12, blocked: false },
    { id: 'c2', name: 'Sarah Chen', phone: '+1 555-0102', tags: ['New'], lastVisit: '2023-11-01', totalVisits: 1, blocked: false },
    { id: 'c3', name: 'Tom Haverford', phone: '+1 555-0103', tags: ['No-Show'], lastVisit: '2023-09-15', totalVisits: 3, blocked: true },
  ];
  private knowledgeFiles: DocumentFile[] = [
    { id: '1', name: 'Dinner_Menu_Winter.pdf', size: '2.4 MB', type: 'application/pdf', uploadDate: '2023-10-24', status: 'indexed' },
    { id: '2', name: 'Wine_List_2024.docx', size: '1.1 MB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploadDate: '2023-11-01', status: 'indexed' }
  ];

  private listeners: Listener<Reservation[]>[] = [];
  private orderListeners: Listener<Order[]>[] = [];
  
  private reservationChannel: RealtimeChannel | null = null;

  constructor() {
    if (isSupabaseConfigured()) {
        this.initSupabaseRealtime();
    }
  }

  // --- SUPABASE REALTIME ---
  private async initSupabaseRealtime() {
    // Subscribe to Reservations Table changes
    this.reservationChannel = supabase
        .channel('public:reservations')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, async (payload) => {
            // Refresh data on any change
            await this.refreshReservations();
        })
        .subscribe();
  }

  // --- HELPER ---
  private notifyListeners() {
    const data = [...this.reservations];
    this.listeners.forEach(l => l(data));
  }

  private notifyOrderListeners() {
    const data = [...this.orders];
    this.orderListeners.forEach(l => l(data));
  }

  // --- AUTH METHODS ---
  async signIn(email: string): Promise<{ error: any }> {
      if (!isSupabaseConfigured()) return { error: null }; // Mock success
      const { error } = await supabase.auth.signInWithOtp({ email });
      return { error };
  }

  async signOut() {
      if (isSupabaseConfigured()) await supabase.auth.signOut();
  }

  async getSession() {
      if (!isSupabaseConfigured()) return { session: { user: { email: 'demo@resto.ai' } } };
      const { data } = await supabase.auth.getSession();
      return data;
  }

  // --- RESERVATION METHODS ---

  async refreshReservations() {
      if (isSupabaseConfigured()) {
          const { data, error } = await supabase.from('reservations').select('*').order('time', { ascending: true });
          if (!error && data) {
              this.reservations = data;
              this.notifyListeners();
          }
      }
  }

  async getReservations(): Promise<Reservation[]> {
    if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('reservations').select('*');
        if (!error && data) this.reservations = data;
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.reservations]), 300);
    });
  }

  subscribeToReservations(callback: Listener<Reservation[]>): () => void {
    this.listeners.push(callback);
    callback([...this.reservations]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async addReservation(res: Omit<Reservation, 'id' | 'avatarUrl' | 'status'>): Promise<void> {
      const newRes: Reservation = {
          ...res,
          id: Date.now().toString(),
          status: 'pending',
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(res.guestName)}&background=random&color=fff`
      };

      if (isSupabaseConfigured()) {
          const { error } = await supabase.from('reservations').insert([newRes]);
          if (error) console.error("Supabase Error:", error);
          // Realtime subscription will handle the UI update
      } else {
          // Mock Logic
          await new Promise(r => setTimeout(r, 400));
          this.reservations = [newRes, ...this.reservations];
          this.notifyListeners();
      }
  }

  async updateReservationStatus(id: string, status: Reservation['status']): Promise<void> {
      if (isSupabaseConfigured()) {
          await supabase.from('reservations').update({ status }).eq('id', id);
      } else {
          await new Promise(r => setTimeout(r, 200));
          this.reservations = this.reservations.map(r => r.id === id ? { ...r, status } : r);
          this.notifyListeners();
      }
  }
  
  async checkInGuest(id: string): Promise<void> {
    return this.updateReservationStatus(id, 'seated');
  }

  // --- ORDER METHODS ---

  async getOrders(): Promise<Order[]> {
    // In a real app, fetch from Supabase here too
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.orders]), 300);
    });
  }

  subscribeToOrders(callback: Listener<Order[]>): () => void {
    this.orderListeners.push(callback);
    callback([...this.orders]);
    return () => {
      this.orderListeners = this.orderListeners.filter(l => l !== callback);
    };
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
      await new Promise(r => setTimeout(r, 150)); 
      this.orders = this.orders.map(o => o.id === id ? { ...o, status } : o);
      this.notifyOrderListeners();
  }

  // --- CRM METHODS ---

  async getCrmData(): Promise<CrmEntry[]> {
    return new Promise(resolve => setTimeout(() => resolve(this.crmData), 400));
  }

  async toggleBlockUser(id: string): Promise<void> {
    this.crmData = this.crmData.map(c => c.id === id ? { ...c, blocked: !c.blocked } : c);
  }

  // --- GLOBAL SEARCH ENGINE ---
  // This aggregates everything into a standard searchable format
  async searchGlobal(query: string): Promise<SearchResult[]> {
      if (!query) return [];
      const q = query.toLowerCase();
      const results: SearchResult[] = [];

      // 1. Search Navigation (Static)
      NAV_ITEMS.forEach(item => {
          if (item.label.toLowerCase().includes(q)) {
              results.push({
                  id: `page-${item.id}`,
                  type: 'Page',
                  title: item.label,
                  subtitle: 'Navigate to page',
                  route: item.id
              });
          }
      });

      // 2. Search Reservations
      this.reservations.forEach(res => {
          if (
              res.guestName.toLowerCase().includes(q) || 
              (res.id && res.id.includes(q)) || 
              (res.table && res.table.toLowerCase().includes(q))
          ) {
              results.push({
                  id: `res-${res.id}`,
                  type: 'Reservation',
                  title: res.guestName,
                  subtitle: `${res.time} • ${res.partySize}ppl • ${res.status}`,
                  route: 'reservations',
                  metadata: { reservationId: res.id }
              });
          }
      });

      // 3. Search Orders
      this.orders.forEach(ord => {
          // Check items inside order
          const hasItemMatch = ord.items.some(i => i.name.toLowerCase().includes(q));
          
          if (
              ord.id.toLowerCase().includes(q) || 
              ord.tableId.toLowerCase().includes(q) ||
              ord.serverName.toLowerCase().includes(q) ||
              hasItemMatch
          ) {
              const matchedItems = ord.items.map(i => i.name).join(', ').slice(0, 30);
              results.push({
                  id: `ord-${ord.id}`,
                  type: 'Order',
                  title: `Order #${ord.tableId} (${ord.serverName})`,
                  subtitle: `${ord.status} • Includes: ${matchedItems}...`,
                  route: 'orders'
              });
          }
      });

      // 4. Search CRM
      this.crmData.forEach(customer => {
          if (customer.name.toLowerCase().includes(q) || customer.phone.includes(q)) {
              results.push({
                  id: `crm-${customer.id}`,
                  type: 'Guest',
                  title: customer.name,
                  subtitle: `${customer.phone} • ${customer.tags.join(', ')}`,
                  route: 'growth'
              });
          }
      });

      // 5. Search Knowledge Base
      this.knowledgeFiles.forEach(file => {
          if (file.name.toLowerCase().includes(q)) {
              results.push({
                  id: `file-${file.id}`,
                  type: 'File',
                  title: file.name,
                  subtitle: `Knowledge Base • ${file.status}`,
                  route: 'knowledge'
              });
          }
      });

      return results;
  }
}

export const dataService = new DataService();