import { Workbox } from 'workbox-window';

export function registerSW() {
    if ('serviceWorker' in navigator) {
        const wb = new Workbox('/sw.js');

        wb.addEventListener('installed', (event) => {
            if (event.isUpdate) {
                console.log('New content available, please refresh.');
            }
        });

        wb.register().catch((err) => console.error('Service Worker registration failed:', err));
    }
}
