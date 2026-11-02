import type { Prisma } from '../generated/prisma/client';

export const recordAudit = async (
  transaction: Prisma.TransactionClient,
  data: Prisma.auditLogEntryCreateArgs['data'],
) => transaction.auditLogEntry.create({ data });
