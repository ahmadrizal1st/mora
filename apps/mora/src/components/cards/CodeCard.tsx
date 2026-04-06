// src/components/cards/CodeCard.tsx

interface CodeCardProps {
  title?: string
  code?: string
  language?: string
}

export function CodeCard({
  title = 'Card with code',
  language = 'css',
  code = `.card-footer {
  background: transparent;

  &:last-child {
    border-radius: 0 0 1 2;
  }
}`,
}: CodeCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-code">
        <pre><code className={`language-${language}`}>{code}</code></pre>
      </div>
    </div>
  )
}