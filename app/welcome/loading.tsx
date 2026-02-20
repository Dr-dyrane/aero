export default function Loading() {
    return (
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-between overflow-hidden bg-background py-12 px-6">

            {/* AMBIENT VOID SKELETON */}
            <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aero-blue/5 blur-[120px] dark:bg-[#00F5FF]/5 opacity-50 pointer-events-none" />

            {/* THEME TOGGLE SKELETON */}
            <div className="absolute top-6 right-6 z-50">
                <div className="h-20 w-10 rounded-full bg-surface-translucent backdrop-blur-md animate-pulse" />
            </div>

            {/* HERO SKELETON (Matched Layout: pt-20 gap-8) */}
            <div className="flex-1 flex flex-col items-center justify-start pt-20 gap-8 w-full max-w-md z-10">

                {/* LOGO SKELETON (h-80 w-80) */}
                <div className="relative h-80 w-80 rounded-full bg-surface-translucent/30 animate-pulse drop-shadow-[0_0_25px_rgba(0,245,255,0.05)]" />

                {/* TYPOGRAPHY SKELETON */}
                <div className="flex flex-col items-center text-center gap-4 w-full">
                    {/* Heading Skeleton (Text-5xl approx height) */}
                    <div className="h-12 w-3/4 bg-surface-translucent/50 rounded-lg animate-pulse" />

                    {/* Subtext Skeleton (2 lines) */}
                    <div className="flex flex-col items-center gap-2 w-full max-w-xs mt-2">
                        <div className="h-4 w-full bg-surface-translucent/30 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-surface-translucent/30 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* ACTION SKELETON (Bottom) */}
            <div className="w-full max-w-sm z-20 pb-8">
                <div className="h-[60px] w-full rounded-full bg-surface-translucent/40 animate-pulse" />
            </div>

        </div>
    );
}
