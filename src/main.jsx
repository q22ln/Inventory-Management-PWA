import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "flowbite";
import { registerSW } from './serviceWorkerRegistration'; // Import Service Worker

registerSW(); // Register the Service Worker

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);