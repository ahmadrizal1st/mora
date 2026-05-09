import React from 'react';
import { CreditTypeCards } from '../CreditTypeCards';
import { DebtPayoffPlannerPreview } from '../DebtPayoffPlannerPreview';

export function CreditTabOverview() {
  return (
    <>
      <CreditTypeCards />
      <DebtPayoffPlannerPreview />
    </>
  );
}
