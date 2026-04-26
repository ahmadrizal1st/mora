// src/components/marketing/SectionDivider.tsx
interface SectionDividerProps {
  divider?: 'waves' | 'arc'
}

export function SectionDivider({ divider }: SectionDividerProps) {
  if (divider === 'waves') {
    return (
      <svg className="section-divider" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28" preserveAspectRatio="none">
        <path className="wave-1" d="M-110 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        <path className="wave-2" d="M-110 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        <path className="wave-3" d="M-110 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
      </svg>
    )
  }

  if (divider === 'arc') {
    return (
      <svg className="section-divider" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 145 36" preserveAspectRatio="none">
        <path d="M 145 36 m -145 -18 s 32.36 18 72.27 18 s 72.73 -18 72.73 -18 v 18 h -145 z" />
      </svg>
    )
  }

  return null
}

export default SectionDivider