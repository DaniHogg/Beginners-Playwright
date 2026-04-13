#!/bin/bash
# Activate the Playwright venv
source /home/danie/workspace/Playwright/venv/bin/activate
echo "Activated Playwright venv"
echo "Python path: $(which python)"
python -c "import playwright.sync_api; print('Playwright import successful')"