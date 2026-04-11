interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  color?: 'navy' | 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'gold' | 'default'
  variant?: 'light' | 'header'
}

const lightColorMap: Record<string, { border: string; value: string }> = {
  navy:    { border: 'border-t-brand-navy',    value: 'text-brand-navy' },
  blue:    { border: 'border-t-semantic-info',  value: 'text-semantic-info' },
  purple:  { border: 'border-t-semantic-purple',value: 'text-semantic-purple' },
  green:   { border: 'border-t-semantic-success',value: 'text-semantic-success' },
  red:     { border: 'border-t-semantic-error', value: 'text-semantic-error' },
  orange:  { border: 'border-t-semantic-warning',value: 'text-semantic-warning' },
  gold:    { border: 'border-t-brand-gold',    value: 'text-brand-gold' },
  default: { border: 'border-t-brand-navy',    value: 'text-brand-navy' },
}

const headerLabelColors: Record<string, string> = {
  navy: 'text-white/70',
  blue: 'text-blue-400',
  purple: 'text-violet-400',
  green: 'text-emerald-400',
  red: 'text-red-300',
  orange: 'text-orange-400',
  gold: 'text-brand-gold',
  default: 'text-header-muted',
}

const headerValueColors: Record<string, string> = {
  navy: 'text-white',
  blue: 'text-blue-400',
  purple: 'text-violet-400',
  green: 'text-emerald-400',
  red: 'text-red-400',
  orange: 'text-orange-400',
  gold: 'text-emerald-400',
  default: 'text-white',
}

export default function StatCard({ label, value, sub, color = 'default', variant = 'light' }: StatCardProps) {
  if (variant === 'header') {
    const isRed = color === 'red'
    return (
      <div className={`rounded-[10px] p-3.5 border ${
        isRed
          ? 'bg-red-500/10 border-red-500/25'
          : 'bg-white/[0.07] border-white/10'
      }`}>
        <p className={`text-[9px] uppercase tracking-[0.08em] font-medium mb-1 ${
          isRed ? 'text-red-300' : (headerLabelColors[color] || headerLabelColors.default)
        }`}>{label}</p>
        <p className={`text-[28px] font-extrabold font-mono leading-none ${
          isRed ? 'text-red-400' : (headerValueColors[color] || headerValueColors.default)
        }`}>{value}</p>
        {sub && <p className={`text-[9px] mt-1 ${isRed ? 'text-red-300/70' : 'text-[#5A7A9A]'}`}>{sub}</p>}
      </div>
    )
  }

  const colors = lightColorMap[color] || lightColorMap.default
  const isRed = color === 'red'
  return (
    <div className={`rounded-[10px] border border-surface-border p-3 border-t-[3px] ${colors.border} ${
      isRed ? 'bg-red-50' : 'bg-surface-card'
    }`}>
      <p className={`text-[9px] uppercase tracking-[0.06em] font-medium ${
        isRed ? 'text-red-700' : 'text-txt-secondary'
      }`}>{label}</p>
      <p className={`text-2xl font-extrabold font-mono ${colors.value}`}>{value}</p>
      {sub && <p className="text-[9px] text-txt-tertiary mt-0.5">{sub}</p>}
    </div>
  )
}
