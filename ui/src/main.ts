import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

 /* Favicon
 <link rel="icon" type="image/x-icon" href="favicon.ico" /> */

/*if (environment.production) {
  enableProdMode();
}*/

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
