import { ChartBar, Database, LayoutDashboard, Users, CalendarDays, UtensilsCrossed } from "lucide-react";
import { Order } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
  { id: 'reservations', label: 'Reservations', icon: CalendarDays },
  { id: 'orders', label: 'Orders', icon: UtensilsCrossed },
  { id: 'knowledge', label: 'Knowledge Vault', icon: Database },
  { id: 'analytics', label: 'Kitchen Intel', icon: ChartBar },
  { id: 'growth', label: 'Growth Engine', icon: Users },
];

export const MOCK_RESERVATIONS = [
  { id: '1', guestName: 'James Miller', partySize: 4, time: '19:30', status: 'confirmed', notes: 'Anniversary', avatarUrl: 'https://picsum.photos/40/40?random=1', email: 'james.m@example.com', phone: '+1 555-0123', table: 'T4' },
  { id: '2', guestName: 'Sarah Chen', partySize: 2, time: '20:00', status: 'confirmed', notes: 'Vegan preference', avatarUrl: 'https://picsum.photos/40/40?random=2', email: 's.chen@example.com', phone: '+1 555-0199', table: 'T2' },
  { id: '3', guestName: 'Mike Ross', partySize: 6, time: '20:15', status: 'pending', notes: 'High chair needed', avatarUrl: 'https://picsum.photos/40/40?random=3', email: 'mike.r@example.com', phone: '+1 555-0200', table: '' },
  { id: '4', guestName: 'Jessica Pearson', partySize: 2, time: '18:45', status: 'seated', notes: 'VIP Table 4', avatarUrl: 'https://picsum.photos/seed/4/100/100', email: 'j.pearson@example.com', phone: '+1 555-0300', table: 'T1' },
  { id: '5', guestName: 'Harvey Specter', partySize: 3, time: '21:00', status: 'cancelled', notes: 'Reschedule requested', avatarUrl: 'https://picsum.photos/seed/5/100/100', email: 'harvey@example.com', phone: '+1 555-0400', table: '' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1024',
    tableId: 'T4',
    serverName: 'Jenny',
    status: 'preparing',
    total: 84.50,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
    items: [
      { id: '1', name: 'Truffle Pasta', quantity: 2, price: 24.00, notes: 'Extra cheese' },
      { id: '2', name: 'Caesar Salad', quantity: 1, price: 14.50 },
      { id: '3', name: 'Red Wine Glass', quantity: 2, price: 11.00 }
    ]
  },
  {
    id: 'ORD-1025',
    tableId: 'T2',
    serverName: 'Mark',
    status: 'pending',
    total: 42.00,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
    items: [
      { id: '4', name: 'Margherita Pizza', quantity: 1, price: 18.00 },
      { id: '5', name: 'Coke Zero', quantity: 2, price: 4.00 },
      { id: '6', name: 'Tiramisu', quantity: 2, price: 8.00 }
    ]
  },
  {
    id: 'ORD-1023',
    tableId: 'T1',
    serverName: 'Jenny',
    status: 'ready',
    total: 120.00,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 mins ago
    items: [
      { id: '7', name: 'Steak Frites', quantity: 2, price: 35.00, notes: 'Medium rare' },
      { id: '8', name: 'Lobster Bisque', quantity: 2, price: 15.00 },
      { id: '9', name: 'Sparkling Water', quantity: 1, price: 6.00 }
    ]
  },
  {
    id: 'ORD-1022',
    tableId: 'T8',
    serverName: 'Tom',
    status: 'served',
    total: 65.00,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(), // 45 mins ago
    items: [
      { id: '10', name: 'Burger', quantity: 2, price: 18.00 },
      { id: '11', name: 'Fries', quantity: 2, price: 5.00 },
      { id: '12', name: 'Beer', quantity: 2, price: 7.00 }
    ]
  }
];