import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Guard against third-party browser extension injection errors (e.g., MetaMask, wallet extensions)
if (typeof window !== 'undefined') {
  const isExtensionNoise = (val: unknown): boolean => {
    const text = typeof val === 'string' ? val : (val as any)?.stack || (val as any)?.message || String(val || '');
    return text.includes('chrome-extension://') ||
           text.includes('moz-extension://') ||
           text.includes('MetaMask') ||
           text.includes('Failed to connect to MetaMask') ||
           text.includes('ethereum') ||
           text.includes('inpage.js');
  };

  window.addEventListener('error', (event) => {
    if (
      event.filename?.includes('chrome-extension://') ||
      isExtensionNoise(event.message) ||
      isExtensionNoise(event.error)
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (isExtensionNoise(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
