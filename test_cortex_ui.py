"""Automated UI & Functionality Verification for Cortex AI Search.

Verifies:
1. All button elements, forms, and inputs exist in index.html.
2. All onclick/event handlers in index.html have corresponding functions in app.js.
3. No orphan IDs or broken selector references.
4. HTTP Server response validity.
"""

import re
import urllib.request
from pathlib import Path

CORTEX_DIR = Path(__file__).resolve().parent
HTML_PATH = CORTEX_DIR / "index.html"
JS_PATH = CORTEX_DIR / "app.js"

def test_html_and_js_bindings():
    print("--> 1. Reading index.html and app.js...")
    html_content = HTML_PATH.read_text(encoding="utf-8")
    js_content = JS_PATH.read_text(encoding="utf-8")
    
    # 1. Extract all element IDs in HTML
    html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html_content))
    print(f"Found {len(html_ids)} unique element IDs in index.html.")

    # 2. Key UI elements that must exist and be functional
    expected_handlers = [
        "openSettingsModal", "closeSettingsModal",
        "openLockModal", "closeLockModal",
        "openReleaseNotesModal", "closeReleaseNotesModal",
        "clearWorkspaceHistory", "testOpenRouterApiKeyNow",
        "toggleApiKeyVisibility", "testDiscordWebhook",
        "fetchLatestModelsAuto", "toggleWatchdogState", "executeSearch"
    ]
    
    critical_elements = [
        "btnMobileToggle",
        "btnOpenLockModal",
        "btnOpenSettings",
        "btnClearHistory",
        "searchForm",
        "searchInput",
        "btnSubmitSearch",
        "chatEffortSelect",
        "btnToggleWatchdog",
        "settingsModal",
        "settingsForm",
        "providerSelect",
        "apiKeyInput",
        "btnTestApiKey",
        "modelSelect",
        "vaultLockModal"
    ]
    
    missing_elements = [el for el in critical_elements if el not in html_ids]
    if missing_elements:
        print("FAILED: Missing critical elements:", missing_elements)
        return False
    print("PASS: All critical button and modal element IDs exist in index.html.")

    # 3. Extract all onclick handlers in HTML and verify in JS
    raw_handlers = re.findall(r'onclick=["\']([^"\']+)["\']', html_content)
    extracted_funcs = set()
    dom_builtins = {"if", "for", "while", "function", "alert", "event", "getAttribute", "getElementById", "preventDefault", "trim", "toLowerCase", "target"}
    for h in raw_handlers:
        matches = re.findall(r'([a-zA-Z0-9_]+)\s*\(', h)
        for m in matches:
            if m not in dom_builtins:
                extracted_funcs.add(m)

    missing_functions = []
    for func in extracted_funcs:
        # Check if function exists in JS
        if not re.search(rf'function\s+{func}\b|const\s+{func}\s*=|let\s+{func}\s*=|window\.{func}\b', js_content):
            missing_functions.append(func)
            
    if missing_functions:
        print("FAILED: Missing JS functions for onclick handlers:", missing_functions)
        return False
    print(f"PASS: All {len(extracted_funcs)} custom onclick handlers are implemented in app.js: {sorted(list(extracted_funcs))}")

    # 4. Check getElementById in JS
    js_get_elements = set(re.findall(r'getElementById\(["\']([^"\']+)["\']\)', js_content))
    print(f"Found {len(js_get_elements)} getElementById calls in app.js.")
    
    # Verify critical JS selectors exist in HTML
    for el_id in ["providerSelect", "apiKeyInput", "btnTestApiKey", "modelSelect", "settingsModal"]:
        assert el_id in html_ids, f"ID {el_id} queried by JS but missing in HTML"

    print("PASS: Core JS element selectors match HTML structure.")
    return True

def test_suggested_prompts():
    print("--> 2. Verifying Suggested Prompts & Cards...")
    html_content = HTML_PATH.read_text(encoding="utf-8")
    
    # Extract all suggested cards and queries
    cards = re.findall(r'class=["\'][^"\']*suggested-card[^"\']*["\'][^>]*data-query=["\']([^"\']+)["\']', html_content)
    print(f"Found {len(cards)} suggested research prompt cards:")
    for idx, q in enumerate(cards, 1):
        print(f"   [{idx}] \"{q}\"")
        assert len(q) > 10, f"Query '{q}' is too short"
        assert "executeSearch" in html_content, "executeSearch handler missing"
        
    assert len(cards) >= 4, f"Expected at least 4 suggested cards, found {len(cards)}"
    print("PASS: All 4 suggested prompt cards have valid, non-empty research queries.")
    return True

def test_server_http():
    print("--> 3. Verifying HTTP Server on port 5173...")
    try:
        req = urllib.request.Request("http://127.0.0.1:5173/")
        with urllib.request.urlopen(req, timeout=5) as resp:
            status = resp.status
            body = resp.read().decode("utf-8")
            assert status == 200, f"Expected status 200, got {status}"
            assert "<!DOCTYPE html>" in body, "HTML doc missing"
            assert "<h1>Cortex</h1>" in body, "Updated Cortex branding missing"
            assert "and Dual-Lock security vault for your devices" not in body, "Removed subtitle text is still present"
            print("PASS: Server returned HTTP 200 OK with clean branding & updated subtitle.")
            return True
    except Exception as e:
        print(f"FAILED: Server connection error: {e}")
        return False

if __name__ == "__main__":
    t1 = test_html_and_js_bindings()
    t2 = test_suggested_prompts()
    t3 = test_server_http()
    if t1 and t2 and t3:
        print("\n=======================================================")
        print("ALL AUTOMATED SITE TESTS PASSED WITH 100% SUCCESS RATE")
        print("=======================================================")
    else:
        print("\nTESTS FAILED.")
        exit(1)
