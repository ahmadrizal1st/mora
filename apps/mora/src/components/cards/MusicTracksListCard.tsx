import { useState } from 'react';

interface Track { 
  name: string; 
  artists?: string[]; 
  duration?: string; 
  albumArt?: string; 
  liked?: boolean 
}

interface MusicTracksListCardProps {
  tracks?: Track[];
  onLike?: (i: number) => void;
}

export function MusicTracksListCard({
  tracks = [
    { name: 'Bohemian Rhapsody', artists: ['Queen'], duration: '5:55' },
    { name: 'Hotel California', artists: ['Eagles'], duration: '6:30' },
    { name: 'Stairway to Heaven', artists: ['Led Zeppelin'], duration: '8:02' },
    { name: 'Smells Like Teen Spirit', artists: ['Nirvana'], duration: '5:01' },
    { name: 'Purple Rain', artists: ['Prince'], duration: '8:41' },
  ],
  onLike,
}: MusicTracksListCardProps) {
  const [liked, setLiked] = useState<boolean[]>(tracks.map(t => t.liked ?? false));

  return (
    <div className="card">
      <div className="list-group card-list-group">
        {tracks.map((track, i) => (
          <div key={i} className="list-group-item">
            <div className="row g-2 align-items-center">
              <div className="col-auto fs-3 text-secondary">{i + 1}</div>
              <div className="col-auto">
                {track.albumArt
                  ? <img src={track.albumArt} className="rounded" alt="" width={40} height={40} style={{ objectFit: 'cover' }} />
                  : <div className="rounded d-flex align-items-center justify-content-center"
                      style={{ width: 40, height: 40, background: '#e0e0e0' }}>♪</div>}
              </div>
              <div className="col">
                <div>{track.name}</div>
                {track.artists && (
                  <div className="text-secondary">{track.artists.join(', ')}</div>
                )}
              </div>
              {track.duration && (
                <div className="col-auto text-secondary">{track.duration}</div>
              )}
              <div className="col-auto">
                <button
                  className={`btn btn-icon btn-ghost-secondary${liked[i] ? ' text-red' : ''}`}
                  onClick={() => {
                    const next = [...liked];
                    next[i] = !next[i];
                    setLiked(next);
                    onLike?.(i);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24"
                    viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                    fill={liked[i] ? 'currentColor' : 'none'}>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                  </svg>
                </button>
              </div>
              <div className="col-auto lh-1">
                <div className="dropdown">
                  <a href="#" className="link-secondary" data-bs-toggle="dropdown">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24"
                      viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
