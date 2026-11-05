import type { PrismaClient, user } from '../../generated/prisma/client';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  get = (id: string): Promise<user | null> => this.prisma.user.findUnique({ where: { id } });
}
