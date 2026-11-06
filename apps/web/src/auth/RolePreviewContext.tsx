import type { UserRole } from '@pujcovna/shared';
import { createContext, useContext, useState, type ReactNode } from 'react';

type RolePreviewContextValue = {
  rolePreview: UserRole | null;
  setRolePreview: (role: UserRole) => void;
};

type RolePreviewProviderProps = {
  children: ReactNode;
};

const RolePreviewContext = createContext<RolePreviewContextValue | null>(null);

export const RolePreviewProvider = ({ children }: RolePreviewProviderProps) => {
  const [rolePreview, setRolePreview] = useState<UserRole | null>(null);

  return (
    <RolePreviewContext.Provider value={{ rolePreview, setRolePreview }}>
      {children}
    </RolePreviewContext.Provider>
  );
};

export const useRolePreview = () => {
  const context = useContext(RolePreviewContext);

  if (context === null) {
    throw new Error('useRolePreview must be used within a RolePreviewProvider');
  }

  return context;
};
