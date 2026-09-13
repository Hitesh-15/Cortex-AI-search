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
driver.get(f'http://127.0.0.1:{port}/index.html')
time.sleep(1.0)

print("=== TESTING ALL SIDEBAR DESKS, BUTTONS & ACTIONS ===")

desks = [
    ('finance', 'Financial Markets Intelligence', 'Corporate 10-K Disclosures'),
    ('academic', 'Academic & Frontier Research', 'Frontier arXiv Preprints'),
    ('code', 'Engineering & Code Solutions', 'Full-Stack Server Actions'),
    ('writing', 'Executive Strategy & Memos', 'Executive Research Briefing Memo'),
    ('web', 'Where knowledge begins', 'Global macro market intelligence')
]

for mode, exp_title, exp_card in desks:
    el = driver.find_element(By.XPATH, f"//div[contains(@class, 'focus-nav-item') and @data-mode='{mode}']")
    el.click()
    time.sleep(0.3)
    
    t_text = driver.find_element(By.ID, "heroTitle").text
    cards = driver.find_elements(By.CSS_SELECTOR, "#trendingCardsGrid .trending-card")
    first_title = cards[0].find_element(By.CLASS_NAME, "trending-card-title").text
    
    assert exp_title.lower() in t_text.lower(), f"Desk {mode}: expected title '{exp_title}', got '{t_text}'"
    assert exp_card.lower() in first_title.lower(), f"Desk {mode}: expected card '{exp_card}', got '{first_title}'"
    assert len(cards) == 4, f"Desk {mode}: expected 4 cards, got {len(cards)}"
    assert "active" in el.get_attribute("class"), f"Desk {mode}: should have active class"
    print(f"  [PASS] Desk '{mode}' successfully selected, title: '{t_text}', first card: '{first_title}'")

# Execute Search from Card
cards = driver.find_elements(By.CSS_SELECTOR, "#trendingCardsGrid .trending-card")
cards[0].click()
time.sleep(3.0)
assert driver.find_element(By.ID, "activeThreadContainer").is_displayed()
print("  [PASS] Card click successfully triggers search execution!")

# New Search Button
btn_new = driver.find_element(By.ID, "btnNewThread")
btn_new.click()
time.sleep(0.4)
assert driver.find_element(By.ID, "emptyHeroView").is_displayed()
print("  [PASS] '+ New Search' button returns to dashboard view!")

# Executive Daily Digest Button (at bottom left)
btn_digest = driver.find_element(By.ID, "btnGenerateMorningDigest")
btn_digest.click()
time.sleep(3.0)
assert driver.find_element(By.ID, "activeThreadContainer").is_displayed()
print("  [PASS] Executive Daily Digest button triggers 24h briefing!")

# Return to dashboard
btn_new.click()
time.sleep(0.4)

# Footer Modals
btn_lib = driver.find_element(By.ID, "btnOpenLibrary")
btn_lib.click()
time.sleep(0.4)
assert driver.find_element(By.ID, "libraryModal").is_displayed()
driver.execute_script("closeLibraryModal();")
time.sleep(0.3)
print("  [PASS] Library button opens library modal!")

btn_set = driver.find_element(By.ID, "btnOpenSettings")
btn_set.click()
time.sleep(0.4)
assert driver.find_element(By.ID, "settingsModal").is_displayed()
driver.execute_script("closeSettingsModal();")
time.sleep(0.3)
print("  [PASS] Settings button opens settings modal!")

driver.quit()
server.shutdown()
print("ALL SIDEBAR CHECKS PASSED 100%!")
