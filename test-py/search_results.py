import pytest
from playwright.sync_api import expect
import re


class TestGuildWars2WikiSearchResults:
    """
    Tests for search functionality and results on the Guild Wars 2 Wiki.

    How these tests work:
    - They perform actual searches using the wiki's search functionality
    - Verify search results are displayed correctly
    - Test different search scenarios and result types
    """

    def test_basic_search_returns_results(self, page):
        """
        Test that basic search returns relevant results.

        How it works:
        1. Navigate to search page or use search input
        2. Enter a search term
        3. Verify results are displayed
        4. Check that results contain the search term
        """
        page.goto('https://wiki.guildwars2.com/')

        # Find and use search input
        search_input = page.locator('#searchInput').or_(
            page.locator('input[name="search"]')
        )

        expect(search_input).to_be_visible()
        search_input.fill('Ranger')
        search_input.press('Enter')

        # Should show search results
        expect(page).to_have_url(re.compile(r'search'))
        expect(page.get_by_text('Ranger')).to_be_visible()

    def test_search_suggestions_appear(self, page):
        """
        Test that search suggestions appear as you type.

        How it works:
        1. Start typing in search box
        2. Wait for suggestions to appear
        3. Verify suggestions are relevant
        """
        page.goto('https://wiki.guildwars2.com/')

        search_input = page.locator('#searchInput').or_(
            page.locator('input[name="search"]')
        )

        expect(search_input).to_be_visible()
        search_input.fill('Guard')

        # Wait for suggestions (if they appear)
        page.wait_for_timeout(1000)  # Give time for suggestions to load

        # Check if suggestions exist (not all wikis have this)
        suggestions = page.locator('.suggestions').or_(
            page.locator('[class*="suggest"]')
        )

        # If suggestions exist, they should contain relevant text
        if suggestions.count() > 0:
            expect(suggestions).to_be_visible()
            expect(suggestions.get_by_text('Guard')).to_be_visible()

    def test_exact_page_search(self, page):
        """
        Test searching for an exact page title.

        How it works:
        1. Search for a known page title
        2. Verify the exact page appears in results
        3. Check that direct link to page works
        """
        page.goto('https://wiki.guildwars2.com/wiki/Special:Search?search=Main+Page')

        # Should find the Main Page
        expect(page.get_by_text('Main Page')).to_be_visible()

        # Should have a direct link
        main_page_link = page.locator('a[href*="Main_Page"]')
        expect(main_page_link).to_be_visible()

    def test_no_results_message(self, page):
        """
        Test behavior when search returns no results.

        How it works:
        1. Search for a term that doesn't exist
        2. Verify appropriate "no results" message appears
        3. Check for suggestions or alternatives
        """
        page.goto('https://wiki.guildwars2.com/wiki/Special:Search?search=NonExistentTerm12345')

        # Should show no results message
        expect(page.get_by_text(re.compile(r'no results|nothing found|did not match', re.IGNORECASE))).to_be_visible()

    def test_category_search_functionality(self, page):
        """
        Test searching within categories.

        How it works:
        1. Go to category page
        2. Use category-specific search if available
        3. Verify category-filtered results
        """
        page.goto('https://wiki.guildwars2.com/wiki/Category:Items')

        # Some wikis have search within category
        category_search = page.locator('input[placeholder*="Search"]').or_(
            page.locator('.search-input')
        )

        if category_search.count() > 0:
            category_search.fill('sword')
            category_search.press('Enter')

            # Should show results related to items
            expect(page.get_by_text(re.compile(r'sword|weapon|item', re.IGNORECASE))).to_be_visible()

    def test_advanced_search_options(self, page):
        """
        Test advanced search features if available.

        How it works:
        1. Access advanced search page
        2. Test various search options
        3. Verify filtered results work
        """
        page.goto('https://wiki.guildwars2.com/wiki/Special:Search')

        # Look for advanced search options
        advanced_options = page.locator('.advanced-search').or_(
            page.locator('[class*="advanced"]')
        )

        if advanced_options.count() > 0:
            expect(advanced_options).to_be_visible()

            # Test namespace selection if present
            namespace_select = page.locator('select[name*="namespace"]')
            if namespace_select.count() > 0:
                expect(namespace_select).to_be_visible()

    def test_search_result_pagination(self, page):
        """
        Test pagination of search results.

        How it works:
        1. Perform a search that returns many results
        2. Check for pagination controls
        3. Test navigation between result pages
        """
        # Search for a common term that should return many results
        page.goto('https://wiki.guildwars2.com/wiki/Special:Search?search=the')

        # Look for pagination
        pagination = page.locator('.pagination').or_(
            page.locator('[class*="page"]')
        ).or_(
            page.locator('a[href*="offset"]')
        )

        # If pagination exists, test it
        if pagination.count() > 0:
            expect(pagination).to_be_visible()

            # Should have multiple pages or next/previous links
            page_links = pagination.locator('a')
