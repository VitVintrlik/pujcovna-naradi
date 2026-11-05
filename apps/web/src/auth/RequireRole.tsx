import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from './RoleContext';
import type { UserRole } from './user-role';
import { paths } from '../paths';

type RequireRoleProps = {
  children: ReactNode;
  role: UserRole;
};

export const RequireRole = ({ children, role: requiredRole }: RequireRoleProps) => {
  const { role } = useRole();

  if (role === requiredRole) {
    return children;
  }

  return <Navigate to={paths.accessDenied} replace />;
};
