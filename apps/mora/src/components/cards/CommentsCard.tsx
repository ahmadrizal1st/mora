interface Comment {
  authorName: string; 
  avatarSrc?: string; 
  text: string;
  date?: string; 
  votes?: number; 
  liked?: boolean;
}

interface CommentsCardProps {
  title?: string;
  comments?: Comment[];
  onVoteUp?: (i: number) => void;
  onVoteDown?: (i: number) => void;
  onReply?: (i: number) => void;
}

export function CommentsCard({
  title = 'Comments',
  comments = [
    { authorName: 'Alice Smith', date: '5 min ago', text: 'Great post! Really enjoyed reading this.', votes: 24 },
    { authorName: 'Bob Jones', date: '10 min ago', text: 'Thanks for sharing your insights on this topic.', votes: 31 },
    { authorName: 'Carol White', date: '1 hr ago', text: 'Very informative. Looking forward to more content like this.', votes: 18 },
  ],
  onVoteUp,
  onVoteDown,
  onReply,
}: CommentsCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{title}</div>
      </div>
      <div className="card-body">
        {comments.map((c, i) => (
          <div key={i} className={`d-flex${i < comments.length - 1 ? ' mb-5' : ''}`}>
            <div className="me-4">
              <span className={`avatar ${i === 0 ? 'bg-green-lt' : ''}`}
                style={c.avatarSrc ? { backgroundImage: `url(${c.avatarSrc})` } : undefined}>
                {!c.avatarSrc && c.authorName.charAt(0)}
              </span>
            </div>
            <div className="flex-fill">
              <div className="d-flex mt-n1">
                <h5 className="m-0">{c.authorName}</h5>
                {c.date && <div className="ms-auto small text-secondary">{c.date}</div>}
              </div>
              <p className="mb-2">{c.text}</p>
              <div className="small">
                {c.votes !== undefined && (
                  <span className="text-success me-1">+{c.votes}</span>
                )}
                <button className="btn btn-sm btn-ghost-secondary py-0 px-1" onClick={() => onVoteUp?.(i)}>↑</button>
                <button className="btn btn-sm btn-ghost-secondary py-0 px-1 me-1" onClick={() => onVoteDown?.(i)}>↓</button>
                <span className="me-1">·</span>
                <button className="btn btn-sm btn-link text-secondary py-0 px-0 me-1" onClick={() => onReply?.(i)}>Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
