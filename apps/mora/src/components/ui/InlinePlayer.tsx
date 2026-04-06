import { useEffect, useRef } from 'react'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

export interface InlinePlayerProps {
  id: string
  type?: 'youtube' | 'vimeo'
  embedId: string | number
  className?: string
}

export function InlinePlayer({
  id,
  type = 'youtube',
  embedId,
  className,
}: InlinePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<Plyr | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    playerRef.current = new Plyr(containerRef.current, {
      // Plyr options can be added here
    })

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [])

  return (
    <div className={className}>
      <div
        ref={containerRef}
        id={`player-${id}`}
        data-plyr-provider={type}
        data-plyr-embed-id={embedId}
      />
    </div>
  )
}
