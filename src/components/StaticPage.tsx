export function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="bg-white rounded-2xl border border-taupe/50 p-6 md:p-8 space-y-4 text-ink-soft leading-relaxed">
        {children}
      </div>
    </div>
  );
}
