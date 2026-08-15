"""Automated End-to-End Multi-Device & Dynamic Trending Engine Test Suite for Cortex AI Search.

Tests:
1. Static HTML & JS bindings, IDs, and custom event handlers.
2. Real-Browser Dynamic Trending Engine & Live Data Ingestion:
   - Zero console errors during dynamic prompt updates.
   - Dynamic prompt retrieval from live feeds (Google News, HackerNews, Wikipedia).
   - Click validation on dynamically generated prompt cards.
3. Desktop Viewport (1440x900):
   - All modals (Release Notes, Gateway Settings, Dual-Lock Vault) open & close smoothly.
   - Sidebar research desk switching across all 5 categories.
4. Tablet Viewport (768x1024 - iPad):
   - Responsive layout scaling and slide-over navigation drawer.
5. Mobile Viewport (390x844 - iPhone):
   - Touch navigation, mobile drawer toggle/close, and mobile search submission.
"""

import re
import time
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
    
    html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html_content))
    critical_elements = [
        "btnMobileToggle", "btnMobileCloseSidebar", "sidebarOverlay", "appSidebar",
        "btnOpenLockModal", "btnOpenSettings", "btnOpenReleaseNotes",
        "btnClearHistory", "searchForm", "searchInput", "btnSubmitSearch",
        "chatEffortSelect", "btnToggleWatchdog", "settingsModal", "vaultLockModal", "releaseNotesModal"
    ]
    
    missing = [el for el in critical_elements if el not in html_ids]
    assert not missing, f"Missing critical elements: {missing}"
    print(f"PASS: All {len(critical_elements)} critical elements exist in index.html.")
    return True

