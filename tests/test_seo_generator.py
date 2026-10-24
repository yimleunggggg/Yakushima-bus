import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from build_seo import update_head

class SeoGeneratorTest(unittest.TestCase):
    def test_first_schema_insertion_is_stable_and_identifies_the_page(self):
        source = '<html><head><title>Old</title><meta name="description" content="old"></head></html>'
        page = {'ja': ['Page title', 'Page description'], 'modified': '2026-10-24'}
        first = update_head(source, '/trekking/', page)
        self.assertEqual(first, update_head(first, '/trekking/', page))
        self.assertIn('"url": "https://yakushimabus.com/trekking/"', first)
        self.assertEqual(first.count('"@context"'), 1)

if __name__ == '__main__':
    unittest.main()
