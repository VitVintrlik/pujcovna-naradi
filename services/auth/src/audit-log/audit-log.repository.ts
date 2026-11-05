import type { UserRole } from '@pujcovna/shared';
import type { PrismaClient, auditLogEntry } from '../../generated/prisma/client';
import type { AuditAction, AuditEntityType } from './audit-log.constants';

export type AuditLogEntryInput = {
  actorId: string;
  actorRole: UserRole;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
};

export class AuditLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create = (entry: AuditLogEntryInput): Promise<auditLogEntry> =>
    this.prisma.auditLogEntry.create({ data: entry });
}
