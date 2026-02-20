'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigator } from '@/lib/navigation';
import { Menu, Bell, X, User, Heart, Activity, ShieldCheck, LayoutDashboard, ChevronLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AeroCard } from './AeroCard';
import { AeroPill } from './AeroPill';
import { ThemeToggle } from './ThemeToggle';

import { useAeroStore } from '@/store/useAeroStore';
import { useLayout } from '../providers/LayoutProvider';

import { NotificationSheet, useNotificationStore } from '@/modules/notifications';

interface TopNavProps {
    title?: string;
    onBack?: () => void;
}

const AVATAR_URL = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200";

export function TopNav({ title, onBack }: TopNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const { isNavVisible } = useLayout();
    const nav = useNavigator();
    const pathname = usePathname();
    const demoMode = useAeroStore((s) => s.demoMode);
    const unreadCount = useNotificationStore((s) => s.unreadCount);

    // Close sheets on route change
    useEffect(() => {
        setIsOpen(false);
        setIsNotifOpen(false);
    }, [pathname]);

    const hasBack = onBack || pathname !== '/dashboard';

    return (
        <>
            <motion.header
                animate={{ y: isNavVisible ? 0 : -100 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "fixed top-0 left-1/2 z-[55] flex h-20 w-full max-w-[430px] -translate-x-1/2 items-center justify-between z-10",
                    hasBack ? "px-1" : "px-6",
                    "pointer-events-none"
                )}
            >
                <div className="flex items-center gap-0 pointer-events-auto">
                    {/* Context Aware Back Button */}
                    {hasBack && (
                        <button
                            onClick={onBack || (() => window.history.back())}
                            className="flex h-10 w-8 items-center justify-center rounded-full bg-transparent backdrop-blur-sm transition-transform active:scale-95"
                        >
                            <ChevronLeft className="h-5 w-5 text-foreground" />
                        </button>
                    )}

                    {/* TRIGGER: Avatar (High Fidelity) */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent backdrop-blur-sm transition-transform active:scale-95 overflow-hidden border border-white/5 shadow-sm"
                    >
                        <img src={AVATAR_URL} alt="AERO User" className="w-full h-full object-cover" />
                    </button>

                    {/* DEMO Marker in Nav: Restored premium style with AI icon */}
                    {demoMode && (
                        <div className="ml-1.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                            <Sparkles className="h-2.5 w-2.5 text-primary animate-pulse" />
                            <span className="text-[8px] font-bold text-primary tracking-widest uppercase">Demo</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 pointer-events-auto">
                    {/* Page Title: Right Aligned */}
                    {title && (
                        <motion.h2
                            key={title}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-serif text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase text-right"
                        >
                            {title}
                        </motion.h2>
                    )}

                    <button
                        onClick={() => setIsNotifOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent backdrop-blur-sm transition-transform active:scale-95 relative"
                    >
                        <Bell className="h-5 w-5 text-foreground" />
                        {unreadCount > 0 && (
                            <div className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
                        )}
                    </button>
                </div>
            </motion.header>

            {/* Notification Sheet */}
            <NotificationSheet
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
            />

            {/* LIQUID SIDE PANEL (SHEET) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm mx-auto max-w-[430px]"
                        />

                        {/* Panel: Borderless, Rounded-R, Transparent Blur */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-[110] w-[85%] max-w-[360px] bg-background/60 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col rounded-r-[40px] border-none"
                        >
                            {/* Liquid BG for Sheet */}
                            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                                <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
                                <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-aero-blue/10 blur-[120px]" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col h-full p-6">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full border border-primary/20 p-0.5">
                                            <div className="h-full w-full rounded-full overflow-hidden">
                                                <img src={AVATAR_URL} alt="User" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-lg font-semibold">Patient File</h3>
                                            <p className="text-[10px] tracking-widest text-muted-foreground uppercase font-bold">AERO-1092-B</p>
                                        </div>
                                    </div>

                                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                        <X className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </div>

                                {/* Summary Card */}
                                <AeroCard className="mb-8 border-none bg-white/[0.03]">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Heart className="h-3.5 w-3.5 text-destructive" />
                                                Vital Baseline
                                            </div>
                                            <span className="text-sm font-numbers font-medium text-foreground">Optimal</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Activity className="h-3.5 w-3.5 text-primary" />
                                                Bio-Connectivity
                                            </div>
                                            <span className="text-sm font-numbers font-medium text-foreground">98%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                                                Vault Insurance
                                            </div>
                                            <AeroPill variant="accent" className="text-[8px] py-0">ACTIVE</AeroPill>
                                        </div>
                                    </div>
                                </AeroCard>

                                {/* Navigation Links */}
                                <div className="flex flex-col gap-2 flex-1">
                                    <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-bold mb-2 ml-2">Navigation</p>
                                    {[
                                        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                                        { name: 'Bio-Vault Portfolio', path: '/vault', icon: ShieldCheck },
                                        { name: 'Identity & Security', path: '/settings', icon: User },
                                        { name: 'Baseline Diagnostics', path: '/scan', icon: Activity },
                                    ].map((link) => (
                                        <button
                                            key={link.path}
                                            onClick={() => {
                                                if (link.path === '/vault') nav.goToVault();
                                                else if (link.path === '/settings') nav.goToSettings();
                                                else if (link.path === '/scan') nav.goToScan();
                                                else nav.goToDashboard();
                                                setIsOpen(false);
                                            }}
                                            className={cn(
                                                "group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all active:scale-[0.98] border-none",
                                                pathname === link.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                            )}
                                        >
                                            <link.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", pathname === link.path ? "text-primary" : "text-muted-foreground")} />
                                            <span className="text-sm font-medium tracking-wide">{link.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <p className="text-[10px] text-muted-foreground">
                                        AERO v1.0.4 <br />
                                        Sovereign Bio-Identity Protocol
                                    </p>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
