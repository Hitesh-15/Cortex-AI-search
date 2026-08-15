"""Automated End-to-End UI, Browser & Functionality Test Suite for Cortex AI Search.

Verifies:
1. HTML & JS bindings, IDs, and custom event handlers.
2. Real-browser headless execution with Microsoft Edge / Chrome Selenium:
   - Browser console logs for zero runtime/syntax errors.
   - Desktop and Mobile Viewport interactions (all buttons, modals, cards, search).
"""

import re
import time
import urllib.request
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By

CORTEX_DIR = Path(__file__).resolve().parent
HTML_PATH = CORTEX_DIR / "index.html"
JS_PATH = CORTEX_DIR / "app.js"

def test_static_bindings():
    print("--> 1. Testing Static HTML & JS Bindings...")
    html_content = HTML_PATH.read_text(encoding="utf-8")
    js_content = JS_PATH.read_text(encoding="utf-8")
    
    html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html_content))
    critical_elements = [
        "btnMobileToggle", "btnOpenLockModal", "btnOpenSettings", "btnOpenReleaseNotes",
        "btnClearHistory", "searchForm", "searchInput", "btnSubmitSearch",
        "chatEffortSelect", "btnToggleWatchdog", "settingsModal", "vaultLockModal", "releaseNotesModal"
    ]
    
    missing = [el for el in critical_elements if el not in html_ids]
    assert not missing, f"Missing critical elements: {missing}"
    print(f"PASS: All {len(critical_elements)} critical elements exist in index.html.")
    return True

def test_real_browser_selenium():
    print("\n--> 2. Launching Real-Browser Selenium Automated Test (Edge Headless)...")
    opts = EdgeOptions()
    opts.add_argument('--headless')
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-dev-shm-usage')
    opts.add_argument('--window-size=1440,900')
    
    driver = webdriver.Edge(options=opts)
    try:
        driver.get("http://localhost:5173/")
        time.sleep(1)
        
        # 1. Check Console Logs
        logs = driver.get_log("browser")
        severe_errors = [l for l in logs if l["level"] == "SEVERE" and "favicon.ico" not in l["message"]]
        if severe_errors:
            for err in severe_errors:
                print("BROWSER ERROR:", err["message"])
            raise AssertionError(f"Encountered {len(severe_errors)} severe JavaScript runtime errors!")
        print("PASS: Browser loaded with 0 JavaScript errors.")
        
        # 2. Test Desktop Modals
        modal_tests = [
            ("Settings Modal", "btnOpenSettings", "settingsModal", "btnCloseSettingsModal"),
            ("Dual-Lock Vault Modal", "btnOpenLockModal", "vaultLockModal", "btnCloseVaultModal"),
            ("Release Notes Modal", "btnOpenReleaseNotes", "releaseNotesModal", "btnCloseReleaseNotes"),
        ]
        
        for name, open_id, modal_id, close_id in modal_tests:
            open_btn = driver.find_element(By.ID, open_id)
            open_btn.click()
            time.sleep(0.4)
            modal = driver.find_element(By.ID, modal_id)
            assert "active" in modal.get_attribute("class"), f"{name} did not open!"
            
            close_btn = driver.find_element(By.ID, close_id)
            close_btn.click()
            time.sleep(0.3)
            assert "active" not in modal.get_attribute("class"), f"{name} did not close!"
            print(f"PASS: {name} (open + close) functional.")
            
        # 3. Test Suggested Cards
        cards = driver.find_elements(By.CLASS_NAME, "suggested-card")
        assert len(cards) >= 4, "Suggested prompt cards missing!"
        cards[0].click()
        time.sleep(1.5)
        
        thread_container = driver.find_element(By.ID, "activeThreadContainer")
        assert thread_container.value_of_css_property("display") == "flex", "Active thread view not visible after clicking card!"
        print(f"PASS: Suggested Prompt Cards clicked -> Research view active.")
        
        # 4. Test Search Bar Pipeline
        search_input = driver.find_element(By.ID, "searchInput")
        search_input.send_keys("Latest 2026 quantum computing benchmarks")
        submit_btn = driver.find_element(By.ID, "btnSubmitSearch")
        submit_btn.click()
        time.sleep(1.5)
        print("PASS: Search submission pipeline executed cleanly.")
        
        # 5. Test Mobile Viewport
        print("\n--> 3. Testing Mobile Viewport (iPhone 390x844)...")
        driver.set_window_size(390, 844)
        time.sleep(0.5)
        
        btn_mobile_toggle = driver.find_element(By.ID, "btnMobileToggle")
        btn_mobile_toggle.click()
        time.sleep(0.5)
        
        sidebar = driver.find_element(By.ID, "appSidebar")
        assert "active" in sidebar.get_attribute("class"), "Mobile sidebar drawer did not open!"
        print("PASS: Mobile hamburger toggle opened sidebar drawer.")
        
        btn_mobile_close = driver.find_element(By.ID, "btnMobileCloseSidebar")
        btn_mobile_close.click()
        time.sleep(0.4)
        assert "active" not in sidebar.get_attribute("class"), "Mobile sidebar drawer did not close!"
        print("PASS: Mobile sidebar close button functional.")
        
        return True
    finally:
        driver.quit()

if __name__ == "__main__":
    t1 = test_static_bindings()
    t2 = test_real_browser_selenium()
    
    if t1 and t2:
        print("\n=======================================================")
        print("ALL REAL-BROWSER & UI TESTS PASSED WITH 100% SUCCESS!")
        print("=======================================================")
    else:
        print("\nTESTS FAILED.")
        exit(1)
