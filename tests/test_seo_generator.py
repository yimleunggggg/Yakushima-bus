import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from build_seo import update_head, sitemap

class SeoGeneratorTest(unittest.TestCase):
    def test_first_schema_insertion_is_stable_and_identifies_the_page(self):
        source = '<html><head><title>Old</title><meta name="description" content="old"></head></html>'
        page = {'ja': ['Page title', 'Page description'], 'modified': '2026-10-24'}
        first = update_head(source, '/trekking/', page)
        self.assertEqual(first, update_head(first, '/trekking/', page))
        self.assertIn('"url": "https://yakushimabus.com/trekking/"', first)
        self.assertEqual(first.count('"@context"'), 1)

    def test_homepage_language_cluster_has_no_duplicate_japanese_url(self):
        from xml.etree import ElementTree as ET
        ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'x': 'http://www.w3.org/1999/xhtml'}
        xml = ET.fromstring(sitemap({'/': {'modified': '2026-11-11'}}))
        entries = xml.findall('s:url', ns)
        self.assertEqual([e.find('s:loc', ns).text for e in entries], [
            'https://yakushimabus.com/', 'https://yakushimabus.com/?lang=zh', 'https://yakushimabus.com/?lang=en'])
        for entry in entries:
            alternates = {a.attrib['hreflang']: a.attrib['href'] for a in entry.findall('x:link', ns)}
            self.assertEqual(alternates['ja'], 'https://yakushimabus.com/')
            self.assertEqual(alternates['x-default'], 'https://yakushimabus.com/')

if __name__ == '__main__':
    unittest.main()
