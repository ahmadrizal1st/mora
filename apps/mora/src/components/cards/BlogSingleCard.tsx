type BlogCardType = 'none' | 'image' | 'aside';

interface BlogSingleCardProps {
  title?: string;
  description?: string;
  authorName?: string;
  authorAvatarSrc?: string;
  date?: string;
  imageSrc?: string;
  type?: BlogCardType;
  liked?: boolean;
  onLike?: () => void;
}

export function BlogSingleCard({
  title = 'Article Title',
  description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  authorName = 'Jane Cooper',
  authorAvatarSrc,
  date = '3 days ago',
  imageSrc,
  type = 'none',
  liked = false,
  onLike,
}: BlogSingleCardProps) {
  const content = (
    <>
      <h3 className="card-title"><a href="#">{title}</a></h3>
      <div className="text-secondary">{description}</div>
      <div className="d-flex align-items-center pt-4 mt-auto">
        <span className="avatar me-3"
          style={authorAvatarSrc ? { backgroundImage: `url(${authorAvatarSrc})` } : undefined}>
          {!authorAvatarSrc && authorName.charAt(0)}
        </span>
        <div>
          <a href="#" className="text-body">{authorName}</a>
          <div className="text-secondary">{date}</div>
        </div>
        <div className="ms-auto">
          <button className={`btn btn-icon btn-ghost-secondary${liked ? ' text-red' : ''}`} onClick={onLike}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24"
              viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
              fill={liked ? 'currentColor' : 'none'}>
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="card d-flex flex-column">
      {type === 'aside' && imageSrc ? (
        <div className="row row-0 flex-fill">
          <div className="col-md-3">
            <a href="#"><img src={imageSrc} className="w-100 h-100 object-cover" alt="Card side" /></a>
          </div>
          <div className="col"><div className="card-body">{content}</div></div>
        </div>
      ) : (
        <>
          {type === 'image' && imageSrc && (
            <a href="#"><img className="card-img-top" src={imageSrc} alt={title} /></a>
          )}
          <div className="card-body d-flex flex-column">{content}</div>
        </>
      )}
    </div>
  );
}
