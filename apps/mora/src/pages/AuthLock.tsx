// src/pages/AuthLock.tsx
import SingleLayout from '../layouts/SingleLayout';
import { AuthLockCard } from '../components/cards';
import people from '../data/people.json';

export default function AuthLock() {
  const person = people[0];

  return (
    <SingleLayout>
      <AuthLockCard person={person} />
    </SingleLayout>
  );
}
