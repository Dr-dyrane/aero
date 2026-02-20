import { create } from 'zustand';
import { AeroNotification } from '../types';

interface NotificationState {
    notifications: AeroNotification[];
    unreadCount: number;
    addNotification: (n: Omit<AeroNotification, 'id' | 'isRead' | 'timestamp'>) => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [
        {
            id: '1',
            type: 'alert',
            title: 'Bio-Chrono Desync',
            description: 'Secondary vitals are 0.4s out of sync with primary baseline. Recalibrate via Scan.',
            timestamp: '2m ago',
            isRead: false,
            priority: 'high',
        },
        {
            id: '2',
            type: 'merit',
            title: 'Stellar discipline Earned',
            description: '7-day clean streak detected. 500 Aero Credits deposited to Bio-Vault.',
            timestamp: '1h ago',
            isRead: false,
            priority: 'medium',
        },
        {
            id: '3',
            type: 'security',
            title: 'New Identity Link',
            description: 'Authorized access from a new biometric terminal in London, UK.',
            timestamp: '5h ago',
            isRead: true,
            priority: 'medium',
        },
        {
            id: '4',
            type: 'update',
            title: 'Protocol 4.0 Active',
            description: 'Your Aero Terminal has been upgraded to the latest biological sovereignty layer.',
            timestamp: 'Yesterday',
            isRead: true,
            priority: 'low',
        },
    ],
    unreadCount: 2,
    addNotification: (n) => set((state) => {
        const newN = {
            ...n,
            id: Math.random().toString(36).substr(2, 9),
            isRead: false,
            timestamp: 'Just now',
        };
        return {
            notifications: [newN, ...state.notifications],
            unreadCount: state.unreadCount + 1
        };
    }),
    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
    })),
    clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
