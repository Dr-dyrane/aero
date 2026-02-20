'use client';

import { motion } from 'framer-motion';
import { AeroButton } from '@/modules/ui/components/AeroButton';
import { useNavigator } from '@/lib/navigation';

export default function NotFound() {
  const nav = useNavigator();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="text-center max-w-md mx-auto px-4"
      >
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-foreground mb-4">
            404
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Page not found
          </p>
        </div>

        <AeroButton
          variant="primary"
          size="lg"
          onClick={() => nav.goToDashboard()}
        >
          Return to Dashboard
        </AeroButton>
      </motion.div>
    </div>
  );
}
