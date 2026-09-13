import socketserver, http.server, threading, time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='.', **kwargs)

server = socketserver.TCPServer(('127.0.0.1', 0), Handler)
port = server.server_address[1]
t = threading.Thread(target=server.serve_forever, daemon=True)
t.start()

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--no-sandbox')
driver = webdriver.Chrome(options=opts)
driver.set_window_size(1440, 900)

try:
    driver.get(f'http://127.0.0.1:{port}/index.html')
    time.sleep(1.0)

    query = "Draft an executive board meeting slide outline covering key KPIs, runway, unit economics, and roadmap"
    print(f"\nExecuting query via executeSearch(): '{query}'")
    
    # Trigger search via executeSearch
    driver.execute_script("executeSearch(arguments[0], false);", query)

    # Wait for search and synthesis to finish
    WebDriverWait(driver, 25).until(
        lambda d: len(d.find_elements(By.CSS_SELECTOR, ".ai-answer-box")) > 0 and
        len(d.find_elements(By.CSS_SELECTOR, ".ai-answer-box")[-1].text.strip()) > 50 and
        "Synthesizing" not in d.find_elements(By.CSS_SELECTOR, ".ai-answer-box")[-1].text
    )

    latest_answer_box = driver.find_elements(By.CSS_SELECTOR, ".ai-answer-box")[-1]
    result_text = latest_answer_box.text
    result_html = latest_answer_box.get_attribute("innerHTML")
    print(f"Synthesis complete! Answer length: {len(result_text)} chars.")
    print("--- ANSWER PREVIEW ---")
    print(result_text[:400].encode('ascii', errors='replace').decode('ascii'))
    print("----------------------")

    # 1. Assert sports drama / film / Kevin Costner / 2014 are NOT present
    forbidden_phrases = [
        "sports drama",
        "drama film",
        "Kevin Costner",
        "Ivan Reitman",
        "Jennifer Garner",
        "Chadwick Boseman",
        "Summit Entertainment",
        "Lionsgate",
        "premiered in Los Angeles on April 7, 2014",
        "2014 American sports drama"
    ]
    for phrase in forbidden_phrases:
        assert phrase.lower() not in result_text.lower(), f"CRITICAL FAILURE: Forbidden phrase found in output: '{phrase}'"
    print("[PASS] Verified: Zero sports drama, 2014, or Hollywood film content in output!")

    # 2. Assert required executive deck outline sections and 2026 telemetry are present
    required_sections = [
        "Executive Board Meeting Presentation Deck Outline",
        "SLIDE 1",
        "SLIDE 2",
        "SLIDE 3",
        "SLIDE 4",
        "SLIDE 5",
        "SLIDE 6",
        "Executive Summary",
        "Core Operating KPIs",
        "Capital Runway",
        "Unit Economics",
        "Product & Engineering",
        "Board Decisions",
        "2026",
        "Runway",
        "Unit Economics"
    ]
    for sec in required_sections:
        assert sec.lower() in result_text.lower(), f"CRITICAL FAILURE: Missing expected section or metric: '{sec}'"
    print("[PASS] Verified: All 6 board meeting slides and key C-suite metrics present!")

    screenshot_path = r"C:\Users\hites\.gemini\antigravity-ide\brain\3afc78ff-c35d-428e-a325-28243d6b78cd\board_meeting_deck_verified.png"
    driver.save_screenshot(screenshot_path)
    print(f"[SUCCESS] Verification screenshot saved to: {screenshot_path}")

finally:
    driver.quit()
    server.shutdown()
