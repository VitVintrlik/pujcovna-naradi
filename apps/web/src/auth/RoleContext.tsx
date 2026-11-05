import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { UserRole } from './user-role';

type RoleContextValue = {
  role: UserRole;
  setRole: Dispatch<SetStateAction<UserRole>>;
};

type RoleProviderProps = {
  children: ReactNode;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export const RoleProvider = ({ children }: RoleProviderProps) => {
  const [role, setRole] = useState(UserRole.Customer);

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const context = useContext(RoleContext);

  if (context === null) {
    throw new Error('useRole must be used within a RoleProvider');
  }

  return context;
};
