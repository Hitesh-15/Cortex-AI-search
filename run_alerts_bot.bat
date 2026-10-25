@echo off
title Cortex 24/7 Google Alerts Bot
echo ======================================================================
echo   CORTEX 24/7 AUTONOMOUS ALERTS BOT (Google Alerts Style)
echo ======================================================================
echo Loading topics and interval from alerts_config.json...
echo Running research across monitored topics and dispatching to Discord.
echo.
echo Press Ctrl+C in this terminal at any time to terminate the daemon.
echo ======================================================================
echo.
python cortex_bot.py --config alerts_config.json --daemon
pause
