import { useState, useEffect } from 'react';
import { Icon } from '../ui/Icon';

interface GalleryPhotoCardProps {
  imageSrc: string;
  authorName?: string;
  authorAvatarSrc?: string;
  date?: string;
  views?: number;
  likes?: number;
  liked?: boolean;
  hideLikes?: boolean;
  onLike?: () => void;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function GalleryPhotoCard({
  imageSrc,
  authorName = 'Jane Cooper',
  authorAvatarSrc,
  date = '2 days ago',
  views = 420,
  likes = 64,
  liked = false,
  hideLikes = false,
  onLike,
}: GalleryPhotoCardProps) {
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    if (liked) {
      setIsAnimate(true);
      const timer = setTimeout(() => setIsAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [liked]);

  return (
    <div className="card card-sm">
      <a href="#" className="d-block">
        <img src={imageSrc} className="card-img-top" alt="" />
      </a>
      <div className="card-body">
        <div className="d-flex align-items-center">
          <span className="avatar me-3"
            style={authorAvatarSrc ? { backgroundImage: `url(${authorAvatarSrc})` } : undefined}>
            {!authorAvatarSrc && getInitials(authorName)}
          </span>
          <div>
            <div>{authorName}</div>
            <div className="text-secondary">{date}</div>
          </div>
          {!hideLikes && (
            <div className="ms-auto d-flex align-items-center">
              <span className="text-secondary me-3 d-inline-flex align-items-center">
                <Icon icon="eye" className="icon me-1" />
                {views}
              </span>
              <a 
                href="#" 
                className={`text-secondary${liked ? ' text-red' : ''} d-inline-flex align-items-center`} 
                onClick={(e) => { e.preventDefault(); onLike?.(); }}
              >
                <Icon 
                  icon="heart" 
                  className={`icon me-1 ${isAnimate ? 'icon-pulse' : ''}`} 
                  filled={liked} 
                />
                {likes}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
