import pytest
from playwright.sync_api import expect
import time


class TestGuildWars2WikiPerformance:
    def test_page_loads_quickly(self, page):
        """
        Test that the Guild Wars 2 Wiki homepage loads within a reasonable time.
        
        How it works:
        1. Start a timer (start = time.time())
        2. Navigate to the page
        3. Stop the timer and calculate elapsed time
        4. Assert that load time is less than 5 seconds
        """
        start = time.time()
        page.goto('https://wiki.guildwars2.com/')
        load_time = time.time() - start
        
        # Verify the page actually loaded
        expect(page).to_have_title(/Guild Wars/)
        
        # Assert page loaded within 5 seconds
        assert load_time < 5, f"Page took {load_time:.2f}s to load, expected < 5s"

    def test_wiki_main_page_loads_quickly(self, page):
        """
        Test that the Wiki main page loads quickly.
        """
        start = time.time()
        page.goto('https://wiki.guildwars2.com/wiki/Main_Page')
        load_time = time.time() - start
        
        expect(page).to_have_title(/Guild Wars/)
        assert load_time < 5, f"Main page took {load_time:.2f}s to load, expected < 5s"

    def test_multiple_page_navigation_speed(self, page):
        """
        Test that navigating between multiple pages is performant.
        """
        pages_to_test = [
            'https://wiki.guildwars2.com/',
            'https://wiki.guildwars2.com/wiki/Main_Page',
            'https://wiki.guildwars2.com/wiki/Class',
        ]
        
        total_time = 0
        for url in pages_to_test:
            start = time.time()
            page.goto(url)
            load_time = time.time() - start
            total_time += load_time
            print(f"Loaded {url} in {load_time:.2f}s")
            
            # Each page should load in under 5 seconds
            assert load_time < 5, f"{url} took {load_time:.2f}s, expected < 5s"
        
        avg_time = total_time / len(pages_to_test)
        print(f"Average load time: {avg_time:.2f}s")
        
        # Average across all pages should be under 4 seconds
        assert avg_time < 4, f"Average load time {avg_time:.2f}s exceeds 4s"
