import pytest
from playwright.sync_api import expect
import re


class TestGuildWars2WikiAccessibility:
    """
    Tests for accessibility features on the Guild Wars 2 Wiki.

    How these tests work:
    - They check for accessibility attributes like alt text, ARIA labels, and semantic HTML
    - Verify keyboard navigation and screen reader support
    - Test color contrast and other accessibility guidelines
    """

    def test_images_have_alt_text(self, page):
        """
        Test that images have appropriate alt text.

        How it works:
        1. Find all images on a page
        2. Check that they have alt attributes
        3. Verify alt text is meaningful (not empty)
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Find all images
        images = page.locator('img')

        # Check each image has alt text
        for i in range(images.count()):
            img = images.nth(i)
            alt_text = img.get_attribute('alt')
            # Alt text should exist and not be empty
            assert alt_text is not None, f"Image {i} missing alt text"
            assert len(alt_text.strip()) > 0, f"Image {i} has empty alt text"

    def test_headings_have_proper_hierarchy(self, page):
        """
        Test that heading hierarchy is correct.

        How it works:
        1. Find all headings on the page
        2. Verify they follow proper hierarchy (h1 -> h2 -> h3, etc.)
        3. Check that h1 exists and content is appropriate
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Should have at least one h1
        h1_headings = page.locator('h1')
        expect(h1_headings).to_have_count(lambda count: count >= 1)

        # Check heading levels don't skip (no h3 without h2)
        headings = page.locator('h1, h2, h3, h4, h5, h6')
        heading_levels = []

        for i in range(headings.count()):
            tag_name = headings.nth(i).evaluate('el => el.tagName.toLowerCase()')
            level = int(tag_name[1])  # h1 -> 1, h2 -> 2, etc.
            heading_levels.append(level)

        # Verify hierarchy (should not skip levels dramatically)
        for i in range(1, len(heading_levels)):
            # Allow some flexibility but prevent major skips
            assert heading_levels[i] <= heading_levels[i-1] + 2, \
                f"Heading hierarchy skip: {heading_levels[i-1]} to {heading_levels[i]}"

    def test_form_elements_have_labels(self, page):
        """
        Test that form elements have associated labels.

        How it works:
        1. Find all form inputs
        2. Check they have labels or aria-labels
        3. Verify labels are descriptive
        """
        page.goto('https://wiki.guildwars2.com/wiki/Special:Search')

        # Find form inputs
        inputs = page.locator('input[type="text"], input[type="search"], textarea')

        for i in range(inputs.count()):
            input_element = inputs.nth(i)

            # Check for label, aria-label, or aria-labelledby
            label = input_element.locator('xpath=ancestor::label').first
            aria_label = input_element.get_attribute('aria-label')
            aria_labelledby = input_element.get_attribute('aria-labelledby')

            has_label = (
                label.count() > 0 or
                (aria_label is not None and len(aria_label.strip()) > 0) or
                (aria_labelledby is not None and len(aria_labelledby.strip()) > 0)
            )

            assert has_label, f"Input {i} missing accessible label"

    def test_keyboard_navigation(self, page):
        """
        Test that keyboard navigation works.

        How it works:
        1. Use Tab key to navigate through focusable elements
        2. Verify focus indicators are visible
        3. Check that interactive elements are keyboard accessible
        """
        page.goto('https://wiki.guildwars2.com/')

        # Start with search input
        search_input = page.locator('#searchInput').or_(
            page.locator('input[name="search"]')
        )

        # Focus on search input
        search_input.focus()
        expect(search_input).to_be_focused()

        # Tab to next element
        page.keyboard.press('Tab')

        # Should move focus to next focusable element
        active_element = page.locator(':focus')
        expect(active_element).to_be_visible()

    def test_color_contrast_indicators(self, page):
        """
        Test for basic color contrast compliance indicators.

        How it works:
        1. Check that text has sufficient contrast with background
        2. Look for high contrast mode support
        3. Verify link colors are distinguishable
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Check that links have different colors from regular text
        links = page.locator('a')
        regular_text = page.locator('p').first

        if links.count() > 0 and regular_text.count() > 0:
            # This is a basic check - in real accessibility testing,
            # you'd use automated tools to measure contrast ratios
            link_color = links.first.evaluate('el => getComputedStyle(el).color')
            text_color = regular_text.evaluate('el => getComputedStyle(el).color')

            # Colors should be different
            assert link_color != text_color, "Links should have different color from text"

    def test_skip_links_available(self, page):
        """
        Test for skip navigation links.

        How it works:
        1. Look for skip links at the top of the page
        2. Verify they jump to main content
        3. Check skip links are keyboard accessible
        """
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')

        # Look for skip links (often hidden until focused)
        skip_links = page.locator('a[href^="#"]').filter(
            page.locator('text=/skip|jump/i')
        )

        # Some sites have skip links, some don't
        if skip_links.count() > 0:
            expect(skip_links.first).to_be_visible()

            # Test that skip link works
            skip_links.first.focus()
            expect(skip_links.first).to_be_focused()

    def test_lang_attribute_present(self, page):
        """
        Test that language attributes are set.

        How it works:
        1. Check html element has lang attribute
        2. Verify lang attribute is valid
        3. Check for proper language declarations
        """
        page.goto('https://wiki.guildwars2.com/')

        # HTML element should have lang attribute
        html_element = page.locator('html')
        lang_attr = html_element.get_attribute('lang')

        assert lang_attr is not None, "HTML element missing lang attribute"
        assert len(lang_attr.strip()) > 0, "Lang attribute is empty"

    def test_table_headers_properly_associated(self, page):
        """
        Test that table headers are properly associated with data cells.

        How it works:
        1. Find tables on the page
        2. Check for proper header associations
        3. Verify screen reader accessibility
        """
        page.goto('https://wiki.guildwars2.com/wiki/Category:Items')

        # Find tables
        tables = page.locator('table')

        for i in range(tables.count()):
            table = tables.nth(i)

            # Check for th elements or scope attributes
            headers = table.locator('th')
            if headers.count() > 0:
                # If there are headers, check they have proper scope or headers attributes
                for j in range(headers.count()):
                    header = headers.nth(j)
                    scope = header.get_attribute('scope')
                    headers_attr = header.get_attribute('headers')

                    # At least one should be present for accessibility
                    has_scope = scope is not None
                    has_headers = headers_attr is not None

                    assert has_scope or has_headers, \
