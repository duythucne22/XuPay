// ============================================================
// MSW BROWSER WORKER - Service Worker setup for browser
// Starts Mock Service Worker in development mode
// ============================================================

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create the worker instance with all handlers
export const worker = setupWorker(...handlers);

// Export a helper to start the worker with default options
export async function startMockServiceWorker() {
  if (typeof window === 'undefined') {
    throw new Error('MSW browser worker can only run in the browser');
  }

  try {
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
      serviceWorker: {
        url: '/mockServiceWorker.js', // Default MSW service worker path
      },
    });
    console.log('[MSW] Mock Service Worker started ✅');
  } catch (error) {
    console.error('[MSW] Failed to start Mock Service Worker:', error);
    throw error;
  }
}
