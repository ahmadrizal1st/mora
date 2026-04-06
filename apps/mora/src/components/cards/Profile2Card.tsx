interface Profile2CardProps {
  name?: string;
  jobTitle?: string;
  avatarSrc?: string;
  socials?: { icon: string; title: string; href?: string }[];
}

export function Profile2Card({
  name = 'Jane Cooper',
  jobTitle = 'Regional Paradigm Technician',
  avatarSrc,
  socials = [
    { icon: 'brand-facebook', title: 'Facebook' },
    { icon: 'brand-x', title: 'X' },
    { icon: 'phone', title: '1234567890' },
  ],
}: Profile2CardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="media">
          <span
            className="avatar avatar-xl me-4"
            style={avatarSrc ? { backgroundImage: `url(${avatarSrc})` } : undefined}
          >
            {!avatarSrc && name.charAt(0)}
          </span>
          <div className="media-body ms-4">
            <h3>{name}</h3>
            <p className="text-secondary mb-0">{jobTitle}</p>
            <ul className="social-links list-inline mb-0 mt-2">
              {socials.map((s, i) => (
                <li key={i} className="list-inline-item">
                  <a href={s.href || '#'} title={s.title} data-bs-toggle="tooltip">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24"
                      viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                      <use href={`#ti-${s.icon}`} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
