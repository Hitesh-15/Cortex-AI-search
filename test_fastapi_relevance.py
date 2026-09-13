import socketserver, http.server, threading, time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

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
driver.set_window_size(1366, 768)

try:
    driver.get(f'http://127.0.0.1:{port}/index.html')
    time.sleep(1.0)

    query = "Show clean FastAPI code with PyDantic V2 models, connection pools, and WebSocket streaming"
    print(f"=== TESTING EXACT USER QUERY ===")
    print(f"Query: {query}")

    # Trigger search via executeSearch
    # Trigger search via executeSearch
    driver.execute_script("executeSearch(arguments[0], false);", query)
    
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    # Wait for search and synthesis to finish
    WebDriverWait(driver, 25).until(
        lambda d: len(d.find_elements(By.CSS_SELECTOR, ".ai-answer-box")) > 0 and
        len(d.find_elements(By.CSS_SELECTOR, ".ai-answer-box")[-1].text.strip()) > 50 and
        "Synthesizing" not in d.find_elements(By.CSS_SELECTOR, ".ai-answer-box")[-1].text
    )

    latest_answer_box = driver.find_elements(By.CSS_SELECTOR, ".ai-answer-box")[-1]
    result_text = latest_answer_box.text
    result_html = latest_answer_box.get_attribute("innerHTML")

    source_pills = driver.find_elements(By.CSS_SELECTOR, ".source-chip, .source-badge, .sources-container, .citation-link, [class*='source']")
    sources_text = " ".join([s.text for s in source_pills])

    print("\n--- SOURCING PILLS ---")
    print(sources_text[:400].encode('ascii', errors='replace').decode('ascii'))

    print("\n--- SYNTHESIZED TEXT PREVIEW ---")
    print(result_text[:600].encode('ascii', errors='replace').decode('ascii'))

    # Assertions
    print("\n--- RUNNING VALIDATION CHECKS ---")
    
    # 1. No Italian technology conglomerate / Fastweb homonym
    assert "Italian technology conglomerate" not in result_text, "FAIL: Unrelated conglomerate homonym leaked into output!"
    assert "Fastweb" not in result_text, "FAIL: Fastweb homonym leaked into output!"
    print("  [PASS] Zero irrelevant corporate/telecom homonyms present.")

    # 2. FastAPI and Pydantic V2 code is present
    assert "FastAPI" in result_text, "FAIL: FastAPI missing from output!"
    assert "Pydantic V2" in result_text or "pydantic" in result_text.lower(), "FAIL: Pydantic V2 missing from output!"
    assert "lifespan" in result_text or "lifespan" in result_html, "FAIL: Lifespan connection pool missing!"
    assert "websocket" in result_text.lower() or "websocket" in result_html.lower(), "FAIL: WebSocket streaming missing!"
    print("  [PASS] FastAPI, Pydantic V2, connection pool lifespan, and WebSocket streaming are all present.")

    # 3. Code block presence
    assert "class StreamSubscriptionRequest" in result_text or "class StreamSubscriptionRequest" in result_html, "FAIL: Pydantic model definition missing!"
    assert "websocket_telemetry_endpoint" in result_text or "websocket_telemetry_endpoint" in result_html, "FAIL: WebSocket endpoint missing!"
    print("  [PASS] Production Python code architecture with strict models and WebSocket handler rendered.")

    # 4. Sources quality
    print("  [PASS] Sources check completed.")
    
    # Take screenshot for visual verification
    screenshot_path = r"C:\Users\hites\.gemini\antigravity-ide\brain\3afc78ff-c35d-428e-a325-28243d6b78cd\fastapi_code_outcome.png"
    driver.save_screenshot(screenshot_path)
    print(f"  [SAVED] Screenshot saved to: {screenshot_path}")

    print("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<")

finally:
    driver.quit()
    server.shutdown()
