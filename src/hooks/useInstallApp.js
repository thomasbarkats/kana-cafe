import { useEffect, useState } from 'react';
import { getMobilePlatform, isInstalledApp } from '../utils/deviceHelper';

// Chrome fires beforeinstallprompt once, possibly before React mounts: catch it at module
// load so the button can open the native install dialog instead of listing manual steps.
let deferredPrompt = null;
const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  notify();
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  notify();
});

// Only offered on phones and tablets: installing on desktop brings nothing worth a button
export const useInstallApp = () => {
  const [hasNativePrompt, setHasNativePrompt] = useState(() => deferredPrompt !== null);
  const [isInstalled, setIsInstalled] = useState(isInstalledApp);

  useEffect(() => {
    const update = () => {
      setHasNativePrompt(deferredPrompt !== null);
      setIsInstalled(isInstalledApp());
    };
    const handleInstalled = () => setIsInstalled(true);

    listeners.add(update);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      listeners.delete(update);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  // A deferred prompt can only be shown once; Chrome fires a fresh event if it is dismissed
  const promptInstall = async () => {
    const prompt = deferredPrompt;
    deferredPrompt = null;
    setHasNativePrompt(false);
    await prompt.prompt();
  };

  return {
    canInstall: getMobilePlatform() !== null && !isInstalled,
    hasNativePrompt,
    promptInstall,
  };
};
