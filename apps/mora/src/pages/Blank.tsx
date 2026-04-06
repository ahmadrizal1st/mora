// src/pages/Blank.tsx
import BaseLayout from '../layouts/BaseLayout';
import { Empty } from '../components/ui/Empty';

export default function Blank() {
  return (
    <BaseLayout pageTitle="Blank page" containerCentered>
      <Empty
        buttonText="Add your first client"
        buttonIcon="plus"
        illustration="computer-fix"
      />
    </BaseLayout>
  );
}