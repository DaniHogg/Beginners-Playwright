import pytest
from playwright.sync_api import expect


class TestGuildWars2WikiForms:
    def test_wiki_search_form(self, page):
        page.goto('https://wiki.guildwars2.com/')

        # Locate search form
        search_form = page.locator('form')
        expect(search_form).to_be_visible()

    def test_wiki_edit_form_visibility(self, page):
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Check for wiki edit/view options
        expect(page).to_have_title(/Guild Wars/)
        expect(page.get_by_text('Main')).to_be_visible()

    def test_wiki_category_filtering(self, page):
        page.goto('https://wiki.guildwars2.com/wiki/Category:Items')

        # Check category page loads
        expect(page).to_have_title(/Guild Wars/)

    def test_wiki_link_navigation(self, page):
        page.goto('https://wiki.guildwars2.com/')

        # Check that links are interactive
        links = page.locator('a')
        expect(links).to_have_count(lambda count: count > 0)