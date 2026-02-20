'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AeroCard, AeroButton } from '@/modules/ui';
import { AeroRadar } from '@/modules/ui/components/AeroRadar';
import { useAeroStore } from '@/store/useAeroStore';
import { useLayout } from '@/modules/ui/providers/LayoutProvider';
import { AeroSkeleton } from '@/modules/ui/components/AeroSkeleton';
import { useTheme } from '@/modules/ui/providers/ThemeProvider';
import {
    Mic2,
    Activity,
    ScanFace,
    ShieldCheck,
    ChevronRight,
    BrainCircuit,
    Fingerprint,
    ArrowLeft,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Stage = 'spectrum' | 'sensors' | 'clinical' | 'privacy';

export default function HowItWorksPage() {
    const language = useAeroStore((s) => s.language);
    const { isSkeletonLoading, setSkeletonLoading, setIsNavVisible } = useLayout();
    const { resolvedTheme } = useTheme();
    const [activeStage, setActiveStage] = useState<Stage>('spectrum');
    const [selectedTier, setSelectedTier] = useState<number | null>(null);

    useEffect(() => {
        setSkeletonLoading(true);
        setIsNavVisible(false);
        const timer = setTimeout(() => setSkeletonLoading(false), 800);
        return () => {
            clearTimeout(timer);
            setIsNavVisible(true);
        };
    }, [setSkeletonLoading, setIsNavVisible]);

    const content = {
        en: {
            spectrum: {
                title: "Score Dynamics",
                subtitle: "The AERO Protocol decodes your bio-signal integrity into five clinical tiers. Tap a frequency to understand your status.",
                explore: "VIEW SENSORS"
            },
            sensors: {
                title: "Distributed Lab",
                subtitle: "The AERO sensors act as a sovereign clinical laboratory on your device.",
                items: [
                    { id: "vocal", title: "Vocal Biomarkers", icon: Mic2, desc: "AI analysis of micro-tremors in vocal folds caused by nicotine load.", stat: "94% Acc" },
                    { id: "ppg", title: "Optical Hemodynamics", icon: Activity, desc: "Measuring HRV and vasoconstriction via the camera flash.", stat: "O2 Proof" },
                    { id: "facial", title: "Facial Perfusion", icon: ScanFace, desc: "Mapping sub-dermal blood-flow patterns for recent inhalation.", stat: "Spectral" }
                ],
                explore: "CLINICAL LOGIC"
            },
            clinical: {
                title: "Clinical Anchor",
                subtitle: "FTND Integration ensuring psychometric stability and global standards.",
                formula: "AS = (θ * Bio_avg / 10) * 100",
                explore: "PRIVACY SHIELD"
            },
            privacy: {
                title: "Privacy Shield",
                desc: "Raw telemetry never leaves your device. Only normalized numerical integrity is processed.",
                explore: "RETURN TO CONSOLE"
            },
            tiers: [
                { range: "0 - 20", level: "Critical Load", desc: "Yield suspended. Acute dependency detected.", color: "#EF4444" },
                { range: "21 - 40", level: "High Risk", desc: "Bio-integrity compromised. Significant load.", color: "#F97316" },
                { range: "41 - 60", level: "Functional", desc: "Moderate exposure. Base yield generation.", color: "#EAB308" },
                { range: "61 - 80", level: "Stable", desc: "Strong signatures. Standard yield active.", color: "#84CC16" },
                { range: "81 - 100", level: "Sovereign", desc: "Peak integrity. maximum yield velocity.", color: "#10B981" }
            ]
        },
        ar: {
            spectrum: {
                title: "طيف الهوية",
                subtitle: "يعمل بروتوكول أيرو على رادار دائري ديناميكي. درجتك هي ترددك الحيوي الرقمي.",
                explore: "استكشاف المستشعرات"
            },
            sensors: {
                title: "مختبر موزع",
                subtitle: "تعمل مستشعرات أيرو كمختبر سريري سيادي على جهازك.",
                items: [
                    { id: "vocal", title: "البصمات الصوتية", icon: Mic2, desc: "تحليل الذكاء الاصطناعي للرعشات الصوتية الناتجة عن حمل النيكوتين.", stat: "٩٤٪" },
                    { id: "ppg", title: "ديناميكا الدم", icon: Activity, desc: "قياس تقلب ضربات القلب وضيق الأوعية عبر الفلاش.", stat: "إثبات O2" },
                    { id: "facial", title: "التروية الوجهية", icon: ScanFace, desc: "رسم خرائط تدفق الدم تحت الجلد للاستخدام الأخير.", stat: "طيفي" }
                ],
                explore: "البروتوكول السريري"
            },
            clinical: {
                title: "المرساة السريرية",
                subtitle: "تكامل FTND لضمان استقرار القياس النفسي والمعايير العالمية.",
                formula: "AS = (θ * Bio_avg / 10) * 100",
                explore: "درع الخصوصية"
            },
            privacy: {
                title: "درع الخصوصية",
                desc: "البيانات الخام لا تغادر جهازك أبداً. تتم معالجة الأرقام الطبيعية فقط.",
                explore: "العودة للوحة التحكم"
            },
            tiers: [
                { range: "٠ - ٢٠", level: "حمل حرج", desc: "توقف العائد. تم كشف تبعية حادة.", color: "#EF4444" },
                { range: "٢١ - ٤٠", level: "خطر عالٍ", desc: "سلامة حيوية مهددة. حمل كبير.", color: "#F97316" },
                { range: "٤١ - ٦٠", level: "وظيفي", desc: "تعرض متوسط. توليد عائد متاح.", color: "#EAB308" },
                { range: "٦١ - ٨٠", level: "مستقر", desc: "إشارات قوية. حصاد عائد قياسي.", color: "#84CC16" },
                { range: "٨١ - ١٠٠", level: "سيادي", desc: "سلامة قصوى. أقصى سرعة للعائد.", color: "#10B981" }
            ]
        }
    };

    const t = language === 'ar' ? content.ar : content.en;

    if (isSkeletonLoading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center px-6 bg-background">
                <AeroSkeleton variant="circle" className="h-[280px] w-[280px] mb-12" />
                <div className="flex flex-col items-center gap-4 w-full max-w-sm text-center">
                    <AeroSkeleton className="h-8 w-48 mb-2" />
                    <AeroSkeleton className="h-4 w-full" />
                    <AeroSkeleton className="h-4 w-2/3" />
                </div>
            </main>
        );
    }

    const handleNext = () => {
        if (activeStage === 'spectrum') setActiveStage('sensors');
        else if (activeStage === 'sensors') setActiveStage('clinical');
        else if (activeStage === 'clinical') setActiveStage('privacy');
        else window.history.back();
    };

    const handleBack = () => {
        if (activeStage === 'spectrum') window.history.back();
        else if (activeStage === 'sensors') setActiveStage('spectrum');
        else if (activeStage === 'clinical') setActiveStage('sensors');
        else if (activeStage === 'privacy') setActiveStage('clinical');
    };

    return (
        <main className="flex min-h-[100dvh] flex-col items-center justify-between py-12 px-6 relative overflow-hidden bg-background">
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className={cn(
                    "absolute top-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full transition-colors duration-1000",
                    resolvedTheme === 'eclipse' ? "bg-primary/5" : "bg-primary/10"
                )} />
                <div className={cn(
                    "absolute bottom-0 left-0 w-[400px] h-[400px] blur-[100px] rounded-full transition-colors duration-1000",
                    resolvedTheme === 'eclipse' ? "bg-primary/3" : "bg-primary/5"
                )} />
            </div>

            <div className="w-full max-w-sm flex items-center justify-between mb-8 z-50">
                <button onClick={handleBack} className="p-3 rounded-full bg-surface-translucent hover:bg-surface-hover transition-colors border border-white/5">
                    <ArrowLeft className="h-5 w-5 text-foreground/60" />
                </button>
                <div className="flex gap-1.5">
                    {['spectrum', 'sensors', 'clinical', 'privacy'].map((s) => (
                        <div key={s} className={cn("h-1 w-6 rounded-full transition-all duration-500", activeStage === s ? "bg-primary w-10" : "bg-white/10")} />
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full max-w-sm flex flex-col items-center justify-center z-10">
                <AnimatePresence mode="wait">
                    {activeStage === 'spectrum' && (
                        <motion.div key="spectrum" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }} className="flex flex-col items-center w-full">
                            <AeroRadar tiers={t.tiers as any} activeIndex={selectedTier} onSelect={setSelectedTier} />
                            <div className="mt-12 text-center space-y-6 min-h-[180px] w-full px-4">
                                {selectedTier === null ? (
                                    <>
                                        <h1 className="text-3xl font-serif text-foreground tracking-tighter">{t.spectrum.title}</h1>
                                        <p className="text-[13px] text-muted-foreground leading-relaxed px-6 opacity-80 italic">
                                            The AERO radar visualizes your bio-signal integrity across a five-tier clinical spectrum. Tap a frequency to decode your status.
                                        </p>
                                    </>
                                ) : (
                                    <motion.div
                                        key={selectedTier}
                                        initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        className="space-y-6"
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                    >
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-serif tracking-tight" style={{ color: t.tiers[selectedTier].color }}>{t.tiers[selectedTier].level}</h2>
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Biometric Anchor</span>
                                                <div className="h-1 w-1 rounded-full bg-white/20" />
                                                <span className="text-[10px] font-mono font-medium text-muted-foreground/60">{t.tiers[selectedTier].range.replace(/٠|١|٢|٣|٤|٥|٦|٧|٨|٩/g, m => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(m)])} AS</span>
                                            </div>
                                        </div>

                                        {/* Clinical Range Bar: Cumulative Sovereignty Logic */}
                                        <div className="space-y-3">
                                            <div className="w-full h-3 bg-white/[0.03] rounded-full overflow-hidden relative border border-white/5 p-[1px]">
                                                {/* Spectral Background Track */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-yellow-500/5 to-emerald-500/5" />

                                                {/* Cumulative Fill */}
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${(selectedTier + 1) * 20}%`,
                                                    }}
                                                    className="h-full rounded-full relative z-10"
                                                    style={{
                                                        background: `linear-gradient(90deg, ${t.tiers[0].color}aa, ${t.tiers[selectedTier].color})`,
                                                        boxShadow: `0 0 20px ${t.tiers[selectedTier].color}44`
                                                    }}
                                                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                                                >
                                                    {/* Inner Polish Highlighting */}
                                                    <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
                                                    <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur-sm rounded-full" />
                                                </motion.div>
                                            </div>

                                            {/* Numeric Anchors */}
                                            <div className="flex justify-between px-1 text-[9px] font-mono leading-none">
                                                {[0, 20, 40, 60, 80, 100].map((m, i) => (
                                                    <div key={m} className="flex flex-col items-center gap-1.5">
                                                        <div className={cn(
                                                            "h-1.5 w-[1px] transition-colors duration-500",
                                                            (selectedTier + 1) * 20 >= m ? "bg-primary" : "bg-white/10"
                                                        )} />
                                                        <span className={cn(
                                                            "transition-colors duration-500",
                                                            (selectedTier + 1) * 20 >= m ? "text-foreground font-bold" : "text-muted-foreground/30"
                                                        )}>
                                                            {m}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-[14px] text-foreground/80 font-medium leading-relaxed italic px-4">
                                            "{t.tiers[selectedTier].desc}"
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeStage === 'sensors' && (
                        <motion.div key="sensors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }} className="flex flex-col items-center w-full">
                            <div className="text-center space-y-2 mb-8">
                                <span className="text-[10px] tracking-[0.4em] font-bold text-primary uppercase">{t.sensors.title}</span>
                                <p className="text-xs text-muted-foreground/60 px-8 leading-relaxed italic">{t.sensors.subtitle}</p>
                            </div>
                            <div className="w-full space-y-3">
                                {t.sensors.items.map((sensor) => (
                                    <AeroCard key={sensor.id} className="p-5 border-primary/10 bg-primary/[0.02]">
                                        <div className="flex gap-5">
                                            <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                                                <sensor.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{sensor.title}</h3>
                                                    <span className="text-[8px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{sensor.stat}</span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed">{sensor.desc}</p>
                                            </div>
                                        </div>
                                    </AeroCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeStage === 'clinical' && (
                        <motion.div key="clinical" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }} className="flex flex-col items-center w-full gap-8">
                            <div className="text-center space-y-2">
                                <div className="h-16 w-16 mx-auto rounded-full bg-surface-translucent border border-white/5 flex items-center justify-center mb-4"><BrainCircuit className="h-8 w-8 text-primary" /></div>
                                <h1 className="text-2xl font-serif text-foreground">{t.clinical.title}</h1>
                                <p className="text-xs text-muted-foreground leading-relaxed px-4 opacity-70">{t.clinical.subtitle}</p>
                            </div>
                            <AeroCard className="w-full bg-black/40 border-white/10 text-center py-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles className="h-12 w-12 text-primary" /></div>
                                <code className="text-lg font-mono text-primary tracking-widest font-bold">{t.clinical.formula}</code>
                            </AeroCard>
                        </motion.div>
                    )}

                    {activeStage === 'privacy' && (
                        <motion.div key="privacy" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center w-full gap-8">
                            <div className="h-24 w-24 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]"><ShieldCheck className="h-12 w-12 text-emerald-400" /></div>
                            <div className="space-y-4">
                                <h1 className="text-3xl font-serif text-foreground tracking-tight">{t.privacy.title}</h1>
                                <p className="text-sm text-muted-foreground leading-relaxed px-6">{t.privacy.desc}</p>
                            </div>
                            <div className="pt-8 w-full">
                                <AeroCard className="text-left bg-emerald-500/5 border-emerald-500/10 p-5">
                                    <div className="flex items-center gap-3 mb-3"><Fingerprint className="h-5 w-5 text-emerald-400" /><span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">ZKP Protocol Active</span></div>
                                    <p className="text-[11px] text-emerald-400/80 leading-relaxed font-medium">Identity verification is processed locally using Zero-Knowledge Proofs. Raw bio-data is purged immediately after normalization.</p>
                                </AeroCard>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="w-full max-w-sm pt-8 z-50">
                <AeroButton variant="primary" size="lg" className="w-full h-16 text-xs tracking-[0.4em] font-bold group" onClick={handleNext}>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={activeStage}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-3"
                        >
                            {t[activeStage]?.explore}
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </motion.span>
                    </AnimatePresence>
                </AeroButton>
            </div>
        </main>
    );
}
