import { accommodationBadgeClass } from '@/lib/utils'

export default function AccomBadge({ group }: { group: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${accommodationBadgeClass(group)}`}>
      {group}
    </span>
  )
}
