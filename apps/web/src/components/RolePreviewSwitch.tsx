import { UserRole } from '@pujcovna/shared';
import { Button } from '@pujcovna/ui';

const ROLE_OPTIONS = [
  { role: UserRole.Customer, label: 'Uživatel' },
  { role: UserRole.Worker, label: 'Pracovník' },
] as const;

type RolePreviewSwitchProps = {
  currentRole: UserRole | undefined;
  onRoleChange: (role: UserRole) => void;
};

export const RolePreviewSwitch = ({ currentRole, onRoleChange }: RolePreviewSwitchProps) => (
  <div aria-label="Náhled role" className="flex items-center gap-1" role="group">
    <span className="hidden text-xs text-muted-foreground sm:inline">Náhled role</span>
    {ROLE_OPTIONS.map(({ role, label }) => (
      <Button
        aria-pressed={currentRole === role}
        key={role}
        onClick={() => onRoleChange(role)}
        size="sm"
        variant={currentRole === role ? 'secondary' : 'ghost'}
      >
        {label}
      </Button>
    ))}
  </div>
);
