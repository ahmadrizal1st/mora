import { useState } from 'react';

interface ProfileEditCardProps {
  avatarSrc?: string;
  onSave?: (data: { email: string; bio: string; password: string }) => void;
}

export function ProfileEditCard({ avatarSrc, onSave }: ProfileEditCardProps) {
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('Big belly rude boy, million dollar hustler. Unemployed.');
  const [password, setPassword] = useState('password');
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">My Profile</h3>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-auto">
            <span className="avatar avatar-lg" style={avatarSrc ? { backgroundImage: `url(${avatarSrc})` } : undefined} />
          </div>
          <div className="col">
            <div className="mb-2">
              <label className="form-label">Email-Address</label>
              <input className="form-control" placeholder="your-email@domain.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="mb-2">
          <label className="form-label">Bio</label>
          <textarea className="form-control" rows={5} value={bio} onChange={e => setBio(e.target.value)} />
        </div>
        <div className="mb-2">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="form-footer">
          <button className="btn btn-primary w-100" onClick={() => onSave?.({ email, bio, password })}>Save</button>
        </div>
      </div>
    </div>
  );
}
