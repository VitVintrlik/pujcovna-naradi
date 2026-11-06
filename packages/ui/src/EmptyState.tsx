import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/card';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground">{description}</p>
      {action}
    </CardContent>
  </Card>
);
