import { useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface AuthLockCardProps {
  person?: any;
  onUnlock?: (password: string) => void;
}

export function AuthLockCard({
  person,
  onUnlock,
}: AuthLockCardProps) {
  const [password, setPassword] = useState('');
  const name = person?.full_name || 'Paige Turner';

  return (
    <form
      className="card card-md"
      action="."
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        onUnlock?.(password);
      }}
      autoComplete="off"
      noValidate
    >
      <div className="card-body text-center">
        <div className="mb-4">
          <h2 className="card-title">Account Locked</h2>
          <p className="text-secondary">Please enter your password to unlock your account</p>
        </div>

        <div className="mb-4">
          <Avatar person={person} size="xl" className="mb-3" />
          <h3>{name}</h3>
        </div>

        <div className="mb-4">
          <input
            type="password"
            className="form-control"
            placeholder="Password…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <Button
            color="primary"
            block
            icon="lock-open"
            text="Unlock"
            element="button"
            type="submit"
          />
        </div>
      </div>
    </form>
  );
}
