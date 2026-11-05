import { UserRole } from '@pujcovna/shared';
import type { userRole } from '../../generated/prisma/client';

export const toUserRole = (role: userRole): UserRole => {
  switch (role) {
    case 'customer':
      return UserRole.Customer;
    case 'worker':
      return UserRole.Worker;
  }
};
