import { Card, CardContent } from './components/card';

type LoadingStateProps = {
  label?: string;
};

export const LoadingState = ({ label = 'Načítání...' }: LoadingStateProps) => (
  <Card>
    <CardContent>
      <p aria-live="polite" className="text-sm text-muted-foreground" role="status">
        {label}
      </p>
    </CardContent>
  </Card>
);
