interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  color?: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'default'
}

const colorMap = {
  blue:    'text-blue-400',
  purple:  'text-purple-400',
  green:   'text-green-400',
  red:     'text-red-400',
  orange:  'text-orange-400',
  default: 'text-white',
}

export default function StatCard({ label, value, sub, color = 'default' }: StatCardProps) {
  return (
    <div className="rounded-lg border border-blue-900/40 p-4" style={{ background: '#131E2B' }}>
      <p className="text-xs text-blue-400 uppercase tracking-wider font-medium mb-1">{label}</p>
      <p className={`text-3xl font-bold font-mono ${colorMap[color]}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}
