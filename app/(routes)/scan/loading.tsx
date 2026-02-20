export default function ScanLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center p-2 pb-24">
      <header className="flex w-full max-w-sm items-center gap-3 py-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />
        <div className="h-6 w-28 animate-pulse rounded-full bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />
      </header>
      <div className="mt-4 flex w-full max-w-sm flex-col gap-3">
        <div className="h-16 w-full animate-pulse rounded-3xl bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />
        <div className="h-16 w-full animate-pulse rounded-3xl bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />
        <div className="h-16 w-full animate-pulse rounded-3xl bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />
      </div>
      <div className="mt-8 h-12 w-full max-w-sm animate-pulse rounded-full bg-[rgba(255,255,255,0.1)] backdrop-blur-sm" />
    </main>
  );
}
