import pytest
from playwright.sync_api import expect


class TestGuildWars2WikiAdvanced:
    def test_wiki_search_functionality(self, page):
        page.goto('https://wiki.guildwars2.com/')

        # Check that search is available
        search_box = page.locator('input[placeholder*="Search"]')
        expect(search_box).to_be_visible()

    def test_multiple_wiki_pages_navigation(self, page):
        page.goto('https://wiki.guildwars2.com/wiki/Class')

        # Should display class information
        expect(page.get_by_text(/Guardian|Warrior|Ranger|Thief|Engineer|Necromancer|Mesmer|Elementalist|Revenant/)).to_be_visible()

    def test_wiki_categories_available(self, page):
        page.goto('https://wiki.guildwars2.com/wiki/Category:Game_types')

        # Should display category content
        expect(page).to_have_title(/Guild Wars/)

    def test_wiki_loot_table_accessibility(self, page):
        page.goto('https://wiki.guildwars2.com/wiki/Loot')

        # Check that loot information is visible
        expect(page.get_by_text(/Loot|Drop|Item/)).to_be_visible()

    def test_wiki_dynamic_content_loading(self, page):
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Should have dynamic wiki elements loaded
        expect(page).to_have_title(/Guild Wars/)