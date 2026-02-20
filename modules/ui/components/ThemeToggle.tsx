'use client';

import { useTheme } from '@/modules/ui/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-20 w-10 rounded-full bg-surface-translucent backdrop-blur-md" />;
    }

    const isDark = resolvedTheme === 'eclipse';

    const toggleTheme = () => {
        setTheme(isDark ? 'cloud' : 'eclipse');
    };

    return (
        <div className="relative h-20 w-10 rounded-full bg-surface-translucent backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_4px_20px_rgba(0,0,0,0.1)] p-1">
            {/* Icons Background */}
            <div className="absolute inset-0 flex flex-col items-center justify-between py-3 pointer-events-none">
                <Sun className={`h-4 w-4 transition-colors duration-300 ${!isDark ? 'text-amber-400' : 'text-muted-foreground/30'}`} />
                <Moon className={`h-4 w-4 transition-colors duration-300 ${isDark ? 'text-aero-blue' : 'text-muted-foreground/30'}`} />
            </div>

            {/* Draggable Thumb */}
            <motion.button
                layout
                onClick={toggleTheme}
                className="absolute left-1 h-8 w-8 rounded-full bg-background shadow-sm flex items-center justify-center z-10"
                animate={{
                    top: isDark ? 'auto' : '4px',
                    bottom: isDark ? '4px' : 'auto',
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                whileTap={{ scale: 0.9 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, info) => {
                    if (info.offset.y > 20 && !isDark) {
                        setTheme('eclipse');
                    } else if (info.offset.y < -20 && isDark) {
                        setTheme('cloud');
                    }
                }}
                aria-label="Toggle Theme"
            >
                <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${isDark ? 'bg-aero-blue' : 'bg-amber-400'}`} />
            </motion.button>
        </div>
    );
}
