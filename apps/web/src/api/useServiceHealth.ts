import { healthResponseSchema, type HealthResponse } from '@pujcovna/shared';
import { useEffect, useState } from 'react';
import { apiGet } from './client';

type ServiceHealthState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; health: HealthResponse };

export const useServiceHealth = (path: string): ServiceHealthState => {
  const [state, setState] = useState<ServiceHealthState>({ status: 'loading' });

  useEffect(() => {
    apiGet(path, healthResponseSchema)
      .then((health) => setState({ status: 'ready', health }))
      .catch((error: unknown) =>
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : String(error),
        }),
      );
  }, [path]);

  return state;
};
