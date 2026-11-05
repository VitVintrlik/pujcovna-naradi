import { z } from 'zod';

export enum UserRole {
  Customer = 'customer',
  Worker = 'worker',
}

export const userRoleSchema = z.enum(UserRole);

export const authenticatedUserSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  email: z.email(),
  role: userRoleSchema,
});

export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;
