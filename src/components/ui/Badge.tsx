export function PostBadge({ post }: { post: string }) {
  const isOfficer = post === 'Officer (Meter Testing)';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
      isOfficer ? 'bg-emerald-900 text-emerald-300' : 'bg-blue-900 text-blue-300'
    }`}>
      {isOfficer ? 'Officer-MT' : 'MT'}
    </span>
  );
}

export function SeniorityBadge({ seniority }: { seniority?: number | null }) {
  if (seniority == null) return null;
  return (
    <span className="inline-block px-1.5 py-0.5 rounded-full text-xs font-bold bg-violet-900/60 text-violet-300 tabular-nums">
      #{seniority}
    </span>
  );
}