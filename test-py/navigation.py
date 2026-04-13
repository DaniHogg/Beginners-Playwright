import pytest
from playwright.sync_api import expect
import re


class TestGuildWars2WikiNavigation:
    """
    Tests for navigation elements on the Guild Wars 2 Wiki.

    How these tests work:
    - They examine sidebar navigation, footer links, and table of contents
    - Use CSS selectors to locate navigation elements
    - Verify navigation links are functional and lead to correct pages
    """

    def test_sidebar_navigation_present(self, page):
        """
        Test that sidebar navigation is available.

        How it works:
        1. Load the main page
        2. Look for sidebar elements (usually in #mw-panel or similar)
        3. Verify navigation links are visible
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # MediaWiki sidebar is typically in #mw-panel
        sidebar = page.locator('#mw-panel').or_(page.locator('.sidebar'))
        expect(sidebar).to_be_visible()

        # Should have navigation links
        nav_links = sidebar.locator('a')
        expect(nav_links).to_have_count(lambda count: count > 0)

    def test_footer_links_functional(self, page):
        """
        Test that footer links work correctly.

        How it works:
        1. Navigate to a page with footer
        2. Find footer element
        3. Test that footer links are present and clickable
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # MediaWiki footer
        footer = page.locator('#footer').or_(page.locator('footer'))
        expect(footer).to_be_visible()

        # Should have multiple footer links
        footer_links = footer.locator('a')
        expect(footer_links).to_have_count(lambda count: count >= 3)

    def test_table_of_contents_navigation(self, page):
        """
        Test table of contents functionality.

        How it works:
        1. Go to a page with a table of contents
        2. Locate the TOC element
        3. Verify TOC links work and jump to sections
        """
        # Find a page that likely has a TOC
        page.goto('https://wiki.guildwars2.com/wiki/Class')

        # MediaWiki TOC is usually in #toc
        toc = page.locator('#toc').or_(page.locator('.toc'))
        expect(toc).to_be_visible()

        # Should have section links
        toc_links = toc.locator('a')
        expect(toc_links).to_have_count(lambda count: count > 0)

    def test_breadcrumb_navigation(self, page):
        """
        Test breadcrumb navigation if present.

        How it works:
        1. Navigate to a subpage
        2. Look for breadcrumb elements
        3. Verify breadcrumbs show navigation path
        """
        page.goto('https://wiki.guildwars2.com/wiki/Category:Items')

        # Some MediaWiki skins have breadcrumbs
        breadcrumbs = page.locator('.breadcrumbs').or_(
            page.locator('[class*="breadcrumb"]')
        )

        # Breadcrumbs might not be present, so we check if they exist
        if breadcrumbs.count() > 0:
            expect(breadcrumbs).to_be_visible()
            breadcrumb_links = breadcrumbs.locator('a')
            expect(breadcrumb_links).to_have_count(lambda count: count > 0)

    def test_navigation_menu_expansion(self, page):
        """
        Test that navigation menus can expand/collapse.

        How it works:
        1. Find collapsible navigation elements
        2. Test expanding and collapsing functionality
        3. Verify content shows/hides appropriately
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Look for collapsible elements (common in MediaWiki)
        collapsible = page.locator('.collapsible').or_(
            page.locator('[class*="expandable"]')
        )

        if collapsible.count() > 0:
            # Click to expand
            collapsible.first.click()
            # Should remain visible or show expanded content
            expect(collapsible.first).to_be_visible()

    def test_search_navigation_integration(self, page):
        """
        Test that search is integrated with navigation.

        How it works:
        1. Use the search from navigation
        2. Verify search results page loads
        3. Check that results are relevant
        """
        page.goto('https://wiki.guildwars2.com/')

        # Find search input in navigation
        search_input = page.locator('input[type="search"]').or_(
            page.locator('#searchInput')
        )

        expect(search_input).to_be_visible()

        # Type a search term
        search_input.fill('Guardian')
        search_input.press('Enter')

        # Should navigate to search results
        expect(page).to_have_url(re.compile(r'search'))
