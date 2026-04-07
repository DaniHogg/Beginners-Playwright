import pytest
from playwright.sync_api import expect


class TestGuildWars2Wiki:
    def test_homepage_loads_correctly(self, page):
        page.goto('https://wiki.guildwars2.com/')
        expect(page).to_have_title(/Guild Wars/)
        expect(page.get_by_text('Guild Wars 2')).to_be_visible()

    def test_wiki_page_loads_correctly(self, page):
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')
        expect(page).to_have_title(/Guild Wars/)
        expect(page.get_by_text('Main')).to_be_visible()

    def test_nonexistent_page_handling(self, page):
        page.goto('https://wiki.guildwars2.com/wiki/NonexistentPage12345')
        expect(page.get_by_text('does not exist')).to_be_visible()