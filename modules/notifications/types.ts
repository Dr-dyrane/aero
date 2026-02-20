export type NotificationType = 'alert' | 'merit' | 'update' | 'security';

export interface AeroNotification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
}