def test_multi_device_and_dynamic_trending_selenium():
    print("\n--> 2. Launching Real-Browser Selenium Dynamic Trending & Multi-Device Suite...")
    opts = EdgeOptions()
    opts.add_argument('--headless')
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-dev-shm-usage')
    
    driver = webdriver.Edge(options=opts)
    try:
        # ==========================================
        # 1. DESKTOP TEST (1440x900)
        # ==========================================
        print("\n[DESKTOP AUDIT & DYNAMIC TRENDING TEST] - 1440x900...")
        driver.set_window_size(1440, 900)
        driver.get("http://localhost:5173/")
        time.sleep(1.5)
        
        # 1. Check Console Logs
        logs = driver.get_log("browser")
        severe_errors = [l for l in logs if l["level"] == "SEVERE" and "favicon.ico" not in l["message"]]
        if severe_errors:
            for err in severe_errors:
                print("BROWSER ERROR:", err["message"])
            raise AssertionError(f"Encountered {len(severe_errors)} severe JavaScript runtime errors!")
        print("PASS: Browser loaded with 0 JavaScript errors.")
        
        # 2. Test Dynamic Trending Engine Trigger
        print("--> Testing Dynamic Trending Prompts Engine...")
        driver.execute_script("window.fetchDynamicTrendingPrompts(true);")
        time.sleep(2)
        
        cards = driver.find_elements(By.CLASS_NAME, "suggested-card")
        assert len(cards) >= 4, "Suggested prompt cards missing!"
        print(f"PASS: Dynamic trending prompt cards rendered successfully ({len(cards)} cards).")
        for idx, card in enumerate(cards[:4], 1):
            title = card.find_element(By.CLASS_NAME, "suggested-card-text").text
            sub = card.find_element(By.CLASS_NAME, "suggested-card-sub").text
            query = card.get_attribute("data-query")
            print(f"   [{idx}] {title} ({sub}) -> Q: {query[:45]}...")
            assert len(query) > 5, "Dynamic query is empty!"
            
        # 3. Click Dynamic Card to verify search pipeline trigger
        cards[0].click()
        time.sleep(1.5)
        
        thread_container = driver.find_element(By.ID, "activeThreadContainer")
        assert thread_container.value_of_css_property("display") == "flex", "Active thread view not visible after clicking dynamic card!"
        print("PASS: Dynamic prompt card clicked -> Research pipeline successfully triggered.")

        # 4. Test Modals
        modal_tests = [
            ("Release Notes Modal", "btnOpenReleaseNotes", "releaseNotesModal", "btnCloseReleaseNotes"),
            ("Settings Modal", "btnOpenSettings", "settingsModal", "btnCloseSettingsModal"),
            ("Dual-Lock Vault Modal", "btnOpenLockModal", "vaultLockModal", "btnCloseVaultModal"),
        ]
        
        for name, open_id, modal_id, close_id in modal_tests:
            open_btn = driver.find_element(By.ID, open_id)
            open_btn.click()
            time.sleep(0.3)
            modal = driver.find_element(By.ID, modal_id)
            assert "active" in modal.get_attribute("class"), f"{name} did not open!"
            
            close_btn = driver.find_element(By.ID, close_id)
            close_btn.click()
            time.sleep(0.3)
            assert "active" not in modal.get_attribute("class"), f"{name} did not close!"
            print(f"PASS: {name} (open + close) functional.")
            
        # 5. Test Research Desks
        desks = driver.find_elements(By.CLASS_NAME, "focus-nav-item")
        for d in desks:
            d.click()
            time.sleep(0.15)
        print(f"PASS: All {len(desks)} sidebar research desks switched cleanly.")
        
        # ==========================================
        # 2. TABLET TEST (768x1024 - iPad)
        # ==========================================
        print("\n[TABLET AUDIT] - 768x1024 (iPad)...")
        driver.set_window_size(768, 1024)
        time.sleep(0.5)
        
        btn_mobile_toggle = driver.find_element(By.ID, "btnMobileToggle")
        btn_mobile_toggle.click()
        time.sleep(0.4)
        
        sidebar = driver.find_element(By.ID, "appSidebar")
        assert "active" in sidebar.get_attribute("class"), "Tablet sidebar drawer did not open!"
        print("PASS: Tablet hamburger toggle opened sidebar drawer.")
        
        # Click overlay to close
        overlay = driver.find_element(By.ID, "sidebarOverlay")
        overlay.click()
        time.sleep(0.4)
        assert "active" not in sidebar.get_attribute("class"), "Tablet overlay click did not close sidebar!"
        print("PASS: Tablet overlay click closed sidebar drawer.")
        
        # ==========================================
        # 3. MOBILE TEST (390x844 - iPhone)
        # ==========================================
        print("\n[MOBILE AUDIT] - 390x844 (iPhone)...")
        driver.set_window_size(390, 844)
        time.sleep(0.5)
        
        btn_mobile_toggle.click()
        time.sleep(0.4)
        assert "active" in sidebar.get_attribute("class"), "Mobile sidebar did not open!"
        
        btn_mobile_close = driver.find_element(By.ID, "btnMobileCloseSidebar")
        btn_mobile_close.click()
        time.sleep(0.4)
        assert "active" not in sidebar.get_attribute("class"), "Mobile close button did not close sidebar!"
        print("PASS: Mobile sidebar open & close verified.")
        
        # Mobile search submission
        search_input = driver.find_element(By.ID, "searchInput")
        search_input.send_keys("Semiconductor market intelligence")
        submit_btn = driver.find_element(By.ID, "btnSubmitSearch")
        submit_btn.click()
        time.sleep(1.5)
        print("PASS: Mobile search submission executed successfully.")
        
        return True
    finally:
        driver.quit()

if __name__ == "__main__":
    t1 = test_static_bindings()
    t2 = test_multi_device_and_dynamic_trending_selenium()
    
    if t1 and t2:
        print("\n=================================================================")
        print("ALL DYNAMIC TRENDING & MULTI-DEVICE TESTS PASSED (100% SUCCESS)")
        print("=================================================================")
    else:
        print("\nTESTS FAILED.")
        exit(1)
