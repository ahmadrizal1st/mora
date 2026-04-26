interface EmptyTeamCardProps {
  title?: string;
  description?: string;
  onInvite?: () => void;
  placeholderAvatars?: number;
}

export function EmptyTeamCard({
  title = 'No Team Members',
  description = 'Invite your team to collaborate on this project.',
  onInvite,
  placeholderAvatars = 4,
}: EmptyTeamCardProps) {
  return (
    <div className="card card-lg card-dashed card-transparent">
      <div className="card-body text-center">
        <div className="mb-3">
          <div className="avatar-list avatar-list-stacked">
            {Array.from({ length: placeholderAvatars }).map((_, i) => (
              <span key={i} className="avatar" style={{ background: `hsl(${i * 60},60%,70%)` }}>?</span>
            ))}
          </div>
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="text-secondary">{description.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</p>
        <div className="mt-4">
          <button className="btn btn-primary" onClick={onInvite}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24"
              viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Invite Members
          </button>
        </div>
      </div>
    </div>
  );
}
