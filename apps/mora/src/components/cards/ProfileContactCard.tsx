import { Icon } from '../ui/Icon';
import { Avatar } from '../ui/Avatar';

interface Person {
  full_name?: string;
  job_title?: string;
  photo?: string;
}

interface ProfileContactCardProps {
  person?: Person;
  name?: string;
  jobTitle?: string;
  color?: string;
  avatarSrc?: string;
  onMessage?: () => void;
  onPhone?: () => void;
  onEmail?: () => void;
}

export function ProfileContactCard({
  person,
  name = 'Paige Turner',
  jobTitle = 'Big belly rude boy',
  color = 'yellow',
  avatarSrc,
}: ProfileContactCardProps) {
  const resolvedName = person?.full_name || name;
  const resolvedJobTitle = person?.job_title || jobTitle;

  return (
    <div className={`card card-gradient card-gradient-${color}`}>
      <div className="card-body text-center py-6">
        <div className="position-absolute top-0 end-0 p-1">
          <div className="btn btn-action">
            <Icon icon="star" color="yellow" filled />
          </div>
        </div>
        <div>
          <Avatar
            person={{
              full_name: resolvedName,
              photo: person?.photo || avatarSrc,
            }}
            size="2xl"
            color={color}
          />
        </div>
        <div className="h1 mt-4 mb-1">{resolvedName}</div>
        <div className="text-secondary">{resolvedJobTitle}</div>
        <div className="btn-list justify-content-center mt-3">
          <a href="#" className="btn btn-icon" title="Message" data-bs-toggle="tooltip" data-bs-placement="top">
            <Icon icon="message" />
          </a>
          <a href="#" className="btn btn-icon" title="Phone" data-bs-toggle="tooltip" data-bs-placement="top">
            <Icon icon="phone" />
          </a>
          <a href="#" className="btn btn-icon" title="Email" data-bs-toggle="tooltip" data-bs-placement="top">
            <Icon icon="mail" />
          </a>
        </div>
      </div>
    </div>
  );
}
