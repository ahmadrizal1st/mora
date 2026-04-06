// src/components/cards/music/MusicTracksList.tsx
import { useState } from 'react'
import { Icon } from '../../ui/Icon'

export interface Artist {
  name: string
  type: string
}

export interface AlbumImage {
  height: number
  path: string
  width: number
}

export interface Album {
  images: AlbumImage[]
  release_date: string
}

export interface Track {
  album: Album
  artists: Artist[]
  duration_ms: number
  name: string
  popularity: number
}

interface MusicTracksListProps {
  tracks: Track[]
  limit?: number
}

export function MusicTracksList({ tracks, limit = 12 }: MusicTracksListProps) {
  const [liked, setLiked] = useState<Record<number, boolean>>({})

  const toggleLike = (index: number) => {
    setLiked(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="card">
      <div className="list-group card-list-group">
        {tracks.slice(0, limit).map((track, i) => (
          <div key={i} className="list-group-item">
            <div className="row g-2 align-items-center">
              <div className="col-auto fs-3">
                {i + 1}
              </div>
              <div className="col-auto">
                {track.album.images[1] && (
                  <img 
                    src={`/static/tracks/${track.album.images[1].path}`} 
                    className="rounded" 
                    alt={track.name} 
                    width="40" 
                    height="40" 
                  />
                )}
              </div>
              <div className="col">
                {track.name}
                <div className="text-secondary">
                  {track.artists.map(a => a.name).join(', ')}
                </div>
              </div>
              <div className="col-auto text-secondary">
                {formatDuration(track.duration_ms)}
              </div>
              <div className="col-auto">
                <a 
                  href="#" 
                  className={`link-secondary ${liked[i] ? 'text-red' : ''}`}
                  onClick={(e) => { e.preventDefault(); toggleLike(i); }}
                >
                  <Icon icon="heart" filled={liked[i]} />
                </a>
              </div>
              <div className="col-auto lh-1">
                <div className="dropdown">
                  <a href="#" className="link-secondary" data-bs-toggle="dropdown">
                    <Icon icon="dots" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a className="dropdown-item" href="#">Action</a>
                    <a className="dropdown-item" href="#">Another action</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
