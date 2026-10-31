import { createApp } from './app';
import { environment } from './env';

createApp().listen(environment.PORT, () => {
  console.info(`reference-data-service listening on http://localhost:${environment.PORT}`);
});
