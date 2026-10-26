"""Review deadlines apply to current evidence, preserving ended notices as history."""
import sys
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from check_transport_data import notice_review_overdue


class NoticeReviewTests(unittest.TestCase):
    def test_ended_closure_does_not_block_a_later_weekly_review(self):
        notice = {'status': 'suspended', 'validTo': '2026-10-17', 'reviewAfter': '2026-10-31'}
        self.assertFalse(notice_review_overdue(notice, date(2026, 11, 2)))
        self.assertEqual(notice['validTo'], '2026-10-17')

    def test_open_ended_suspension_still_requires_review_without_reopening(self):
        notice = {'status': 'suspended', 'validTo': None, 'reviewAfter': '2026-11-02'}
        self.assertFalse(notice_review_overdue(notice, date(2026, 11, 2)))
        self.assertTrue(notice_review_overdue(notice, date(2026, 11, 3)))
        self.assertEqual(notice['status'], 'suspended')

    def test_explicit_end_date_remains_inclusive_and_current_notices_still_fail(self):
        notice = {'status': 'notice', 'validTo': '2026-10-28', 'reviewAfter': '2026-10-25'}
        self.assertTrue(notice_review_overdue(notice, date(2026, 10, 26)))
        self.assertTrue(notice_review_overdue(notice, date(2026, 10, 28)))
        self.assertFalse(notice_review_overdue(notice, date(2026, 10, 29)))


if __name__ == '__main__':
    unittest.main()
