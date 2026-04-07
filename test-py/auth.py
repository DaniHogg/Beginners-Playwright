import pytest
from playwright.sync_api import expect


class TestGuildWars2WikiAccess:
    def test_wiki_homepage_accessible(self, page):
        page.goto('https://wiki.guildwars2.com/')

        # Should show wiki homepage
        expect(page).to_have_title(/Guild Wars/)
        expect(page.get_by_text('Guild Wars 2')).to_be_visible()

    def test_wiki_main_page_accessible(self, page):
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Should show main page content
        expect(page).to_have_title(/Guild Wars/)
        expect(page.get_by_text('Main')).to_be_visible()

    def test_wiki_multiple_regions_content(self, page):
        # Test accessing regional content
        page.goto('https://wiki.guildwars2.com/wiki/World')

        # Should show world information
        expect(page.get_by_text(/World|Map|Region/)).to_be_visible()

    def test_wiki_persistent_navigation(self, page):
        # Navigate and stay on wiki
        page.goto('https://wiki.guildwars2.com/')
        expect(page).to_have_url(/wiki.guildwars2.com/)