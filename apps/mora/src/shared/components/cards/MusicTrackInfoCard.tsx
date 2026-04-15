interface TrackInfoProps {
  name?: string;
  artists?: string[];
  albumArt?: string;
}

export function MusicTrackInfoCard({
  name = 'Track Name',
  artists = ['Artist'],
  albumArt,
}: TrackInfoProps) {
  return (
    <div className="card">
      <div className="row row-0">
        <div className="col-auto">
          {albumArt
            ? <img src={albumArt} className="rounded-start" alt={name} width={80} height={80} style={{ objectFit: 'cover' }} />
            : <div className="rounded-start d-flex align-items-center justify-content-center"
                style={{ width: 80, height: 80, background: '#e0e0e0' }}>♪</div>}
        </div>
        <div className="col">
          <div className="card-body">
            <div>{name}</div>
            <div className="text-secondary">{artists?.join(', ')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
