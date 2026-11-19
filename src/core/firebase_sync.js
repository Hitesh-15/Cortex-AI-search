/**
 * Cortex Opt-In Google Firebase Auth & Firestore Cross-Device Sync (v7.0.0)
 * -------------------------------------------------------------------------
 * - Local-First by Default: Zero Firebase SDK scripts load unless a user
 *   explicitly configures & signs in to Firebase Cloud Sync.
 * - Per-Thread Storage: users/{uid}/threads/{threadId} (stays well under
 *   Firestore's 1MB document limit and syncs incrementally in real time).
 * - Optional Client-Side AES-256-GCM Encryption via CortexAuthVault.
 */
(function () {
    const STORAGE_CONFIG_KEY = 'cortex_firebase_config_v1';
    const STORAGE_E2EE_KEY = 'cortex_firebase_e2ee_pass_v1';
    const FB_VERSION = '11.0.2';

    class CortexFirebaseSyncEngine {
        constructor() {
            this.app = null;
            this.auth = null;
            this.db = null;
            this.sdk = null;
            this.user = null;
            this.unsubscribeThreads = null;
            this.isInitialized = false;
            this.isSyncingFromRemote = false;
            this.syncedThreadCount = 0;
            this.lastSyncIso = null;

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.autoBootIfConfigured());
            } else {
                setTimeout(() => this.autoBootIfConfigured(), 150);
            }
        }

        getConfig() {
            try {
                const stored = localStorage.getItem(STORAGE_CONFIG_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed.apiKey && parsed.projectId) return parsed;
                }
            } catch (e) {}
            if (window.CORTEX_FIREBASE_CONFIG && window.CORTEX_FIREBASE_CONFIG.apiKey && window.CORTEX_FIREBASE_CONFIG.projectId) {
                return window.CORTEX_FIREBASE_CONFIG;
            }
            return null;
        }

        saveConfigFromInput() {
            const rawEl = document.getElementById('firebaseConfigInput');
            if (!rawEl) return;
            const raw = (rawEl.value || '').trim();
            if (!raw) {
                this.showStatus('Paste your Firebase Web Config JSON object first.', 'error');
                return;
            }
            try {
                // Support both strict JSON and JS object snippet copied from Firebase Console
                let jsonCandidate = raw
                    .replace(/^(?:const|let|var)\s+\w+\s*=\s*/, '')
                    .replace(/;\s*$/, '')
                    .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
                    .replace(/'/g, '"')
                    .replace(/,\s*}/g, '}');
                const parsed = JSON.parse(jsonCandidate);
                if (!parsed.apiKey || !parsed.projectId || !parsed.authDomain) {
                    throw new Error('Config must include apiKey, authDomain, and projectId.');
                }
                localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(parsed));
                this.showStatus(`Firebase project "${parsed.projectId}" saved. You can now sign in.`, 'success');
                this.ensureInitialized().then(() => this.updateUI());
            } catch (err) {
                this.showStatus(`Invalid Firebase config: ${err.message}`, 'error');
            }
        }

        clearSavedConfig() {
            this.signOut().catch(() => {});
            localStorage.removeItem(STORAGE_CONFIG_KEY);
            localStorage.removeItem(STORAGE_E2EE_KEY);
            this.app = null;
            this.auth = null;
            this.db = null;
            this.isInitialized = false;
            this.user = null;
            this.updateUI();
            this.showStatus('Firebase Cloud Sync config removed. Returned to 100% local-only mode.', 'info');
        }

        async autoBootIfConfigured() {
            this.updateUI();
            const cfg = this.getConfig();
            if (!cfg) return;
            // Strictly lazy-load Firebase SDK only if the user previously opted in to Cloud Sync
            if (localStorage.getItem('cortex_firebase_enabled') === 'true') {
                await this.ensureInitialized().catch(() => {});
                this.updateUI();
            }
        }

        async ensureInitialized() {
            if (this.isInitialized && this.auth && this.db) return true;
            const cfg = this.getConfig();
            if (!cfg) {
                throw new Error('Firebase project is not configured yet. Expand "Configure Firebase Project" below.');
            }

            if (!this.sdk) {
                const [appMod, authMod, fsMod] = await Promise.all([
                    import(`https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-app.js`),
                    import(`https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-auth.js`),
                    import(`https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-firestore.js`)
                ]);
                this.sdk = { appMod, authMod, fsMod };
            }

            const { appMod, authMod, fsMod } = this.sdk;
            const existing = appMod.getApps();
            this.app = existing.length > 0 ? existing[0] : appMod.initializeApp(cfg);
            this.auth = authMod.getAuth(this.app);
            this.db = fsMod.getFirestore(this.app);
            this.isInitialized = true;

            authMod.onAuthStateChanged(this.auth, (user) => {
                this.user = user || null;
                if (user) {
                    localStorage.setItem('cortex_firebase_enabled', 'true');
                    this.attachRealtimeListener();
                } else {
                    this.detachRealtimeListener();
                }
                this.updateUI();
            });

            return true;
        }

        isSignedIn() {
            return Boolean(this.user && this.user.uid && this.db);
        }

        async signInWithGoogle() {
            try {
                await this.ensureInitialized();
                const { authMod } = this.sdk;
                const provider = new authMod.GoogleAuthProvider();
                await authMod.signInWithPopup(this.auth, provider);
                if (typeof window.showToast === 'function') {
                    window.showToast('Signed in with Google • Cloud Sync Active', 'success');
                }
                await this.pushAllLocalThreads();
            } catch (err) {
                this.showStatus(err.message || 'Google Sign-In failed.', 'error');
            }
        }

        async signInWithEmail(isSignUp = false) {
            const emailEl = document.getElementById('firebaseEmailInput');
            const passEl = document.getElementById('firebasePasswordInput');
            const email = (emailEl?.value || '').trim();
            const password = (passEl?.value || '').trim();
            if (!email || password.length < 6) {
                this.showStatus('Enter a valid email and password (6+ characters).', 'error');
                return;
            }
            try {
                await this.ensureInitialized();
                const { authMod } = this.sdk;
                if (isSignUp) {
                    await authMod.createUserWithEmailAndPassword(this.auth, email, password);
                    if (typeof window.showToast === 'function') {
                        window.showToast('Account created • Cloud Sync Active', 'success');
                    }
                } else {
                    await authMod.signInWithEmailAndPassword(this.auth, email, password);
                    if (typeof window.showToast === 'function') {
                        window.showToast('Signed in • Cloud Sync Active', 'success');
                    }
                }
                await this.pushAllLocalThreads();
            } catch (err) {
                this.showStatus(err.message || 'Email authentication failed.', 'error');
            }
        }

        async signOut() {
            this.detachRealtimeListener();
            localStorage.removeItem('cortex_firebase_enabled');
            if (this.auth && this.sdk?.authMod) {
                await this.sdk.authMod.signOut(this.auth);
            }
            this.user = null;
            this.updateUI();
            if (typeof window.showToast === 'function') {
                window.showToast('Signed out of Cloud Sync (local threads kept).', 'info');
            }
        }

        getPassphrase() {
            return sessionStorage.getItem(STORAGE_E2EE_KEY) || '';
        }

        setPassphrase(pass) {
            if (pass && pass.trim()) {
                sessionStorage.setItem(STORAGE_E2EE_KEY, pass.trim());
            } else {
                sessionStorage.removeItem(STORAGE_E2EE_KEY);
            }
        }

        sanitizeThreadForFirestore(thread) {
            if (!thread || !thread.id) return null;
            // Compact oversized HTML blobs if needed to stay safely below Firestore's 1MB limit
            const cleanSteps = (thread.steps || []).slice(0, 40).map((s) => ({
                id: s.id || '',
                query: String(s.query || '').slice(0, 1500),
                answer: String(s.answer || '').slice(0, 28000),
                modelName: s.modelName || '',
                costUSD: typeof s.costUSD === 'number' ? s.costUSD : 0,
                sources: (s.sources || []).slice(0, 12).map((src) => ({
                    num: src.num || 1,
                    title: String(src.title || '').slice(0, 200),
                    domain: String(src.domain || '').slice(0, 100),
                    url: String(src.url || '').slice(0, 500),
                    snippet: String(src.snippet || '').slice(0, 400)
                }))
            }));
            return {
                id: String(thread.id),
                title: String(thread.title || 'Research Thread').slice(0, 220),
                focusMode: thread.focusMode || 'web',
                date: thread.date || new Date().toLocaleDateString(),
                updatedAt: thread.updatedAt || Date.now(),
                steps: cleanSteps
            };
        }

        async syncThread(thread) {
            if (!this.isSignedIn() || this.isSyncingFromRemote) return;
            const clean = this.sanitizeThreadForFirestore(thread);
            if (!clean || !clean.steps || clean.steps.length === 0) return;

            try {
                const { fsMod } = this.sdk;
                const ref = fsMod.doc(this.db, 'users', this.user.uid, 'threads', clean.id);
                const pass = this.getPassphrase();
                if (pass && window.CortexAuthVault?.encrypt) {
                    const ciphertext = await window.CortexAuthVault.encrypt(JSON.stringify(clean), pass);
                    await fsMod.setDoc(ref, {
                        id: clean.id,
                        encrypted: true,
                        ciphertext,
                        updatedAt: clean.updatedAt
                    }, { merge: true });
                } else {
                    await fsMod.setDoc(ref, { ...clean, encrypted: false }, { merge: true });
                }
                this.lastSyncIso = new Date().toISOString();
                this.updateUI();
            } catch (err) {
                console.warn('[CortexFirebaseSync] syncThread error:', err.message);
            }
        }

        async pushAllLocalThreads() {
            if (!this.isSignedIn()) return;
            const threads = (window.appState && Array.isArray(window.appState.threads)) ? window.appState.threads : [];
            const valid = threads.filter((t) => t && t.id && t.steps && t.steps.length > 0).slice(0, 50);
            for (const t of valid) {
                await this.syncThread(t);
            }
            this.lastSyncIso = new Date().toISOString();
            this.updateUI();
        }

        async deleteThread(threadId) {
            if (!this.isSignedIn() || !threadId) return;
            try {
                const { fsMod } = this.sdk;
                const ref = fsMod.doc(this.db, 'users', this.user.uid, 'threads', String(threadId));
                await fsMod.deleteDoc(ref);
            } catch (err) {
                console.warn('[CortexFirebaseSync] deleteThread error:', err.message);
            }
        }

        async clearAllCloudThreads() {
            if (!this.isSignedIn()) return;
            try {
                const { fsMod } = this.sdk;
                const colRef = fsMod.collection(this.db, 'users', this.user.uid, 'threads');
                const snap = await fsMod.getDocs(colRef);
                const deletes = [];
                snap.forEach((docSnap) => deletes.push(fsMod.deleteDoc(docSnap.ref)));
                await Promise.all(deletes);
                this.syncedThreadCount = 0;
                this.lastSyncIso = new Date().toISOString();
                this.updateUI();
                if (typeof window.showToast === 'function') {
                    window.showToast('All cloud threads permanently erased from Firebase.', 'info');
                }
            } catch (err) {
                this.showStatus(`Failed to wipe cloud history: ${err.message}`, 'error');
            }
        }

        detachRealtimeListener() {
            if (typeof this.unsubscribeThreads === 'function') {
                this.unsubscribeThreads();
                this.unsubscribeThreads = null;
            }
        }

        attachRealtimeListener() {
            this.detachRealtimeListener();
            if (!this.isSignedIn()) return;

            const { fsMod } = this.sdk;
            const colRef = fsMod.collection(this.db, 'users', this.user.uid, 'threads');
            const q = fsMod.query(colRef, fsMod.orderBy('updatedAt', 'desc'), fsMod.limit(100));

            this.unsubscribeThreads = fsMod.onSnapshot(q, async (snapshot) => {
                const remoteThreads = [];
                const pass = this.getPassphrase();
                for (const docSnap of snapshot.docs) {
                    const data = docSnap.data();
                    if (!data) continue;
                    if (data.encrypted && data.ciphertext) {
                        if (pass && window.CortexAuthVault?.decrypt) {
                            try {
                                const decrypted = await window.CortexAuthVault.decrypt(data.ciphertext, pass);
                                remoteThreads.push(JSON.parse(decrypted));
                            } catch (e) {}
                        }
                    } else if (data.id && Array.isArray(data.steps)) {
                        remoteThreads.push(data);
                    }
                }

                this.syncedThreadCount = remoteThreads.length;
                this.lastSyncIso = new Date().toISOString();

                if (remoteThreads.length > 0 && window.appState) {
                    const localMap = new Map();
                    (window.appState.threads || []).forEach((t) => {
                        if (t && t.id) localMap.set(t.id, t);
                    });

                    let changed = false;
                    for (const rt of remoteThreads) {
                        const existing = localMap.get(rt.id);
                        if (!existing || (rt.updatedAt || 0) > (existing.updatedAt || 0) || (rt.steps?.length || 0) > (existing.steps?.length || 0)) {
                            localMap.set(rt.id, rt);
                            changed = true;
                        }
                    }

                    if (changed) {
                        this.isSyncingFromRemote = true;
                        try {
                            window.appState.threads = Array.from(localMap.values())
                                .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
                            localStorage.setItem('ambu_threads', JSON.stringify(window.appState.threads));
                            if (typeof window.renderThreadHistory === 'function') {
                                window.renderThreadHistory();
                            }
                        } finally {
                            this.isSyncingFromRemote = false;
                        }
                    }
                }
                this.updateUI();
            }, (err) => {
                console.warn('[CortexFirebaseSync] onSnapshot error:', err.message);
            });
        }

        showStatus(msg, type = 'info') {
            const el = document.getElementById('firebaseSyncStatusMsg');
            if (!el) return;
            const colors = { success: '#34d399', error: '#f87171', info: '#38bdf8' };
            el.style.display = 'block';
            el.style.color = colors[type] || '#94a3b8';
            el.textContent = msg;
        }

        updateUI() {
            const cfg = this.getConfig();
            const signedOutBox = document.getElementById('firebaseSignedOutView');
            const signedInBox = document.getElementById('firebaseSignedInView');
            const userEmailEl = document.getElementById('firebaseUserEmail');
            const syncMetaEl = document.getElementById('firebaseSyncMeta');
            const badgeEl = document.getElementById('firebaseProjectBadge');

            if (badgeEl) {
                badgeEl.textContent = cfg ? `Project: ${cfg.projectId}` : 'Not Configured (Local-Only)';
            }

            if (this.isSignedIn()) {
                if (signedOutBox) signedOutBox.style.display = 'none';
                if (signedInBox) signedInBox.style.display = 'block';
                if (userEmailEl) userEmailEl.textContent = this.user.email || this.user.displayName || this.user.uid;
                if (syncMetaEl) {
                    const syncTime = this.lastSyncIso ? new Date(this.lastSyncIso).toLocaleTimeString() : 'Live';
                    syncMetaEl.textContent = `${this.syncedThreadCount} synced threads • Last sync: ${syncTime}`;
                }
            } else {
                if (signedOutBox) signedOutBox.style.display = 'block';
                if (signedInBox) signedInBox.style.display = 'none';
            }
        }
    }

    window.CortexFirebaseSync = new CortexFirebaseSyncEngine();
})();
