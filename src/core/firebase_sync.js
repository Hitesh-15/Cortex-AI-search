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
            this.unsubscribeProfile = null;
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
            this.importConfigFromUrlHash();
            this.updateUI();
            const cfg = this.getConfig();
            if (!cfg) return;
            // Strictly lazy-load Firebase SDK only if the user previously opted in to Cloud Sync
            if (localStorage.getItem('cortex_firebase_enabled') === 'true') {
                await this.ensureInitialized().catch(() => {});
                this.updateUI();
            }
        }

        importConfigFromUrlHash() {
            try {
                if (!window.location.hash || !window.location.hash.startsWith('#fbcfg=')) return false;
                const rawB64 = window.location.hash.substring(7);
                const decoded = decodeURIComponent(atob(rawB64));
                const parsed = JSON.parse(decoded);
                if (parsed && parsed.apiKey && parsed.projectId && parsed.authDomain) {
                    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(parsed));
                    if (window.history && window.history.replaceState) {
                        window.history.replaceState(null, '', window.location.pathname + window.location.search);
                    }
                    setTimeout(() => {
                        if (typeof window.showToast === 'function') {
                            window.showToast(`Firebase "${parsed.projectId}" imported! Tap Sign in with Google.`, 'success');
                        }
                        if (typeof window.openAuthModal === 'function' && typeof window.switchAuthTab === 'function') {
                            window.openAuthModal();
                            window.switchAuthTab('cloudSync');
                        }
                    }, 400);
                    return true;
                }
            } catch (e) {}
            return false;
        }

        getPhoneSetupUrl() {
            const cfg = this.getConfig();
            if (!cfg) return null;
            const b64 = btoa(encodeURIComponent(JSON.stringify(cfg)));
            const base = `${window.location.origin}${window.location.pathname}`;
            return `${base}#fbcfg=${b64}`;
        }

        togglePhoneQr() {
            const wrap = document.getElementById('firebasePhoneQrWrap');
            const qrTarget = document.getElementById('firebasePhoneQrCanvas');
            if (!wrap || !qrTarget) return;
            const cfg = this.getConfig();
            if (!cfg) {
                this.showStatus('Save your Firebase Config on this device first, then scan the QR on your phone.', 'error');
                return;
            }
            const isVisible = wrap.style.display === 'block';
            if (isVisible) {
                wrap.style.display = 'none';
                return;
            }
            const url = this.getPhoneSetupUrl();
            qrTarget.innerHTML = '';
            if (typeof window.QRCode === 'function') {
                new window.QRCode(qrTarget, {
                    text: url,
                    width: 170,
                    height: 170,
                    colorDark: '#030712',
                    colorLight: '#ffffff',
                    correctLevel: window.QRCode.CorrectLevel.M
                });
            }
            wrap.style.display = 'block';
        }

        copyPhoneSetupLink() {
            const url = this.getPhoneSetupUrl();
            if (!url) {
                this.showStatus('Save your Firebase Config on this device first.', 'error');
                return;
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(() => {
                    if (typeof window.showToast === 'function') {
                        window.showToast('Phone setup link copied! Open it on your phone to auto-configure Firebase.', 'success');
                    }
                }).catch(() => {});
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
                    this.attachProfileListener();
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
                    window.showToast('Signed in with Google • Restoring Full Workspace...', 'success');
                }
                await this.pushAllLocalThreads();
                await this.syncWorkspaceProfile(true);
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
                await this.syncWorkspaceProfile(true);
            } catch (err) {
                this.showStatus(err.message || 'Email authentication failed.', 'error');
            }
        }

        async signOut(cleanLocalDevice = false) {
            this.detachRealtimeListener();
            localStorage.removeItem('cortex_firebase_enabled');
            if (this.auth && this.sdk?.authMod) {
                await this.sdk.authMod.signOut(this.auth);
            }
            this.user = null;

            if (cleanLocalDevice) {
                const keysToPurge = [
                    'ambu_threads', 'ambu_key_openrouter', 'ambu_key_openai', 'ambu_key_claude',
                    'ambu_key_deepseek', 'ambu_discord_webhook', 'cortex_encrypted_vault_v1',
                    'cortex_remember_vault_key', 'cortex_is_authenticated', 'cortex_library_memos',
                    'cortex_bot_config', 'cortex_local_ai_config', STORAGE_E2EE_KEY
                ];
                keysToPurge.forEach((k) => {
                    localStorage.removeItem(k);
                    sessionStorage.removeItem(k);
                });
                if (window.CortexAuthVault?.logout) window.CortexAuthVault.logout();
                if (window.appState) {
                    window.appState.threads = [];
                    window.appState.activeThreadId = null;
                }
                if (typeof window.renderThreadHistory === 'function') window.renderThreadHistory();
                if (typeof window.resetToNewSearch === 'function') window.resetToNewSearch();
            }

            this.updateUI();
            if (typeof window.showToast === 'function') {
                window.showToast(
                    cleanLocalDevice
                        ? 'Signed out & wiped local device cleanly (cloud data kept safe).'
                        : 'Signed out of Cloud Sync (local threads kept).',
                    'info'
                );
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
            if (typeof this.unsubscribeProfile === 'function') {
                this.unsubscribeProfile();
                this.unsubscribeProfile = null;
            }
        }

        collectWorkspaceProfile(onlyNonEmpty = false) {
            const payload = {};
            const put = (key, val) => {
                if (onlyNonEmpty) {
                    if (val !== null && val !== undefined && val !== '' && !(Array.isArray(val) && val.length === 0)) {
                        payload[key] = val;
                    }
                } else {
                    payload[key] = val;
                }
            };

            const orKey = (window.CortexAuthVault?.getActiveKey && window.CortexAuthVault.getActiveKey())
                || localStorage.getItem('ambu_key_openrouter') || '';
            put('openrouterKey', orKey);
            put('openaiKey', localStorage.getItem('ambu_key_openai') || '');
            put('claudeKey', localStorage.getItem('ambu_key_claude') || '');
            put('deepseekKey', localStorage.getItem('ambu_key_deepseek') || '');
            put('encryptedVault', localStorage.getItem('cortex_encrypted_vault_v1') || '');
            put('provider', localStorage.getItem('ambu_provider') || 'openrouter');
            put('model', localStorage.getItem('ambu_model') || 'openrouter/auto');
            put('customModel', localStorage.getItem('ambu_custom_model') || '');
            put('costRouting', localStorage.getItem('ambu_cost_routing') || 'min_cost');
            put('discordWebhook', localStorage.getItem('ambu_discord_webhook') || '');

            try {
                const botCfg = localStorage.getItem('cortex_bot_config');
                if (botCfg) put('botConfig', botCfg);
            } catch (e) {}

            try {
                const localAi = localStorage.getItem('cortex_local_ai_config');
                if (localAi) put('localAiConfig', localAi);
            } catch (e) {}

            try {
                const memosRaw = JSON.parse(localStorage.getItem('cortex_library_memos') || '[]');
                if (Array.isArray(memosRaw) && memosRaw.length > 0) {
                    const compactMemos = memosRaw.slice(0, 25).map((m) => ({
                        id: m.id || '',
                        title: String(m.title || '').slice(0, 200),
                        date: m.date || '',
                        tag: m.tag || '',
                        tagLabel: m.tagLabel || '',
                        html: String(m.html || '').slice(0, 14000)
                    }));
                    put('libraryMemos', compactMemos);
                }
            } catch (e) {}

            return payload;
        }

        async syncWorkspaceProfile(onlyIfNonEmpty = false) {
            if (!this.isSignedIn() || this.isSyncingFromRemote) return;
            const data = this.collectWorkspaceProfile(onlyIfNonEmpty);
            // On a brand-new blank device, skip pushing empty defaults so we don't clobber cloud profile
            const meaningfulKeys = Object.keys(data).filter((k) => !['provider', 'model', 'costRouting'].includes(k));
            if (onlyIfNonEmpty && meaningfulKeys.length === 0) return;

            try {
                const { fsMod } = this.sdk;
                const ref = fsMod.doc(this.db, 'users', this.user.uid, 'profile', 'workspace');
                await fsMod.setDoc(ref, {
                    ...data,
                    updatedAt: Date.now()
                }, { merge: true });
                this.lastSyncIso = new Date().toISOString();
                this.updateUI();
            } catch (err) {
                console.warn('[CortexFirebaseSync] syncWorkspaceProfile error:', err.message);
            }
        }

        attachProfileListener() {
            if (typeof this.unsubscribeProfile === 'function') {
                this.unsubscribeProfile();
                this.unsubscribeProfile = null;
            }
            if (!this.isSignedIn()) return;

            const { fsMod } = this.sdk;
            const ref = fsMod.doc(this.db, 'users', this.user.uid, 'profile', 'workspace');

            this.unsubscribeProfile = fsMod.onSnapshot(ref, (docSnap) => {
                if (!docSnap.exists()) return;
                const d = docSnap.data();
                if (!d) return;

                this.isSyncingFromRemote = true;
                try {
                    if (d.encryptedVault) {
                        localStorage.setItem('cortex_encrypted_vault_v1', d.encryptedVault);
                    }
                    if (d.openrouterKey && d.openrouterKey.length > 15) {
                        localStorage.setItem('ambu_key_openrouter', d.openrouterKey);
                        localStorage.setItem('cortex_remember_vault_key', d.openrouterKey);
                        localStorage.setItem('cortex_is_authenticated', 'true');
                        if (window.appState) {
                            window.appState.auth = window.appState.auth || {};
                            window.appState.auth.isLoggedIn = true;
                            window.appState.auth.activeKey = d.openrouterKey;
                            if (window.appState.settings?.apiKeys) {
                                window.appState.settings.apiKeys.openrouter = d.openrouterKey;
                            }
                        }
                    }
                    if (d.openaiKey) {
                        localStorage.setItem('ambu_key_openai', d.openaiKey);
                        if (window.appState?.settings?.apiKeys) window.appState.settings.apiKeys.openai = d.openaiKey;
                    }
                    if (d.claudeKey) {
                        localStorage.setItem('ambu_key_claude', d.claudeKey);
                        if (window.appState?.settings?.apiKeys) window.appState.settings.apiKeys.claude = d.claudeKey;
                    }
                    if (d.deepseekKey) {
                        localStorage.setItem('ambu_key_deepseek', d.deepseekKey);
                        if (window.appState?.settings?.apiKeys) window.appState.settings.apiKeys.deepseek = d.deepseekKey;
                    }
                    if (d.provider) {
                        localStorage.setItem('ambu_provider', d.provider);
                        if (window.appState?.settings) window.appState.settings.provider = d.provider;
                    }
                    if (d.model) {
                        localStorage.setItem('ambu_model', d.model);
                        if (window.appState?.settings) window.appState.settings.model = d.model;
                    }
                    if (d.customModel !== undefined) {
                        localStorage.setItem('ambu_custom_model', d.customModel || '');
                        if (window.appState?.settings) window.appState.settings.customModel = d.customModel || '';
                    }
                    if (d.discordWebhook) {
                        localStorage.setItem('ambu_discord_webhook', d.discordWebhook);
                        const discordInput = document.getElementById('discordWebhookInput');
                        if (discordInput) discordInput.value = d.discordWebhook;
                    }
                    if (d.botConfig) {
                        localStorage.setItem('cortex_bot_config', d.botConfig);
                        if (window.CortexAutonomousBot?.loadConfig) {
                            window.CortexAutonomousBot.config = window.CortexAutonomousBot.loadConfig();
                        }
                    }
                    if (d.localAiConfig) {
                        localStorage.setItem('cortex_local_ai_config', d.localAiConfig);
                        if (window.CortexLocalAI?.loadConfig) {
                            window.CortexLocalAI.config = window.CortexLocalAI.loadConfig();
                        }
                    }
                    if (Array.isArray(d.libraryMemos) && d.libraryMemos.length > 0) {
                        const existing = JSON.parse(localStorage.getItem('cortex_library_memos') || '[]');
                        const byId = new Map();
                        existing.forEach((m) => { if (m && m.id) byId.set(m.id, m); });
                        d.libraryMemos.forEach((m) => { if (m && m.id) byId.set(m.id, m); });
                        localStorage.setItem('cortex_library_memos', JSON.stringify(Array.from(byId.values())));
                    }

                    if (window.CortexAuthVault?.updateAuthUI) window.CortexAuthVault.updateAuthUI();
                    if (typeof window.updateGatewayStatusBadge === 'function') window.updateGatewayStatusBadge();
                    this.lastSyncIso = new Date().toISOString();
                    this.updateUI();
                } finally {
                    this.isSyncingFromRemote = false;
                }
            }, (err) => {
                console.warn('[CortexFirebaseSync] profile onSnapshot error:', err.message);
            });
        }

        async syncAllNow() {
            await Promise.allSettled([
                this.pushAllLocalThreads(),
                this.syncWorkspaceProfile(false)
            ]);
            if (typeof window.showToast === 'function') {
                window.showToast('Full Workspace Synced (Threads, API Keys, Discord & Watchdog)', 'success');
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
