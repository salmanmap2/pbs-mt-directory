'use client';

const OPTIONS = [
  { value: '', label: 'Default Order' },
  { value: 'post', label: 'Sort by Post' },
  { value: 'pbs', label: 'Sort by PBS' },
  { value: 'office', label: 'Sort by Office' },
  { value: 'ownDistrict', label: 'Sort by District' },
  { value: 'joiningDate', label: 'Sort by Joining Date' },
  { value: 'transferChoice1', label: 'Sort by Transfer Choice 1' },
  { value: 'transferChoice2', label: 'Sort by Transfer Choice 2' },
  { value: 'transferChoice3', label: 'Sort by Transfer Choice 3' },
];

export function SortSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="px-4 pb-2">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-blue">
        {OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
