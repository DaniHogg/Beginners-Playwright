import pytest
from playwright.sync_api import expect
import re


class TestGuildWars2WikiMediaWikiFeatures:
    """
    Tests for MediaWiki-specific features on the Guild Wars 2 Wiki.

    How these tests work:
    - They target MediaWiki-specific elements like edit links, history tabs, and user contributions
    - Use CSS selectors and text matching to locate MediaWiki UI elements
    - Verify that core wiki functionality is accessible and working
    """

    def test_edit_links_available(self, page):
        """
        Test that edit links are present on wiki pages.

        How it works:
        1. Navigate to a content page
        2. Look for MediaWiki edit links (usually "Edit" or "Edit source")
        3. Verify at least one edit option is visible
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # MediaWiki pages typically have edit links
        edit_link = page.locator('a[href*="action=edit"]').or_(
            page.get_by_text('Edit')
        ).or_(
            page.get_by_text('Edit source')
        )

        expect(edit_link.first).to_be_visible()

    def test_view_history_available(self, page):
        """
        Test that page history is accessible.

        How it works:
        1. Go to a wiki page
        2. Look for history tab or link
        3. Verify history functionality is available
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # MediaWiki history links
        history_link = page.locator('a[href*="action=history"]').or_(
            page.get_by_text('History')
        ).or_(
            page.get_by_text('View history')
        )

        expect(history_link.first).to_be_visible()

    def test_recent_changes_accessible(self, page):
        """
        Test that recent changes page is accessible.

        How it works:
        1. Navigate to Special:RecentChanges
        2. Verify the page loads and shows recent edits
        3. Check for expected content structure
        """
        page.goto('https://wiki.guildwars2.com/wiki/Special:RecentChanges')

        expect(page).to_have_title(re.compile(r'Recent changes'))
        # Should show a list of recent edits
        expect(page.locator('table')).to_be_visible()

    def test_user_contributions_page(self, page):
        """
        Test that user contributions can be viewed.

        How it works:
        1. Access a user's contributions page
        2. Verify the page loads correctly
        3. Check for contribution history
        """
        # Use a known active user or generic user page
        page.goto('https://wiki.guildwars2.com/wiki/Special:Contributions')

        expect(page).to_have_title(re.compile(r'Contributions'))
        # Should have a form to enter username or show recent contributions
        expect(page.locator('form')).to_be_visible()

    def test_category_pages_functional(self, page):
        """
        Test that category pages work properly.

        How it works:
        1. Navigate to a category page
        2. Verify category content loads
        3. Check for subcategories and pages in category
        """
        page.goto('https://wiki.guildwars2.com/wiki/Category:Items')

        expect(page).to_have_title(re.compile(r'Category:Items'))
        # Should show items in this category
        expect(page.get_by_text('Items')).to_be_visible()

    def test_special_pages_accessible(self, page):
        """
        Test that Special pages are accessible.

        How it works:
        1. Try to access various Special pages
        2. Verify they load without errors
        3. Check for expected functionality
        """
        special_pages = [
            'Special:AllPages',
            'Special:Categories',
            'Special:Statistics'
        ]

        for special_page in special_pages:
            page.goto(f'https://wiki.guildwars2.com/wiki/{special_page}')
            expect(page).to_have_title(re.compile(special_page))
            # Should not show error messages
            expect(page.get_by_text('does not exist')).not_to_be_visible()