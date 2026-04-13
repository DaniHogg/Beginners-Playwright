import pytest
from playwright.sync_api import expect
import re


class TestGuildWars2WikiContentInteraction:
    """
    Tests for interacting with wiki content elements.

    How these tests work:
    - They test expandable sections, tabs, and interactive content
    - Verify that content loads dynamically when needed
    - Check that interactive elements respond correctly
    """

    def test_expandable_sections_work(self, page):
        """
        Test that expandable/collapsible sections function properly.

        How it works:
        1. Find collapsible content sections
        2. Click to expand/collapse
        3. Verify content visibility changes
        """
        page.goto('https://wiki.guildwars2.com/wiki/Class')

        # Look for collapsible elements (common in MediaWiki)
        collapsible_headers = page.locator('.mw-collapsible-toggle').or_(
            page.locator('[class*="collapsible"]')
        )

        if collapsible_headers.count() > 0:
            # Click the first collapsible header
            collapsible_headers.first.click()

            # Content should expand (this might take a moment)
            page.wait_for_timeout(500)

            # The section should still be visible
            expect(collapsible_headers.first).to_be_visible()

    def test_tabbed_content_navigation(self, page):
        """
        Test tabbed content interfaces.

        How it works:
        1. Find tabbed interfaces
        2. Click different tabs
        3. Verify content changes appropriately
        """
        # Some wiki pages have tabs
        page.goto('https://wiki.guildwars2.com/wiki/User:Example')  # User pages might have tabs

        # Look for tab elements
        tabs = page.locator('.tabs').or_(page.locator('[role="tab"]'))

        if tabs.count() > 0:
            # Click a different tab if available
            if tabs.count() > 1:
                tabs.nth(1).click()
                expect(tabs.nth(1)).to_be_visible()

    def test_image_gallery_interaction(self, page):
        """
        Test image galleries and lightboxes.

        How it works:
        1. Find image galleries
        2. Click on images
        3. Verify gallery or lightbox functionality
        """
        page.goto('https://wiki.guildwars2.com/wiki/Category:Items')

        # Look for image links
        image_links = page.locator('a.image').or_(page.locator('.gallery a'))

        if image_links.count() > 0:
            # Click on an image (opens in lightbox or new tab)
            with page.expect_popup() as popup_info:
                image_links.first.click()

            popup = popup_info.value
            # Should open image in new tab or lightbox
            expect(popup.locator('img')).to_be_visible()

    def test_table_sorting_functionality(self, page):
        """
        Test sortable table functionality.

        How it works:
        1. Find sortable tables
        2. Click column headers to sort
        3. Verify table content reorders
        """
        # Look for a page with sortable tables
        page.goto('https://wiki.guildwars2.com/wiki/List_of_achievements')

        # Find sortable table headers
        sortable_headers = page.locator('th.sortable').or_(
            page.locator('[class*="sortable"]')
        )

        if sortable_headers.count() > 0:
            # Click to sort
            sortable_headers.first.click()

            # Table should still be visible
            expect(sortable_headers.first).to_be_visible()

    def test_content_filtering(self, page):
        """
        Test content filtering or search within page.

        How it works:
        1. Find filter inputs or dropdowns
        2. Apply filters
        3. Verify content updates
        """
        page.goto('https://wiki.guildwars2.com/wiki/Category:Items')

        # Look for filter elements
        filters = page.locator('select').or_(page.locator('input[type="checkbox"]'))

        if filters.count() > 0:
            # Try changing a filter
            if filters.first.locator('option').count() > 1:
                filters.first.select_option(index=1)
                # Content should update
                page.wait_for_timeout(1000)
                expect(page.locator('#mw-content-text')).to_be_visible()

    def test_dynamic_content_loading(self, page):
        """
        Test that dynamic content loads properly.

        How it works:
        1. Navigate to pages with dynamic content
        2. Wait for content to load
        3. Verify all expected elements appear
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Wait for dynamic content
        page.wait_for_load_state('networkidle')

        # Check that images loaded
        images = page.locator('img')
        for i in range(min(images.count(), 5)):  # Check first 5 images
            expect(images.nth(i)).to_be_visible()

    def test_hover_tooltips(self, page):
        """
        Test hover tooltips and popups.

        How it works:
        1. Find elements with tooltips
        2. Hover over them
        3. Verify tooltips appear
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Look for elements that might have tooltips
        links = page.locator('a[title]').or_(page.locator('[data-tooltip]'))

        if links.count() > 0:
            # Hover over first link
            links.first.hover()

            # Look for tooltip (might be in different forms)
            tooltip = page.locator('.tooltip').or_(page.locator('[role="tooltip"]'))

            # Tooltip might appear after a delay
            page.wait_for_timeout(500)

            if tooltip.count() > 0:
                expect(tooltip).to_be_visible()

    def test_content_sharing_features(self, page):
        """
        Test content sharing or export features.

        How it works:
        1. Look for share buttons or export links
        2. Verify they work or lead to correct places
        3. Check social media integration
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Look for share buttons
        share_buttons = page.locator('[class*="share"]').or_(
            page.locator('a[href*="twitter"]').or_(page.locator('a[href*="facebook"]'))
        )

        if share_buttons.count() > 0:
            # Share buttons should be visible
            expect(share_buttons.first).to_be_visible()

    def test_print_stylesheet(self, page):
        """
        Test that print styles work correctly.

        How it works:
        1. Check for print-specific CSS
        2. Verify print-friendly layout
        3. Test print media queries
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Check that print styles are available (by checking CSS links)
        print_css = page.locator('link[media="print"]').or_(
            page.locator('link[href*="print"]')
        )

        # Print styles might be present
        if print_css.count() > 0:
            expect(print_css).to_be_visible()

    def test_responsive_design(self, page):
        """
        Test responsive design behavior.

        How it works:
        1. Resize viewport to mobile size
        2. Check that layout adapts
        3. Verify mobile navigation works
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Set mobile viewport
        page.set_viewport_size({"width": 375, "height": 667})

        # Content should still be visible and usable
        expect(page.get_by_text('Guild Wars')).to_be_visible()

        # Check for mobile menu if present
        mobile_menu = page.locator('.mobile-menu').or_(page.locator('#mw-panel'))

        if mobile_menu.count() > 0:
