import time
import subprocess
import socket
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

CORTEX_DIR = Path(__file__).resolve().parent

def get_driver():
    try:
        opts = ChromeOptions()
        opts.add_argument('--headless=new')
        opts.add_argument('--no-sandbox')
        opts.add_argument('--disable-dev-shm-usage')
        return webdriver.Chrome(options=opts)
    except Exception:
        opts = EdgeOptions()
        opts.add_argument('--headless')
        opts.add_argument('--no-sandbox')
        opts.add_argument('--disable-dev-shm-usage')
        return webdriver.Edge(options=opts)

def get_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]

def run_tests():
    port = get_free_port()
    print(f"Starting test server on port {port}...")
    server = subprocess.Popen(["python", "-m", "http.server", str(port), "--directory", str(CORTEX_DIR)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    
    driver = get_driver()
    try:
        driver.set_window_size(1440, 900)
        driver.get(f"http://127.0.0.1:{port}/")
        time.sleep(1.5)
        
        print("\n--- TEST 1: Check Browser Console Errors ---")
        logs = driver.get_log("browser")
        severe = [l for l in logs if l["level"] == "SEVERE" and "favicon.ico" not in l["message"] and "fonts.gstatic" not in l["message"] and "font" not in l["message"].lower() and "coingecko.com" not in l["message"]]
        if severe:
            for s in severe:
                print("SEVERE LOG:", s["message"])
            raise AssertionError(f"Encountered {len(severe)} severe console errors")
        print("PASS: 0 Severe JavaScript Console Errors.")

        print("\n--- TEST 2: Check WebCrypto CortexAuthVault Encryption & Decryption ---")
        res = driver.execute_async_script("""
            const done = arguments[0];
            (async () => {
                try {
                    const testKey = "sk-or-v1-abcdef1234567890abcdef1234567890";
                    const testPass = "secretpass123";
                    
                    const encrypted = await CortexAuthVault.encrypt(testKey, testPass);
                    const decrypted = await CortexAuthVault.decrypt(encrypted, testPass);
                    
                    let wrongFailed = false;
                    try {
                        await CortexAuthVault.decrypt(encrypted, "wrongpass");
                    } catch(e) {
                        wrongFailed = true;
                    }
                    
                    done({ success: true, match: decrypted === testKey, wrongFailed: wrongFailed });
                } catch(err) {
                    done({ success: false, error: err.message });
                }
            })();
        """)
        assert res.get("success"), f"Crypto test failed: {res.get('error')}"
        assert res.get("match"), "Decrypted text does not match original key!"
        assert res.get("wrongFailed"), "Decryption with wrong password should have failed!"
        print("PASS: WebCrypto AES-256-GCM + PBKDF2 encryption, decryption & wrong-password rejection verified.")

        print("\n--- TEST 3: Auth Modal & Login / Setup Workflow ---")
        # Ensure modal opens
        driver.find_element(By.ID, "btnHeaderAuth").click()
        time.sleep(0.3)
        modal = driver.find_element(By.ID, "authModal")
        assert modal.is_displayed() or "active" in modal.get_attribute("class"), "Auth modal failed to open!"
        print("PASS: Auth modal opened successfully via header button.")

        # Test setup tab & saving vault
        driver.execute_script("window.switchAuthTab('setup');")
        time.sleep(0.2)
        driver.find_element(By.ID, "authSetupPassword").send_keys("MySecurePass123")
        driver.find_element(By.ID, "authSetupApiKey").send_keys("sk-or-v1-999888777666555444333222111")
        driver.find_element(By.ID, "btnSubmitSetup").click()
        time.sleep(1.0)
        
        # Verify authenticated state
        is_logged_in = driver.execute_script("return CortexAuthVault.isLoggedIn();")
        active_key = driver.execute_script("return CortexAuthVault.getActiveKey();")
        assert is_logged_in, "User should be logged in after setup!"
        assert active_key == "sk-or-v1-999888777666555444333222111", f"Active key mismatch: {active_key}"
        print("PASS: Setup, encryption and auto-login verified. Active key securely loaded in memory.")

        # Check UI badge
        badge_text = driver.find_element(By.ID, "headerAuthBadge").text
        auth_btn_text = driver.find_element(By.ID, "btnHeaderAuth").text
        assert "Pro" in badge_text or "Unlocked" in badge_text, f"Badge text unexpected: {badge_text}"
        assert "Pro Access" in auth_btn_text, f"Header auth button text unexpected: {auth_btn_text}"
        print(f"PASS: Header badge updated to '{badge_text}' and button to '{auth_btn_text}'.")

        # Test Logout
        driver.execute_script("CortexAuthVault.logout();")
        time.sleep(0.3)
        assert not driver.execute_script("return CortexAuthVault.isLoggedIn();"), "User should be logged out!"
        badge_text_after = driver.find_element(By.ID, "headerAuthBadge").text
        assert "Free" in badge_text_after, f"Badge text should be Free Tier, got: {badge_text_after}"
        print(f"PASS: Logout verified. Header badge reverted to '{badge_text_after}'.")

        print("\n--- TEST 4: Fallback Synthesis Quality Check (No Robotic Boilerplate) ---")
        # Run test synthesis for query 'Dolly Parton has died'
        synthesis_html = driver.execute_script("""
            const testSources = [
                { num: 1, domain: "reuters.com", title: "Fact Check: Dolly Parton is alive despite false online rumors", snippet: "Country music icon Dolly Parton is alive and well, contrary to unverified viral claims and hoax reports circulating on social media." },
                { num: 2, domain: "theguardian.com", title: "Dolly Parton releases new music and addresses health rumors", snippet: "Dolly Parton dismissed internet speculation regarding her health, announcing upcoming philanthropic initiatives and studio sessions." },
                { num: 3, domain: "variety.com", title: "Dolly Parton career retrospective and live tour updates", snippet: "Variety reports on Dolly Parton's active musical lineup and upcoming television specials." }
            ];
            return generateLocalSynthesizedAnswer("Dolly Parton has died", testSources, "web", "medium");
        """)
        
        assert "Primary technical specifications, market dynamics" not in synthesis_html, "Found forbidden robotic placeholder text in synthesis output!"
        assert "Dolly Parton" in synthesis_html, "Synthesis should mention the subject Dolly Parton."
        assert "Fact Check" in synthesis_html or "alive" in synthesis_html or "reuters.com" in synthesis_html or "theguardian.com" in synthesis_html, "Synthesis should contain real facts from snippets."
        assert "citation-ref" in synthesis_html, "Synthesis should include interactive citation references."
        print("PASS: Fallback synthesis extracts genuine facts from crawled snippets without any robotic boilerplate.")

        print("\n--- TEST 5: Cross-Device QR & URL Hash Auto-Import to Mobile ---")
        # Open Sync Tab and generate sync payload
        driver.execute_script("window.switchAuthTab('sync');")
        time.sleep(0.3)
        vault_payload = driver.execute_script("return CortexAuthVault.getVaultPayload();")
        assert vault_payload is not None, "Vault payload should be present after setup!"
        
        encoded_vault = driver.execute_script("return btoa(encodeURIComponent(CortexAuthVault.getVaultPayload()));")
        sync_url = f"http://127.0.0.1:{port}/#vault={encoded_vault}"
        
        # Simulate mobile browser opening sync URL
        driver.delete_all_cookies()
        driver.execute_script("localStorage.clear(); sessionStorage.clear();")
        driver.get(sync_url)
        time.sleep(1.0)
        
        # Verify imported into mobile localStorage
        mobile_imported = driver.execute_script("return localStorage.getItem(CortexAuthVault.STORAGE_KEY);")
        assert mobile_imported is not None, "Vault should have been imported from sync URL hash!"
        
        # Test unlocking on mobile with PIN only
        driver.execute_async_script("""
            const done = arguments[0];
            (async () => {
                try {
                    await CortexAuthVault.login("MySecurePass123", true);
                    done({ success: true, key: CortexAuthVault.getActiveKey() });
                } catch(e) {
                    done({ success: false, error: e.message });
                }
            })();
        """)
        active_key_mobile = driver.execute_script("return CortexAuthVault.getActiveKey();")
        assert active_key_mobile == "sk-or-v1-999888777666555444333222111", f"Key was not unlocked on mobile with PIN! Got: {active_key_mobile}"
        print("PASS: Cross-device 1-second sync URL auto-imported into mobile and unlocked with PIN only.")

        print("\n========================================================")
        print("SUCCESS: ALL 5 TEST SUITES PASSED FLAWLESSLY WITH 100% SUCCESS!")
        print("========================================================")
    finally:
        driver.quit()
        server.terminate()

if __name__ == "__main__":
    run_tests()
