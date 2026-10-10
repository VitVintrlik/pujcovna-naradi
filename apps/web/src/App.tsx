import { useServiceHealth } from './api/useServiceHealth';

export const App = () => {
  const health = useServiceHealth('/api/example/health');

  return (
    <main>
      <h1>Půjčovna nářadí</h1>
      {health.status === 'loading' && <p>Checking example-service…</p>}
      {health.status === 'error' && <p>example-service is not reachable: {health.message}</p>}
      {health.status === 'ready' && <p>example-service: {health.health.status}</p>}
    </main>
  );
};
