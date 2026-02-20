'use client';

import { usePathname } from 'next/navigation';
import { useNavigator } from '@/lib/navigation';
import { LayoutDashboard, Shield, Settings, ScanFace, ChevronRight, Zap, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { useLayout } from '../providers/LayoutProvider';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'vault', icon: Shield, path: '/vault' },
  { id: 'settings', icon: Settings, path: '/settings' },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const nav = useNavigator();
  const { isNavVisible } = useLayout();
  const currentItem = NAV_ITEMS.find(item => pathname.startsWith(item.path)) || NAV_ITEMS[0];

  // Context-aware FAB logic
  const getFabConfig = () => {
    if (pathname.startsWith('/dashboard')) return { icon: ScanFace, action: nav.goToScan };
    if (pathname.startsWith('/vault')) return { icon: Coins, action: () => { } };
    if (pathname.startsWith('/scan')) return { icon: ChevronRight, action: () => { } };
    return { icon: Zap, action: () => { } };
  };

  const fab = getFabConfig();

  return (
    <motion.div
      animate={{ y: isNavVisible ? 0 : 120 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-8 left-1/2 z-[100] w-full max-w-[400px] -translate-x-1/2 px-4 pointer-events-none"
    >
      <div className="flex items-center justify-between pointer-events-auto">

        {/* PILL: The Core Navigation - Simplified Borderless Design */}
        <div className="relative flex items-center bg-transparent h-14 rounded-full px-2 backdrop-blur-sm overflow-hidden min-w-[180px]">
          {NAV_ITEMS.map((item) => {
            const isActive = currentItem.id === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={item.id === 'vault' ? nav.goToVault : item.id === 'settings' ? nav.goToSettings : nav.goToDashboard}
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 mx-1",
                  isActive ? "text-primary scale-110" : "text-muted-foreground/40 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_8px_rgba(0,245,255,0.4)]")} />
              </button>
            );
          })}
        </div>

        {/* DROPLET FAB: Context-Aware Droplet */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fab.action}
          className="relative flex h-16 w-16 items-center justify-center rounded-[2.5rem] bg-primary text-primary-foreground shadow-[0_12px_40px_rgba(0,245,255,0.35)] transition-all overflow-hidden"
          style={{
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 70%', // Droplet/Organic feel
          }}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
              transition={{ duration: 0.3 }}
            >
              <fab.icon className="h-7 w-7" strokeWidth={2.5} />
            </motion.div>
          </AnimatePresence>
        </motion.button>

      </div>
    </motion.div>
  );
}
