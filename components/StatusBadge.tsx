export default function StatusBadge({ label = "AVAILABLE FOR HIRE" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="status-dot inline-block h-2 w-2 rounded-full bg-accent" />
      <span className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
        {label}
      </span>
    </div>
  );
}
