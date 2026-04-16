import React from 'react';

// Keep this as a dummy export for components that previously imported AuthProvider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
