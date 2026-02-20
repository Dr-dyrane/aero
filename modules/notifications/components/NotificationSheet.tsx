'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Shield, Sparkles, Activity, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { useNotificationStore } from '../stores/useNotificationStore';
import { AeroCard, AeroPill, AeroButton } from '@/modules/ui';
import { cn } from '@/lib/utils';
import { NotificationType } from '../types';
import { useFeedback } from '@/modules/ui/hooks/useFeedback';

interface NotificationSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

import { useAeroStore } from '@/store/useAeroStore';

export function NotificationSheet({ isOpen, onClose }: NotificationSheetProps) {
    const { notifications, markAsRead, clearAll, unreadCount } = useNotificationStore();
    const { playTap, playError } = useFeedback();
    const language = useAeroStore((s) => s.language);

    const content = {
        en: {
            title: "Notifications",
            empty: "All bio-signals are clear.",
            archive: "Archive All Signals",
            types: {
                alert: "Critical",
                merit: "Merit",
                security: "Security",
                update: "Protocol"
            }
        },
        ar: {
            title: "التنبيهات",
            empty: "جميع الإشارات الحيوية واضحة.",
            archive: "أرشفة جميع الإشارات",
            types: {
                alert: "حرج",
                merit: "استحقاق",
                security: "أمني",
                update: "بروتوكول"
            }
        }
    };

    const t = language === 'ar' ? content.ar : content.en;

    const TYPE_CONFIG: Record<NotificationType, { icon: any, color: string, label: string }> = {
        alert: { icon: Activity, color: 'text-destructive', label: t.types.alert },
        merit: { icon: Sparkles, color: 'text-primary', label: t.types.merit },
        security: { icon: Shield, color: 'text-gold', label: t.types.security },
        update: { icon: Clock, color: 'text-muted-foreground', label: t.types.update },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[800] bg-black/40 backdrop-blur-sm mx-auto max-w-[430px]"
                    />

                    {/* Panel: Right-aligned liquid sheet (mirrors sidebar) */}
                    <motion.div
                        initial={{ x: language === 'ar' ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: language === 'ar' ? '-100%' : '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed inset-y-0 z-[810] w-[90%] max-w-[380px] bg-background/60 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col border-none",
                            language === 'ar' ? "left-0 rounded-r-[40px]" : "right-0 rounded-l-[40px]"
                        )}
                    >
                        {/* Header */}
                        <div className="p-6 pb-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                <h2 className="font-serif text-lg font-semibold">{t.title}</h2>
                                {unreadCount > 0 && (
                                    <AeroPill variant="accent" className="px-1.5 py-0 text-[10px]">{unreadCount}</AeroPill>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    playTap();
                                    onClose();
                                }}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Notification List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <CheckCircle2 className="h-8 w-8 text-muted-foreground/20" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{t.empty}</p>
                                </div>
                            ) : (
                                notifications.map((n) => {
                                    const config = TYPE_CONFIG[n.type];
                                    return (
                                        <motion.div
                                            key={n.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => markAsRead(n.id)}
                                            className={cn(
                                                "group relative p-4 rounded-3xl transition-all active:scale-[0.98] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04]",
                                                !n.isRead && "bg-primary/[0.03] border-primary/10"
                                            )}
                                        >
                                            {!n.isRead && (
                                                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
                                            )}

                                            <div className="flex gap-3 text-left rtl:text-right">
                                                <div className={cn("h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center bg-white/5", config.color)}>
                                                    <config.icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className={cn("text-[9px] font-bold uppercase tracking-widest", config.color)}>
                                                            {config.label}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground">{n.timestamp}</span>
                                                    </div>
                                                    <h3 className="text-sm font-semibold text-foreground mb-1 leading-tight">{n.title}</h3>
                                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{n.description}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer Actions */}
                        {notifications.length > 0 && (
                            <div className="p-6 border-t border-white/5">
                                <button
                                    onClick={() => {
                                        playError();
                                        clearAll();
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {t.archive}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
