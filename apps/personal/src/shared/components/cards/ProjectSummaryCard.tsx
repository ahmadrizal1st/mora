interface ProjectSummaryCardProps {
  title?: string;
  dueDate?: string;
  stage?: string;
  stageColor?: string;
  projectColor?: string;
  percentage?: number;
  percentageColor?: string;
  avatarCount?: number;
}

export function ProjectSummaryCard({
  title = 'New website',
  dueDate = '28 Aug 2019',
  stage = 'Waiting',
  stageColor = 'green',
  projectColor = 'primary',
  percentage = 0,
  percentageColor = 'primary',
  avatarCount = 3,
}: ProjectSummaryCardProps) {
  return (
    <div className="card">
      <div className="card-body p-4 py-5 text-center">
        <span className={`avatar avatar-xl bg-${projectColor}-lt rounded mb-4`}>W</span>
        <h3 className="mb-0">{title}</h3>
        <p className="text-secondary">Due to: {dueDate}</p>
        <p className="mb-3">
          <span className={`badge bg-${stageColor}-lt`}>{stage}</span>
        </p>
        <div className="avatar-list avatar-list-stacked">
          {Array.from({ length: avatarCount }).map((_, i) => (
            <span key={i} className="avatar avatar-sm"
              style={{ background: `hsl(${i * 80},60%,60%)` }}>
              {String.fromCharCode(65 + i)}
            </span>
          ))}
        </div>
      </div>
      <div className="progress card-progress" style={{ height: 4 }}>
        <div className={`progress-bar bg-${percentageColor}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
