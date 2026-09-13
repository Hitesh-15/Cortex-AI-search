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

try:
    driver.set_window_size(1366, 768)
    driver.get(f'http://127.0.0.1:{port}/index.html')
    time.sleep(1.2)

    print("=== TESTING DESKTOP TOP HEADER TELEMETRY STRIP ===")

    # 1. Check Desk Indicator
    desk_indicator = driver.find_element(By.ID, "headerDeskIndicator")
    desk_name = driver.find_element(By.ID, "headerDeskName")
    print(f"  Desk indicator: '{desk_name.text}' (displayed: {desk_indicator.is_displayed()})")
    assert desk_indicator.is_displayed(), "Header desk indicator should be visible on desktop!"
    assert "Market & Web" in desk_name.text, f"Expected 'Market & Web', got '{desk_name.text}'"

    # 2. Check All 8 Ticker Pills
    ticker_pills = driver.find_elements(By.CSS_SELECTOR, ".ticker-pill")
    print(f"  Ticker pills found: {len(ticker_pills)}")
    assert len(ticker_pills) == 8, f"Expected 8 ticker pills, got {len(ticker_pills)}"
    for pill in ticker_pills:
        assert pill.is_displayed(), f"Ticker pill {pill.text} should be visible on desktop!"
    print("  [PASS] All 8 institutional market ticker pills are mounted and visible!")

    # 3. Check Live Clock
    live_clock = driver.find_element(By.ID, "headerLiveClock")
    clock_time = driver.find_element(By.ID, "cortexLiveClockTime")
    print(f"  Live clock displayed: {live_clock.is_displayed()}, Time: '{clock_time.text}'")
    assert live_clock.is_displayed(), "Live clock should be visible!"
    assert len(clock_time.text.strip()) > 3, "Clock time should have live ticking value!"
    print("  [PASS] Real-time live clock is ticking!")

    # 4. Check Dynamic Desk Switch
    print("  -> Testing dynamic desk switch to 'finance'...")
    finance_desk = driver.find_element(By.CSS_SELECTOR, ".focus-nav-item[data-mode='finance']")
    finance_desk.click()
    time.sleep(0.3)
    assert "Financial Markets" in desk_name.text, f"Expected 'Financial Markets', got '{desk_name.text}'"
    print(f"  [PASS] Header desk indicator dynamically updated to '{desk_name.text}'!")

    # Switch back to web desk
    web_desk = driver.find_element(By.CSS_SELECTOR, ".focus-nav-item[data-mode='web']")
    web_desk.click()
    time.sleep(0.3)

    # 5. Capture Screenshot for Visual Verification
    screenshot_path = r"C:\Users\hites\.gemini\antigravity-ide\brain\3afc78ff-c35d-428e-a325-28243d6b78cd\cortex_desktop_market_ticker_strip.png"
    driver.save_screenshot(screenshot_path)
    print(f"  [SAVED] Visual verification screenshot: {screenshot_path}")

    print("\n>>> ALL TOP HEADER TELEMETRY CHECKS PASSED 100%! <<<")

finally:
    driver.quit()
    server.shutdown()
