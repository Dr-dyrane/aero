'use client';

import { motion } from 'framer-motion';
import { AeroCard, AeroOrb } from '@/modules/ui';
import { useAeroStore } from '@/store/useAeroStore';
import {
    Mic2,
    Activity,
    ScanFace,
    ShieldCheck,
    ChevronRight,
    Info,
    BrainCircuit,
    Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HowItWorksPage() {
    const language = useAeroStore((s) => s.language);
    const isDark = true; // High-end tech pages often look best in dark protocol

    const content = {
        en: {
            title: "The Bio-Digital Protocol",
            subtitle: "AERO measures what self-reporting ignores. We use the phone's sensors as a distributed clinical laboratory.",
            sections: [
                {
                    id: "vocal",
                    title: "Vocal Biomarkers",
                    icon: Mic2,
                    desc: "AI analysis of micro-tremors (jitter) and amplitude variations (shimmer) in the vocal folds caused by nicotine-induced inflammation.",
                    stat: "94% Analysis Confidence"
                },
                {
                    id: "ppg",
                    title: "Optical Hemodynamics",
                    icon: Activity,
                    desc: "Using the camera flash to measure Heart Rate Variability (HRV) and vasoconstriction. Nicotine causes an immediate drop in blood vessel elasticity.",
                    stat: "Real-time Proof of Oxygen"
                },
                {
                    id: "facial",
                    title: "Facial Perfusion",
                    icon: ScanFace,
                    desc: "Multi-spectral mapping of skin blood-flow patterns. We detect the distinct 'flush' and oxygen saturation changes linked to recent inhalation.",
                    stat: "Sub-dermal Mapping"
                },
                {
                    id: "clinical",
                    title: "Clinical Anchor",
                    icon: BrainCircuit,
                    desc: "The Fagerström Test weighting ensures your score is grounded in the globally recognized gold standard of addiction science.",
                    stat: "Psychometric Stability"
                }
            ],
            privacy: {
                title: "Privacy Shield",
                desc: "Raw audio and video never leave your device. Only normalized numerical telemetry is processed by the sovereign algorithm."
            },
            clinicalProtocol: {
                title: "Clinical Framework",
                subtitle: "Integration of FTND (Fagerström Test for Nicotine Dependence)",
                formula: "AS = (θ * Bio_avg / 10) * 100",
                details: [
                    { label: "TTFU (Time to First Use)", value: "High-dependency anchor if < 5 mins" },
                    { label: "Daily Consumption", value: "Linear weighting based on unit count" },
                    { label: "Bio-Variance", value: "Real-time biometric deviation from baseline" }
                ]
            },
            cta: "Return to Console"
        },
        ar: {
            title: "البروتوكول الحيوي الرقمي",
            subtitle: "يقيس أيرو ما تتجاهله التقارير الذاتية. نحن نستخدم مستشعرات الهاتف كمختبر سريري موزع.",
            sections: [
                {
                    id: "vocal",
                    title: "البصمات الصوتية",
                    icon: Mic2,
                    desc: "تحليل الذكاء الاصطناعي للرعشات الدقيقة وتغيرات السعة في الأحبال الصوتية الناتجة عن التهاب النيكوتين.",
                    stat: "٩٤٪ دقة التحليل"
                },
                {
                    id: "ppg",
                    title: "ديناميكا الدم البصرية",
                    icon: Activity,
                    desc: "استخدام فلاش الكاميرا لقياس تقلب ضربات القلب وضيق الأوعية الدموية. يسبب النيكوتين انخفاضاً فورياً في مرونة الأوعية.",
                    stat: "إثبات الأكسجين الفوري"
                },
                {
                    id: "facial",
                    title: "التروية الوجهية",
                    icon: ScanFace,
                    desc: "رسم خرائط متعددة الأطياف لأنماط تدفق الدم في الجلد. نكشف عن التغيرات المرتبطة باستنشاق النيكوتين مؤخراً.",
                    stat: "رسم خرائط تحت الجلد"
                },
                {
                    id: "clinical",
                    title: "المرساة السريرية",
                    icon: BrainCircuit,
                    desc: "يضمن اختبار فاجرستروم أن درجاتك تعتمد على المعيار العالمي المعترف به في علم الإدمان.",
                    stat: "استقرار القياس النفسي"
                }
            ],
            privacy: {
                title: "درع الخصوصية",
                desc: "البيانات الصوتية والمرئية الخام لا تغادر جهازك أبداً. يتم معالجة القياسات الرقمية فقط بواسطة الخوارزمية السيادية."
            },
            clinicalProtocol: {
                title: "الإطار السريري",
                subtitle: "تكامل اختبار فاجرستروم للاعتماد على النيكوتين (FTND)",
                formula: "AS = (θ * Bio_avg / 10) * 100",
                details: [
                    { label: "وقت الاستخدام الأول", value: "مرساة اعتماد عالية إذا كان أقل من ٥ دقائق" },
                    { label: "الاستهلاك اليومي", value: "وزن خطي يعتمد على عدد الوحدات" },
                    { label: "التباين الحيوي", value: "الانحراف الحيوي الفوري عن خط الأساس" }
                ]
            },
            cta: "العودة إلى لوحة التحكم"
        }
    };

    const t = language === 'ar' ? content.ar : content.en;

    return (
        <main className="flex min-h-screen flex-col items-center px-6 pb-32 pt-12 overflow-x-hidden bg-background">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 blur-[100px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm z-10"
            >
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="mb-6 relative">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
                        <div className="relative p-4 rounded-full bg-surface-translucent border border-white/5 backdrop-blur-xl">
                            <Fingerprint className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="font-serif text-3xl font-light tracking-tight text-foreground mb-4">
                        {t.title}
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed px-4">
                        {t.subtitle}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {t.sections.map((section, idx) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                        >
                            <AeroCard className="group">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 group-hover:border-primary/30 transition-colors">
                                        <section.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">
                                                {section.title}
                                            </h3>
                                            <span className="text-[9px] font-bold text-primary/50 bg-primary/5 px-2 py-0.5 rounded uppercase tracking-widest">
                                                {section.stat}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground/80 leading-relaxed">
                                            {section.desc}
                                        </p>
                                    </div>
                                </div>
                            </AeroCard>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 space-y-4"
                >
                    {/* Clinical Formula visualization */}
                    <AeroCard className="bg-black/40 border-white/5 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <BrainCircuit className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] tracking-[0.2em] font-bold text-primary uppercase">
                                    {t.clinicalProtocol.title}
                                </span>
                                <h4 className="text-xs font-medium text-muted-foreground">
                                    {t.clinicalProtocol.subtitle}
                                </h4>
                            </div>

                            <div className="py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <code className="text-sm font-mono text-primary flex justify-center tracking-wider">
                                    {t.clinicalProtocol.formula}
                                </code>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {t.clinicalProtocol.details.map((detail: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-[10px] py-1 border-b border-white/5 last:border-none">
                                        <span className="text-muted-foreground">{detail.label}</span>
                                        <span className="text-foreground font-medium">{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AeroCard>

                    <AeroCard className="border-primary/20 bg-primary/5 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-5">
                            <ShieldCheck className="h-24 w-24 text-primary" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-[10px] tracking-widest text-primary font-bold uppercase">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                {t.privacy.title}
                            </div>
                            <p className="text-xs text-foreground/70 leading-relaxed font-medium">
                                {t.privacy.desc}
                            </p>
                        </div>
                    </AeroCard>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 w-full"
                >
                    <button
                        onClick={() => window.history.back()}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-foreground text-background font-bold tracking-widest text-xs uppercase hover:opacity-90 transition-opacity"
                    >
                        {t.cta}
                        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                    </button>
                </motion.div>
            </motion.div>
        </main>
    );
}
