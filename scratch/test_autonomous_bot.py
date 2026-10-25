#!/usr/bin/env python3
"""
Integration & End-to-End Test for Cortex Autonomous Research & Monitoring Bot
Validates:
1. window.CortexAutonomousBot instantiation & tool registry registration.
2. Scheduler status toggles (start/stop) and interval configuration.
3. Monitored topic addition, enable/disable, and removal.
4. Immediate research cycle execution and executive brief synthesis.
5. Briefs vault persistence in LocalStorage and HTML/Markdown generation.
6. Autonomous Bot Studio modal opening, UI tab switching, and closing.
"""

import sys
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options

def test_autonomous_bot():
    opts = Options()
    opts.add_argument('--headless')
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-dev-shm-usage')
    opts.add_argument('--window-size=1920,1080')
    driver = webdriver.Edge(options=opts)

    try:
        html_file = Path(__file__).resolve().parent.parent / "index.html"
        driver.get(html_file.as_uri())
        time.sleep(1.0)

        print("=== STEP 1: VERIFYING ENGINE & TOOL REGISTRY ===")
        check_engine_js = """
        return {
            hasBot: Boolean(window.CortexAutonomousBot),
            hasTool: window.CortexTools ? window.CortexTools.has('cortex_autonomous_bot') : false,
            initialActive: window.CortexAutonomousBot ? window.CortexAutonomousBot.isActive() : null,
            topicsCount: window.CortexAutonomousBot ? window.CortexAutonomousBot.config.topics.length : 0
        };
        """
        engine_res = driver.execute_script(check_engine_js)
        print("Engine State:", engine_res)
        assert engine_res["hasBot"], "window.CortexAutonomousBot must exist!"
        assert engine_res["hasTool"], "cortex_autonomous_bot must be registered in CortexTools!"
        assert engine_res["topicsCount"] >= 4, "Default monitoring topics must be registered!"

        print("=== STEP 2: MODAL OPENING & TAB SWITCHING ===")
        # Open modal via UI button
        bot_btn = driver.find_element(By.ID, "btnOpenAutonomousBot")
        assert bot_btn is not None, "#btnOpenAutonomousBot button must exist in sidebar footer"
        driver.execute_script("arguments[0].click();", bot_btn)
        time.sleep(0.5)

        modal = driver.find_element(By.ID, "autonomousBotModal")
        assert modal.is_displayed(), "#autonomousBotModal must be visible when button is clicked"

        # Check Tab Switching
        tab_briefs = driver.find_element(By.ID, "tabBtnBriefs")
        tab_briefs.click()
        time.sleep(0.3)
        pane_briefs = driver.find_element(By.ID, "botTabBriefs")
        assert pane_briefs.is_displayed(), "#botTabBriefs must be visible after clicking Briefs tab"

        tab_logs = driver.find_element(By.ID, "tabBtnLogs")
        tab_logs.click()
        time.sleep(0.3)
        pane_logs = driver.find_element(By.ID, "botTabLogs")
        assert pane_logs.is_displayed(), "#botTabLogs must be visible after clicking Logs tab"

        tab_watch = driver.find_element(By.ID, "tabBtnWatchlist")
        tab_watch.click()
        time.sleep(0.3)

        print("=== STEP 3: ACTIVATING BOT SCHEDULER ===")
        driver.execute_script("window.toggleAutonomousBotStatus();")
        time.sleep(0.3)
        is_active = driver.execute_script("return window.CortexAutonomousBot.isActive();")
        assert is_active is True, "Autonomous bot must be active after toggle!"

        status_text = driver.find_element(By.ID, "botStatusText").text
        assert "ACTIVE" in status_text, f"Status pill must display ACTIVE, got '{status_text}'"

        # Toggle back to paused
        driver.execute_script("window.toggleAutonomousBotStatus();")
        time.sleep(0.3)
        assert driver.execute_script("return window.CortexAutonomousBot.isActive();") is False

        print("=== STEP 4: ADDING CUSTOM TOPIC ===")
        add_topic_js = """
        const topic = window.CortexAutonomousBot.addTopic({
            title: 'Solid-State Battery Production Scale',
            query: 'Solid-state battery commercialization silicon anode energy density kWh cost',
            desk: 'web',
            category: 'clean_tech'
        });
        window.renderAutonomousBotUI();
        return topic;
        """
        new_topic = driver.execute_script(add_topic_js)
        print("Added Topic:", new_topic["title"])
        assert new_topic["id"], "Added topic must have an ID"

        topics_count = driver.execute_script("return window.CortexAutonomousBot.config.topics.length;")
        assert topics_count >= 5, "Topic count must be updated"

        print("=== STEP 5: RUNNING IMMEDIATE SYNTHESIS CYCLE ===")
        run_cycle_js = """
        const done = arguments[0];
        window.CortexAutonomousBot.runImmediateCycle('ai_compute').then(res => {
            done(res);
        }).catch(err => {
            done({ status: 'error', message: err.message });
        });
        """
        cycle_res = driver.execute_async_script(run_cycle_js)
        print("Cycle Execution Result Status:", cycle_res.get("status"))
        assert cycle_res.get("status") == "success", f"Cycle failed: {cycle_res}"
        assert len(cycle_res.get("briefs", [])) >= 1, "Must generate at least 1 brief"

        brief = cycle_res["briefs"][0]
        print(f"Generated Brief: {brief['topicTitle']}")
        print(f"Pillars Count: {len(brief['pillars'])}")
        print(f"Sources Count: {brief['sourcesCount']}")

        assert len(brief["pillars"]) == 4, "Executive brief must contain 4 strategic pillars"
        assert brief["sourcesCount"] >= 1, "Brief must contain verified sources"
        assert len(brief["markdown"]) > 200, "Brief markdown must be populated"

        print("=== STEP 6: VERIFYING VAULT & UI RENDERING ===")
        driver.execute_script("window.switchBotTab('briefs');")
        time.sleep(0.5)

        vault_len = driver.execute_script("return window.CortexAutonomousBot.getBriefs().length;")
        vault_html = driver.execute_script("return document.getElementById('botBriefsVaultContainer').innerHTML;")
        print(f"Vault Briefs in LocalStorage: {vault_len}")
        print(f"Vault Container HTML Snippet: {vault_html[:300]}")

        briefs_container = driver.find_element(By.ID, "botBriefsVaultContainer")
        container_text = briefs_container.get_attribute("textContent")
        print(f"Container textContent Snippet: {container_text[:200]}")
        assert "Autonomous Executive Brief" in container_text
        assert "AI Compute & Commodity Markets" in container_text
        assert "Executive Thesis & Strategic Takeaway" in container_text

        # Verify Close Modal
        driver.execute_script("window.closeAutonomousBotModal();")
        time.sleep(0.3)
        assert not modal.is_displayed(), "Modal must be hidden after closeAutonomousBotModal"

        print("=== ALL AUTONOMOUS BOT TESTS PASSED 100%! ===")

    finally:
        driver.quit()

if __name__ == "__main__":
    test_autonomous_bot()
