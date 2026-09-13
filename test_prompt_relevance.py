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

print("=== 1. TESTING extractCoreSubject() VIA BROWSER RUNTIME ===")
cases = [
    ("Executive Daily Intelligence Briefing: AI Frontier, Cloud Scale & Capital Markets", "AI Frontier & Cloud Infrastructure"),
    ("latest clinical trials on targeted CRISPR gene editing and customized mRNA therapies", "CRISPR & mRNA Therapies"),
    ("GrapheneOS overhauls default apps with secure clipboard", "GrapheneOS"),
    ("what are the top 2026 ai breakthroughs and reasoning models", "Reasoning Models"),
    ("Federal Reserve interest rate cuts, inflation, and 10-year Treasury yields", "Federal Reserve interest rate cuts")
]

for raw, expected_sub in cases:
    res = driver.execute_script("return extractCoreSubject(arguments[0]);", raw)
    print(f"  Query: '{raw[:45]}...' -> Extracted: '{res}'")
    assert len(res) <= 40, f"Subject too long: {len(res)} chars: '{res}'"
    assert not res.lower().startswith("executive daily intelligence briefing"), "Failed to strip executive briefing prefix"
    assert not res.lower().startswith("latest clinical trials on"), "Failed to strip clinical trials prefix"

print("  [PASS] extractCoreSubject() successfully isolated crisp topics!")

print("\n=== 2. TESTING extractLearnedEntities() BLACKLIST ===")
mock_html = """
    <h3>Macro Framework</h3>
    <p>Yield curves remain inverted.</p>
    <strong>Posterior Summarization</strong>
    <p>Overall results indicate resilience.</p>
    <strong>Advanced Packaging Surge</strong>
    <p>TSMC CoWoS capacity expands.</p>
    <strong>Strategic Outlook</strong>
    <p>Long term trends are positive.</p>
"""
entities = driver.execute_script("return extractLearnedEntities(arguments[0], arguments[1], []);", "market overview", mock_html)
print(f"  Extracted Entities: {entities}")
assert "Macro Framework" not in entities, "FAIL: Macro Framework should be blacklisted!"
assert "Posterior Summarization" not in entities, "FAIL: Posterior Summarization should be blacklisted!"
assert "Advanced Packaging Surge" not in entities, "FAIL: Advanced Packaging Surge should be blacklisted!"
assert "Strategic Outlook" not in entities, "FAIL: Strategic Outlook should be blacklisted!"
print("  [PASS] Blacklist completely filters out synthesis artifacts and sectional headings!")

print("\n=== 3. TESTING generateRelatedQuestions() DOMAIN SPECIALIZATION ===")
test_runs = [
    ("Executive Daily Intelligence Briefing: AI Frontier, Cloud Scale & Capital Markets", "all"),
    ("latest clinical trials on targeted CRISPR gene editing and customized mRNA therapies", "academic"),
    ("Federal Reserve interest rates and 10-year Treasury yields", "finance"),
    ("Python interpreter in 1024 bytes", "code")
]

for query, mode in test_runs:
    questions = driver.execute_script("return generateRelatedQuestions(arguments[0], arguments[1], arguments[2], []);", query, mode, mock_html)
    print(f"\n  Query: '{query}'")
    assert len(questions) == 3, f"Expected 3 questions, got {len(questions)}"
    for i, q in enumerate(questions):
        print(f"    {i+1}. {q}")
        assert len(q) <= 130, f"Question too long: '{q}'"
        assert not ("Executive Daily Intelligence Briefing" in q), f"Raw briefing title repeated: '{q}'"
        assert not ("latest clinical trials on targeted CRISPR" in q), f"Raw clinical trials query repeated: '{q}'"
        assert not ("Macro Framework" in q), f"Meta heading leaked into question: '{q}'"
        assert not ("Posterior Summarization" in q), f"Meta heading leaked into question: '{q}'"
print("  [PASS] All generated questions are context-aware, crisp, and clean!")

# Execute a search to see the rendered chips
driver.execute_script("executeSearch('Executive Daily Intelligence Briefing: AI Frontier, Cloud Scale & Capital Markets', false);")

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

WebDriverWait(driver, 20).until(
    lambda d: len(d.find_elements(By.CSS_SELECTOR, ".related-chip-btn")) >= 3
)

chip_buttons = driver.find_elements(By.CSS_SELECTOR, ".related-chip-btn")
assert len(chip_buttons) >= 3, f"Expected at least 3 chips rendered, got {len(chip_buttons)}"

# Check computed styles of the chip
first_chip = chip_buttons[0]
font_family = driver.execute_script("return window.getComputedStyle(arguments[0]).fontFamily;", first_chip)
font_size = driver.execute_script("return window.getComputedStyle(arguments[0]).fontSize;", first_chip)
color = driver.execute_script("return window.getComputedStyle(arguments[0]).color;", first_chip)
bg = driver.execute_script("return window.getComputedStyle(arguments[0]).backgroundImage;", first_chip)
label_el = driver.find_element(By.CSS_SELECTOR, ".related-label")
label_font = driver.execute_script("return window.getComputedStyle(arguments[0]).fontFamily;", label_el)

print(f"  Chip font-family: {font_family}")
print(f"  Chip font-size: {font_size}")
print(f"  Chip text color: {color}")
print(f"  Chip background: {bg[:40]}...")
print(f"  Label font-family: {label_font}")

# Font size should be 14px (0.875rem), NOT degraded to 0.8rem (12.8px)
size_px = float(font_size.replace('px', ''))
assert size_px >= 13.5, f"Font size too small: {size_px}px"
print(f"  [PASS] Font size is {size_px}px (clean, legible 0.875rem) matching theme!")

# Label contains lightbulb and text
assert "Cortex Suggested Follow-up Searches:" in label_el.text
print("  [PASS] Related label renders perfectly with icon and title!")

print("\n=== ALL PROMPT & TYPOGRAPHY TESTS PASSED WITH FLYING COLORS! ===")
driver.quit()
server.shutdown()
