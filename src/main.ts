import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { setupWorker } from 'msw/browser';
import { mockHandlers } from './mocks';

console.log('Setting up Mock Service Worker...');

const appConfig = {
  providers: [provideRouter(routes), provideHttpClient()],
};

setupWorker(...mockHandlers)
  .start()
  .then(() => {
    console.log('Mock Service Worker started.');
    bootstrapApplication(AppComponent, appConfig)
      .then(() => console.log('Angular application bootstrapped.'))
      .catch((err) =>
        console.error('Failed to bootstrap Angular application:', err)
      );
  })
  .catch((err) => console.error('Failed to start mock service worker:', err));
