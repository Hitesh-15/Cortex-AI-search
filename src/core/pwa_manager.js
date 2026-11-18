/**
 * Cortex PWA Install & Service Worker Manager (v7.0.0)
 * Enables 1-tap Install App on Android/Desktop Chrome & Edge,
 * plus guided Add to Home Screen instructions on iOS Safari.
 */
(function () {
    class CortexPWAManager {
        constructor() {
            this.deferredPrompt = null;
            this.isStandalone = Boolean(
                window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true
            );
            this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            this.init();
        }

        init() {
            if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('./sw.js').catch(() => {
                        // Graceful silent fallback if restricted by local environment
                    });
                });
            }

            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                this.deferredPrompt = e;
                this.updateInstallButtons();
            });

            window.addEventListener('appinstalled', () => {
                this.deferredPrompt = null;
                this.isStandalone = true;
                this.updateInstallButtons();
                if (typeof window.showToast === 'function') {
                    window.showToast('Cortex installed as an app!', 'success');
                }
            });

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.updateInstallButtons());
            } else {
                this.updateInstallButtons();
            }
        }

        updateInstallButtons() {
            const modalBtn = document.getElementById('btnInstallPwaModal');
            const statusText = document.getElementById('pwaInstallStatusText');
            if (!modalBtn) return;

            if (this.isStandalone) {
                modalBtn.disabled = true;
                modalBtn.innerHTML = '<i class="fa-solid fa-circle-check text-emerald"></i> App Installed';
                if (statusText) statusText.textContent = 'Running in standalone app mode.';
            } else if (this.deferredPrompt) {
                modalBtn.disabled = false;
                modalBtn.innerHTML = '<i class="fa-solid fa-mobile-screen-button text-cyan"></i> Install Cortex App';
                if (statusText) statusText.textContent = 'Ready for 1-tap install on this device (Android / Desktop).';
            } else if (this.isIOS) {
                modalBtn.disabled = false;
                modalBtn.innerHTML = '<i class="fa-brands fa-apple"></i> Add to iPhone Home Screen';
                if (statusText) statusText.textContent = 'On iOS Safari: tap Share -> Add to Home Screen for full-screen app mode.';
            } else {
                modalBtn.disabled = false;
                modalBtn.innerHTML = '<i class="fa-solid fa-download text-cyan"></i> Install App Guide';
                if (statusText) statusText.textContent = 'Install via Chrome/Edge menu ("Install App") on Android or Desktop, or Safari Share -> Add to Home Screen on iOS.';
            }
        }

        async promptInstall() {
            if (this.isStandalone) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Cortex is already running in installed app mode.', 'info');
                }
                return;
            }
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                try {
                    const choice = await this.deferredPrompt.userChoice;
                    if (choice && choice.outcome === 'accepted') {
                        this.deferredPrompt = null;
                        this.updateInstallButtons();
                    }
                } catch (e) {}
                return;
            }
            if (this.isIOS) {
                if (typeof window.showToast === 'function') {
                    window.showToast('In Safari, tap the Share icon (bottom bar) -> "Add to Home Screen".', 'info');
                }
            } else {
                if (typeof window.showToast === 'function') {
                    window.showToast('Open browser menu (⋮) -> "Install app" or "Add to Home screen".', 'info');
                }
            }
        }
    }

    window.CortexPWA = new CortexPWAManager();
})();
