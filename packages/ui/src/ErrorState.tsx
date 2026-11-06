import { Alert, AlertDescription, AlertTitle } from './components/alert';

type ErrorStateProps = {
  message: string;
};

export const ErrorState = ({ message }: ErrorStateProps) => (
  <Alert variant="destructive">
    <AlertTitle>Nastala chyba</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);
