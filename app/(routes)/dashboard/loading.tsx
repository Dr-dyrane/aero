export default function DashboardLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center p-2 pb-24">
      {/* Orb skeleton */}
      <div className="flex flex-col items-center py-8">
        <div className="h-[220px] w-[220px] animate-pulse rounded-full bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />
        <div className="mt-4 h-4 w-20 animate-pulse rounded-full bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />
      </div>

      {/* Pills skeleton */}
      <div className="flex items-center gap-2 pb-4">
        <div className="h-6 w-24 animate-pulse rounded-full bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />
      </div>

      {/* Card skeleton */}
      <div className="h-28 w-full max-w-sm animate-pulse rounded-3xl bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />

      {/* Button skeletons */}
      <div className="mt-6 flex w-full max-w-sm flex-col gap-3">
        <div className="h-12 w-full animate-pulse rounded-full bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />
        <div className="h-12 w-full animate-pulse rounded-full bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />
      </div>
    </main>
  );
}
