import pytest
from playwright.sync_api import expect


class TestGuildWars2Wiki:
    def test_should_display_the_main_heading(self, page):
        # Navigate to the site
        page.goto('https://wiki.guildwars2.com/')

        # Find the heading
        heading = page.get_by_text('Guild Wars')
        expect(heading).to_be_visible()

    def test_should_have_wiki_navigation(self, page):
        page.goto('https://wiki.guildwars2.com/')

        # Find wiki navigation elements
        nav = page.locator('nav')
        expect(nav).to_be_visible()

    def test_should_navigate_to_wiki_pages(self, page):
        page.goto('https://wiki.guildwars2.com/')

        # Navigate to a wiki page
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Wait for page to load and check URL changed
        page.wait_for_url('**/wiki/Main_Page')
        expect(page).to_have_url(/Main_Page/)

    def test_should_find_content_on_wiki(self, page):
        page.goto('https://wiki.guildwars2.com/')

        # Wiki should have content visible
        content = page.get_by_text('Guild Wars 2')
        expect(content).to_be_visible()

        # Verify we're on the wiki
        expect(page).to_have_url(/wiki.guildwars2.com/)