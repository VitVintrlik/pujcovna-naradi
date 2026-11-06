import { useRolePreview } from '../auth/RolePreviewContext';
import { useCurrentUser } from './use-current-user';

// The preview only changes what the web app shows; the services check the role in the JWT.
export const useCurrentRole = () => {
  const currentUser = useCurrentUser();
  const { rolePreview } = useRolePreview();

  return rolePreview ?? currentUser.data?.role;
};
