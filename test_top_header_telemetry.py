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

    # 1. Check Desk Indicator is Removed from Top Header
    desk_indicators = driver.find_elements(By.ID, "headerDeskIndicator")
    assert len(desk_indicators) == 0, "FAIL: headerDeskIndicator should be removed from top section!"
    print("  [PASS] 'Market & Web' badge removed from top section, leaving full space for tickers!")

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

    # 4. Check Vertical Spacing between Top Header and Hero
    top_header = driver.find_element(By.CSS_SELECTOR, ".top-header")
    hero_title = driver.find_element(By.ID, "heroTitle")
    header_bottom = driver.execute_script("return arguments[0].getBoundingClientRect().bottom;", top_header)
    hero_top = driver.execute_script("return arguments[0].getBoundingClientRect().top;", hero_title)
    gap = hero_top - header_bottom
    print(f"  Vertical gap between top header and hero title: {gap:.1f}px")
    assert gap < 90, f"Vertical gap too large ({gap:.1f}px), empty space is getting wasted!"
    print(f"  [PASS] Vertical spacing is compact and clean ({gap:.1f}px), no wasted empty space!")

    # 5. Capture Screenshot for Visual Verification
    screenshot_path = r"C:\Users\hites\.gemini\antigravity-ide\brain\3afc78ff-c35d-428e-a325-28243d6b78cd\cortex_compact_no_empty_space.png"
    driver.save_screenshot(screenshot_path)
    print(f"  [SAVED] Visual verification screenshot: {screenshot_path}")

    print("\n>>> ALL TOP HEADER TELEMETRY CHECKS PASSED 100%! <<<")

finally:
    driver.quit()
    server.shutdown()
