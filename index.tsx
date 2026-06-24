import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './components/ThemeProvider';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  // Service Worker Registration removed for dev stability
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(const registration of registrations) {
        registration.unregister();
      }
    });
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (e: any) {
  console.error("index.tsx crash", e);
  const el = document.createElement('div');
  el.style.cssText = "position:fixed;top:0;left:0;z-index:99999;background:rgba(255,0,0,1);color:white;padding:20px;width:100vw;height:100vh;overflow:auto;";
  el.innerHTML = "<h1>CRASH LOG:</h1><pre>" + (e.stack || e.message || String(e)) + "</pre>";
  document.body.appendChild(el);
}