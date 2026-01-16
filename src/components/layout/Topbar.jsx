export default function Topbar({ title, subtitle, right }) {
  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-slate-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}
