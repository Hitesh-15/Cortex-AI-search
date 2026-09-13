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
    # 1. Desktop Test (1366x768)
    driver.set_window_size(1366, 768)
    driver.get(f'http://127.0.0.1:{port}/index.html')
    time.sleep(1.0)

    sidebar_brand = driver.find_element(By.CSS_SELECTOR, ".brand-title-cortex")
    assert sidebar_brand.is_displayed(), "Sidebar brand should be visible on desktop!"

    header_badge = driver.find_element(By.CSS_SELECTOR, ".header-brand-badge")
    is_badge_displayed = header_badge.is_displayed()
    badge_display_prop = driver.execute_script("return window.getComputedStyle(arguments[0]).display;", header_badge)

    print(f"Desktop view (1366x768):")
    print(f"  Sidebar brand displayed: {sidebar_brand.is_displayed()}")
    print(f"  Header brand badge displayed: {is_badge_displayed} (CSS display: '{badge_display_prop}')")

    assert not is_badge_displayed, "FAIL: Header brand badge is redundant on desktop and should not be displayed!"
    print("  [PASS] Redundant header logo successfully hidden on desktop!")

    # Save screenshot of clean desktop view
    desktop_screenshot = r"C:\Users\hites\.gemini\antigravity-ide\brain\3afc78ff-c35d-428e-a325-28243d6b78cd\cortex_desktop_no_redundant_logo.png"
    driver.save_screenshot(desktop_screenshot)
    print(f"  [SAVED] Desktop screenshot: {desktop_screenshot}")

    # 2. Mobile Test (390x844)
    driver.set_window_size(390, 844)
    time.sleep(0.5)

    badge_mobile_display = driver.execute_script("return window.getComputedStyle(arguments[0]).display;", header_badge)
    print(f"\nMobile view (390x844):")
    print(f"  Header brand badge CSS display: '{badge_mobile_display}'")
    assert badge_mobile_display == "flex", f"FAIL: Header brand badge should be flex on mobile, got {badge_mobile_display}"
    print("  [PASS] Header brand badge correctly visible on mobile when sidebar is off-canvas!")

    print("\n>>> ALL BRAND REDUNDANCY CHECKS PASSED 100%! <<<")

finally:
    driver.quit()
    server.shutdown()
