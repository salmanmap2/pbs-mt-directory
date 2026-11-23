export function PostBadge({ post }: { post: string }) {
  const isMS = post === 'Meter Testing Supervisor';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${isMS ? 'bg-emerald-900 text-emerald-300' : 'bg-blue-900 text-blue-300'}`}>
      {isMS ? 'MTS' : 'MT'}
    </span>
  );
}
