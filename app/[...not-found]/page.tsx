'use client';

import { motion } from 'framer-motion';
import { AeroButton } from '@/modules/ui/components/AeroButton';
import { useNavigator } from '@/lib/navigation';

import { useAeroStore } from '@/store/useAeroStore';

export default function NotFound() {
  const nav = useNavigator();
  const language = useAeroStore((s) => s.language);

  const content = {
    en: {
      title: "404",
      desc: "Page not found",
      cta: "Return to Dashboard"
    },
    ar: {
      title: "٤٠٤",
      desc: "الصفحة غير موجودة",
      cta: "العودة للوحة التحكم"
    }
  };

  const t = language === 'ar' ? content.ar : content.en;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="text-center max-w-md mx-auto px-4"
      >
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-foreground mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {t.desc}
          </p>
        </div>

        <AeroButton
          variant="primary"
          size="lg"
          onClick={() => nav.goToDashboard()}
        >
          {t.cta}
        </AeroButton>
      </motion.div>
    </div>
  );
}
