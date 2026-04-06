import { Icon } from '../ui/Icon';

interface ProjectProgressCardProps {
  title?: string;
  imageSrc?: string;
  updatedAt?: string;
  progress?: number;
}

export function ProjectProgressCard({
  title = 'Project Title',
  imageSrc,
  updatedAt = 'Updated 2 hours ago',
  progress = 25,
}: ProjectProgressCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-3">
            {imageSrc
              ? <img src={imageSrc} alt={title} className="rounded" style={{ width: '100%' }} />
              : <div className="rounded d-flex align-items-center justify-content-center bg-blue-lt"
                  style={{ aspectRatio: '1', fontSize: 24 }}>📋</div>}
          </div>
          <div className="col">
            <h3 className="card-title mb-1">
              <a href="#" className="text-reset">{title}</a>
            </h3>
            <div className="text-secondary">{updatedAt}</div>
            <div className="mt-3">
              <div className="row g-2 align-items-center">
                <div className="col-auto">{progress}%</div>
                <div className="col">
                  <div className="progress progress-sm">
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <button className="btn btn-icon btn-ghost-secondary">
              <Icon icon="dots-vertical" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
