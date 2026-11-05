import type { UserRole } from '@pujcovna/shared';
import { toUserRole } from '../user/user.mapper';
import type { UserRepository } from '../user/user.repository';
import { AuditAction, AuditEntityType } from './audit-log.constants';
import type { AuditLogRepository } from './audit-log.repository';

type RecordRegistrationInput = { userId: string; role: UserRole };
type RecordSignInInput = { sessionId: string; userId: string };

export class AuditLogService {
  constructor(
    private readonly auditLogRepository: AuditLogRepository,
    private readonly userRepository: UserRepository,
  ) {}

  recordRegistration = async ({ userId, role }: RecordRegistrationInput): Promise<void> => {
    await this.auditLogRepository.create({
      actorId: userId,
      actorRole: role,
      action: AuditAction.UserRegister,
      entityType: AuditEntityType.User,
      entityId: userId,
    });
  };

  recordSignIn = async ({ sessionId, userId }: RecordSignInInput): Promise<void> => {
    const user = await this.userRepository.get(userId);
    if (!user) {
      throw new Error(`Session ${sessionId} belongs to missing user ${userId}`);
    }
    await this.auditLogRepository.create({
      actorId: userId,
      actorRole: toUserRole(user.role),
      action: AuditAction.UserSignIn,
      entityType: AuditEntityType.Session,
      entityId: sessionId,
    });
  };
}
