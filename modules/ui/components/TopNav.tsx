'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigator } from '@/lib/navigation';
import { Menu, Bell, X, User, Heart, Activity, ShieldCheck, LayoutDashboard, ChevronLeft, Sparkles, LogOut } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AeroCard } from './AeroCard';
import { AeroPill } from './AeroPill';
import { ThemeToggle } from './ThemeToggle';

import { useAeroStore } from '@/store/useAeroStore';
import { useLayout } from '../providers/LayoutProvider';
import { useAuth } from '@/modules/auth';

import { NotificationSheet, useNotificationStore } from '@/modules/notifications';

interface TopNavProps {
    title?: string;
    onBack?: () => void;
    scrollSensitivity?: boolean;
}

const AVATAR_URL = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200";

export function TopNav({ title, onBack, scrollSensitivity = true }: TopNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const { isNavVisible, setScrollSensitivity } = useLayout();
    const nav = useNavigator();
    const pathname = usePathname();
    const { demoMode, language, setDemoMode, setLanguage } = useAeroStore();
    const unreadCount = useNotificationStore((s) => s.unreadCount);
    const { signOut } = useAuth();

    const content = {
        en: {
            demo: "Demo",
            patientFile: "Patient File",
            vitalBaseline: "Vital Baseline",
            optimal: "Optimal",
            bioConnectivity: "Bio-Connectivity",
            vaultInsurance: "Vault Insurance",
            active: "ACTIVE",
            navigation: "Navigation",
            dashboard: "Dashboard",
            bioVault: "Bio-Vault Portfolio",
            identity: "Identity & Security",
            diagnostics: "Baseline Diagnostics",
            sovereign: "Sovereign Bio-Identity Protocol",
            signOut: "De-authenticate"
        },
        ar: {
            demo: "تجريبي",
            patientFile: "ملف المريض",
            vitalBaseline: "خط الأساس الحيوي",
            optimal: "مثالي",
            bioConnectivity: "الاتصال الحيوي",
            vaultInsurance: "تأمين الخزنة",
            active: "نشط",
            navigation: "التنقل",
            dashboard: "لوحة التحكم",
            bioVault: "محفظة الخزنة الحيوية",
            identity: "الهوية والأمن",
            diagnostics: "تشخيصات الأساس",
            sovereign: "بروتوكول الهوية الحيوية السيادية",
            signOut: "تسجيل الخروج"
        }
    };

    const t = language === 'ar' ? content.ar : content.en;

    // Sync scroll sensitivity
    useEffect(() => {
        setScrollSensitivity(scrollSensitivity);
    }, [scrollSensitivity, setScrollSensitivity]);

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
                            <ChevronLeft className="h-5 w-5 text-foreground rtl:rotate-180" />
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
                        <div className="mx-1.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                            <Sparkles className="h-2.5 w-2.5 text-primary animate-pulse" />
                            <span className="text-[8px] font-bold text-primary tracking-widest uppercase">{t.demo}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 pointer-events-auto">
                    {/* Page Title: Right Aligned */}
                    {title && (
                        <motion.h2
                            key={title}
                            initial={{ opacity: 0, x: language === 'ar' ? -10 : 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-serif text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase text-right rtl:text-left"
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
                            <div className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
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
                            initial={{ x: language === 'ar' ? '100%' : '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: language === 'ar' ? '100%' : '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={cn(
                                "fixed inset-y-0 z-[110] w-[85%] max-w-[360px] bg-background/60 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col border-none",
                                language === 'ar' ? "right-0 rounded-l-[40px]" : "left-0 rounded-r-[40px]"
                            )}
                        >
                            {/* Liquid BG for Sheet */}
                            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                                <div className={cn("absolute -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[100px]", language === 'ar' ? "-right-20" : "-left-20")} />
                                <div className={cn("absolute bottom-20 h-80 w-80 rounded-full bg-aero-blue/10 blur-[120px]", language === 'ar' ? "left-0" : "right-0")} />
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
                                        <div className="text-left rtl:text-right">
                                            <h3 className="font-serif text-lg font-semibold">{t.patientFile}</h3>
                                            <p className="text-[10px] tracking-widest text-muted-foreground uppercase font-bold">{language === 'ar' ? 'أيرو-١٠٩٢-ب' : 'AERO-1092-B'}</p>
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
                                                {t.vitalBaseline}
                                            </div>
                                            <span className="text-sm font-numbers font-medium text-foreground">{t.optimal}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Activity className="h-3.5 w-3.5 text-primary" />
                                                {t.bioConnectivity}
                                            </div>
                                            <span className="text-sm font-numbers font-medium text-foreground">98%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                                                {t.vaultInsurance}
                                            </div>
                                            <AeroPill variant="accent" className="text-[8px] py-0">{t.active}</AeroPill>
                                        </div>
                                    </div>
                                </AeroCard>

                                {/* Navigation Links */}
                                <div className="flex flex-col gap-2 flex-1">
                                    <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-bold mb-2 ml-2 rtl:ml-0 rtl:mr-2">{t.navigation}</p>
                                    {[
                                        { name: t.dashboard, path: '/dashboard', icon: LayoutDashboard },
                                        { name: t.bioVault, path: '/vault', icon: ShieldCheck },
                                        { name: t.identity, path: '/settings', icon: User },
                                        { name: t.diagnostics, path: '/scan', icon: Activity },
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

                                    <button
                                        onClick={async () => {
                                            await signOut();
                                            setDemoMode(false);
                                            // Reset language to null to force welcome screen to show language select again
                                            setLanguage(null as any);
                                            nav.goToRoot();
                                            setIsOpen(false);
                                        }}
                                        className="group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all active:scale-[0.98] border-none text-muted-foreground hover:bg-destructive/10 hover:text-destructive mt-auto"
                                    >
                                        <LogOut className="h-5 w-5 transition-transform group-hover:scale-110 rtl:rotate-180" />
                                        <span className="text-sm font-medium tracking-wide">{t.signOut}</span>
                                    </button>
                                </div>

                                {/* Footer */}
                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="text-left rtl:text-right">
                                        <p className="text-[10px] text-muted-foreground">
                                            {language === 'ar' ? 'أيرو v١.٠.٤' : 'AERO v1.0.4'} <br />
                                            {t.sovereign}
                                        </p>
                                    </div>
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
