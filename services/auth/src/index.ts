import { createApp } from './app';
import { environment } from './env';

createApp().listen(environment.PORT, () => {
  console.info(`auth-service listening on http://localhost:${environment.PORT}`);
});
