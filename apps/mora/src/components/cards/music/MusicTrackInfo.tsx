// src/components/cards/music/MusicTrackInfo.tsx
import type { Track } from './MusicTracksList'

interface MusicTrackInfoProps {
  track: Track
}

export function MusicTrackInfo({ track }: MusicTrackInfoProps) {
  return (
    <div className="card">
      <div className="row row-0">
        <div className="col-auto">
          {track.album.images[1] && (
            <img 
              src={`/static/tracks/${track.album.images[1].path}`} 
              className="rounded-start" 
              alt={track.name} 
              width="80" 
              height="80" 
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>
        <div className="col">
          <div className="card-body">
            {track.name}
            <div className="text-secondary">
              {track.artists.map(a => a.name).join(', ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
