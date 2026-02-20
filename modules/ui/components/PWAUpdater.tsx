'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle2, CloudDownload } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PWAUpdater Component
 * Listens for Service Worker updates and shows a native "System Notification".
 * Fulfills the "self-clearing" and "system notification" user requirement.
 */
export function PWAUpdater() {
    const [updateStatus, setUpdateStatus] = useState<'idle' | 'detected' | 'downloading' | 'ready' | 'applying'>('idle');

    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

        const handleUpdate = (registration: ServiceWorkerRegistration) => {
            // Logic for update detected
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) return;

                setUpdateStatus('detected');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installing') {
                        setUpdateStatus('downloading');
                    }
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // New version available!
                            setUpdateStatus('ready');

                            // Protocol: Auto-apply for the user after 2 seconds of showing "Ready"
                            setTimeout(() => {
                                setUpdateStatus('applying');
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                            }, 2000);
                        }
                    }
                });
            });
        };

        navigator.serviceWorker.getRegistration().then((reg) => {
            if (reg) handleUpdate(reg);
        });

        // Handle the controller change (The self-clearing part)
        let refreshing = false;
        const handleControllerChange = () => {
            if (refreshing) return;
            refreshing = true;
            // Wait for the exit animation before reload
            setTimeout(() => {
                window.location.reload();
            }, 500);
        };

        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

        // Simulation Trigger for Testing
        const handleSimulate = () => {
            setUpdateStatus('detected');
            setTimeout(() => setUpdateStatus('downloading'), 2000);
            setTimeout(() => setUpdateStatus('ready'), 5000);
            setTimeout(() => {
                setUpdateStatus('applying');
                setTimeout(() => {
                    setUpdateStatus('idle'); // Safe exit if no reload happens
                }, 3000);
            }, 7000);
        };

        window.addEventListener('aero-simulate-update' as any, handleSimulate);

        return () => {
            navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
            window.removeEventListener('aero-simulate-update' as any, handleSimulate);
        };
    }, []);

    if (updateStatus === 'idle') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0, scale: 0.95 }}
                animate={{ y: 20, opacity: 1, scale: 1 }}
                exit={{ y: -100, opacity: 0, scale: 0.95 }}
                className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-[340px]"
            >
                <div className={cn(
                    "flex items-center gap-3 p-4 rounded-3xl backdrop-blur-3xl border transition-all duration-500 shadow-2xl",
                    updateStatus === 'applying'
                        ? "bg-primary/20 border-primary/40"
                        : "bg-black/60 border-white/10"
                )}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                        {updateStatus === 'detected' && <CloudDownload className="h-5 w-5 text-primary animate-bounce" />}
                        {updateStatus === 'downloading' && <RefreshCw className="h-5 w-5 text-primary animate-spin" />}
                        {updateStatus === 'ready' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                        {updateStatus === 'applying' && <RefreshCw className="h-5 w-5 text-primary animate-spin" />}
                    </div>

                    <div className="flex-1 text-left">
                        <h4 className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase opacity-60">System Protocol</h4>
                        <p className="text-sm font-medium text-foreground tracking-tight">
                            {updateStatus === 'detected' && "Initializing Update..."}
                            {updateStatus === 'downloading' && "Downloading Bio-Assets..."}
                            {updateStatus === 'ready' && "Protocol Optimized"}
                            {updateStatus === 'applying' && "Applying Sync..."}
                        </p>
                    </div>

                    {updateStatus === 'ready' && (
                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_var(--emerald-400)]" />
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
