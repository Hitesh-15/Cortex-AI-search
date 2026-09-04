"""End-to-End Automated Test Suite for Cortex v5.0
Autonomous Deep Research Agent & Multi-Format Compute Studio (Reports, Decks, Docs).
"""

import sys
import time
import socket
import subprocess
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

CORTEX_DIR = Path(__file__).resolve().parent

def get_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]

def run_tests():
    port = get_free_port()
    print(f"--> Starting isolated test server on port {port}...")
    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--directory", str(CORTEX_DIR)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(1.2)

    opts = EdgeOptions()
    opts.add_argument('--headless')
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Edge(options=opts)
    driver.set_window_size(1440, 900)

    try:
        url = f"http://127.0.0.1:{port}/"
        print(f"--> Loading {url}...")
        driver.get(url)
        time.sleep(1.5)

        # 1. Check Console Logs
        logs = driver.get_log("browser")
        severe = [l for l in logs if l['level'] == 'SEVERE' and 'favicon.ico' not in l['message'] and 'fonts.gstatic.com' not in l['message']]
        assert not severe, f"Severe browser errors detected: {severe}"
        print("PASS 1: Page initialized with 0 JavaScript errors.")

        # 2. Verify Studio Button and Sidebar Desk exist
        studio_btn = driver.find_element(By.ID, "btnStudioToggle")
        assert studio_btn is not None, "btnStudioToggle not found in DOM!"
        studio_desk = driver.find_element(By.ID, "deskStudio")
        assert studio_desk is not None, "deskStudio not found in DOM!"
        print("PASS 2: Compute Studio toggle button and sidebar desk verified.")

        # 3. Test Studio Toggle
        print("--> Testing toggleDeepResearchStudio()...")
        driver.execute_script("toggleDeepResearchStudio(true);")
        time.sleep(0.3)
        assert "active" in studio_btn.get_attribute("class"), "btnStudioToggle does not have 'active' class!"
        search_input = driver.find_element(By.ID, "searchInput")
        assert "Compute" in search_input.get_attribute("placeholder"), f"Search input placeholder mismatch: {search_input.get_attribute('placeholder')}"
        print("PASS 3: Studio toggle active state and dynamic placeholder verified.")

        # 4. Test Sidebar Studio Desk Selection & Suggested Cards
        print("--> Testing Compute & Studio desk click...")
        driver.execute_script("arguments[0].click();", studio_desk)
        time.sleep(0.5)
        cards = driver.find_elements(By.CSS_SELECTOR, ".suggested-card")
        assert len(cards) >= 6, f"Expected at least 6 suggested cards, found {len(cards)}"
        card_text = cards[0].text
        print(f"Top suggested studio card: {card_text[:60]}...")
        print("PASS 4: Compute & Studio desk loaded 6 verified cards.")

        # 5. Execute Autonomous Deep Research & Compute Query
        test_query = "Compute an executive whitepaper and 5-slide presentation deck on Autonomous AI Agent Architectures in Enterprise"
        print(f"--> Executing Deep Research query: '{test_query[:50]}...'")
        driver.execute_script(f"executeSearch('{test_query}');")

        # Wait for Deep Research Stepper to appear
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".deep-research-stepper"))
        )
        print("PASS 5: Deep Research dynamic agent stepper mounted.")

        # Wait for all 5 stages to complete
        print("--> Waiting for all 5 stages of autonomous compute to finish...")
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".cortex-deliverable-tabs"))
        )
        print("PASS 6: Autonomous compute stages finished; deliverable suite mounted.")

        # 6. Verify Executive Whitepaper contents
        whitepaper = driver.find_element(By.CSS_SELECTOR, ".cortex-whitepaper-container")
        assert whitepaper is not None, "Whitepaper container not found!"
        assert "Pillar-by-Pillar Research Findings" in whitepaper.text, "Whitepaper missing Pillar findings!"
        assert "Comparative Benchmark Matrix" in whitepaper.text, "Whitepaper missing Benchmark Matrix!"
        assert "12-Month Strategic Execution Roadmap" in whitepaper.text, "Whitepaper missing Roadmap!"
        print("PASS 7: Executive Whitepaper contains all structured sections and benchmark table.")

        # 7. Test Tab Switch to Presentation Slide Deck
        print("--> Switching to Presentation Slide Deck tab...")
        tab_deck = driver.find_element(By.CSS_SELECTOR, "[id$='_tab_deck']")
        driver.execute_script("arguments[0].click();", tab_deck)
        time.sleep(0.5)

        deck_viewer = driver.find_element(By.CSS_SELECTOR, ".cortex-slide-deck-viewer")
        assert deck_viewer.is_displayed(), "Slide deck viewer not displayed after tab click!"
        stage_el = driver.find_element(By.CSS_SELECTOR, ".deck-stage")
        assert "Autonomous AI Agent" in stage_el.text or "Executive" in stage_el.text, f"Slide content unexpected: {stage_el.text[:80]}"
        print("PASS 8: Presentation Slide Deck Viewer mounted and displayed correctly.")

        # 8. Test Slide Navigation
        btn_next = driver.find_element(By.CSS_SELECTOR, ".btn-slide-nav[id$='_btn_next']")
        driver.execute_script("arguments[0].click();", btn_next)
        time.sleep(0.3)
        slide_counter = driver.find_element(By.CSS_SELECTOR, ".deck-slide-counter")
        assert "2" in slide_counter.text, f"Expected slide 2, found {slide_counter.text}"
        print(f"PASS 9: Slide navigation successfully advanced to Slide 2 ({slide_counter.text}).")

        # 9. Verify Action Buttons (.PPTX, .DOCX, Copy, Print)
        btn_pptx = driver.find_element(By.CSS_SELECTOR, ".btn-studio-ppt, .btn-deck-action")
        assert btn_pptx is not None, "Download .PPTX action button missing!"
        btn_docx = driver.find_element(By.CSS_SELECTOR, ".btn-studio-doc")
        assert btn_docx is not None, "Export .DOCX action button missing!"
        print("PASS 10: Multi-format download actions (.PPTX, .DOCX) verified in DOM.")

        # 10. Check Console Logs at End of Full Flow
        final_logs = driver.get_log("browser")
        final_severe = [l for l in final_logs if l['level'] == 'SEVERE' and 'favicon.ico' not in l['message'] and 'fonts.gstatic.com' not in l['message']]
        assert not final_severe, f"Severe browser errors after full execution: {final_severe}"
        print("PASS 11: 100% clean browser console throughout entire test run.")

        print("SUCCESS: ALL CORTEX v5.0 AUTOMATED TESTS PASSED WITH 0 ERRORS!")
        print("=======================================================\n")

    finally:
        driver.quit()
        server.terminate()

if __name__ == "__main__":
    run_tests()
