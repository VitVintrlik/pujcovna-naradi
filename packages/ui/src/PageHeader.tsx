import type { ReactNode } from 'react';
import { Heading } from './Heading';

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
};

export const PageHeader = ({ title, eyebrow, description, action }: PageHeaderProps) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div className="space-y-2">
      {eyebrow && (
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">{eyebrow}</p>
      )}
      <Heading level={1}>{title}</Heading>
      {description && <p className="max-w-2xl leading-7 text-muted-foreground">{description}</p>}
    </div>
    {action}
  </div>
);
