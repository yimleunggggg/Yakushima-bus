import json,os,sys,tempfile,unittest
from pathlib import Path
from datetime import datetime,timedelta
from zoneinfo import ZoneInfo
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"scripts"))
import seo_daily_delivery as delivery

CONFIG={'app_id':'test-app','app_secret':'fake-test-secret','receive_id':'test-target','receive_id_type':'open_id'}
NOW=datetime(2026,10,27,10,50,tzinfo=ZoneInfo('Asia/Shanghai'))
PAYLOAD={'fetched_at':'2026-10-27','fetched_at_iso':NOW.isoformat()}


def receipt(ctx,accepted=None):
    return {'business_date':ctx['day'],'slot':'10:00','recipient_fingerprint':ctx['fingerprint'],'message_id':'om_test-real-format','accepted_at':(accepted or ctx['target']+timedelta(minutes=1)).isoformat()}


class DeliveryTests(unittest.TestCase):
    def test_early_preview_cannot_replace_ten_oclock_delivery(self):
        ctx=delivery.context(CONFIG,NOW)
        self.assertFalse(delivery.valid(receipt(ctx,ctx['target']-timedelta(hours=8)),ctx))
        self.assertTrue(delivery.valid(receipt(ctx),ctx))
    def test_receipt_blocks_late_cron_beyond_provider_dedupe_window(self):
        ctx=delivery.context(CONFIG,NOW+timedelta(hours=5))
        self.assertFalse(delivery.should_run('schedule',ctx,receipt(ctx)))
        self.assertTrue(delivery.should_run('push',ctx,receipt(ctx)))
    def test_wrong_recipient_and_previous_day_do_not_block_today(self):
        ctx=delivery.context(CONFIG,NOW);old=receipt(ctx)
        other=delivery.context({**CONFIG,'receive_id':'another-target'},NOW)
        self.assertFalse(delivery.valid(old,other))
        tomorrow=delivery.context(CONFIG,NOW+timedelta(days=1))
        self.assertFalse(delivery.valid(old,tomorrow))
    def test_very_late_previous_schedule_cannot_wake_user_at_two_am(self):
        ctx=delivery.context(CONFIG,NOW.replace(hour=2,minute=0))
        self.assertFalse(delivery.should_run('schedule',ctx,None))
        self.assertTrue(delivery.should_run('push',ctx,None))
    def test_valid_receipt_skips_actual_send(self):
        ctx=delivery.context(CONFIG,NOW)
        with patch('seo_feishu_bot.bot_config',return_value=CONFIG),patch.object(delivery,'read_receipt',return_value=receipt(ctx)),patch('seo_feishu_bot.send') as send:
            self.assertEqual(delivery.deliver(PAYLOAD,now=NOW),0)
            send.assert_not_called()
    def test_preview_is_separate_from_business_delivery(self):
        now=NOW.replace(hour=1)
        with patch.dict(os.environ,{'GITHUB_EVENT_NAME':'push','GITHUB_RUN_ID':'run-123'}),patch('seo_feishu_bot.bot_config',return_value=CONFIG),patch('seo_feishu_bot.send',return_value=0) as send,patch.object(delivery,'read_receipt') as read:
            delivery.deliver(PAYLOAD,now=now)
            self.assertTrue(send.call_args.kwargs['delivery_key'].startswith('preview:run-123'))
            read.assert_not_called()
    def test_scheduled_warmup_waits_and_persists_actual_acknowledgment(self):
        with tempfile.TemporaryDirectory() as root:
            now=NOW.replace(hour=9,minute=53)
            def send(payload,**kwargs):
                wait.assert_called_once()
                kwargs['receipt_callback']('om_test-accepted')
                return 0
            with patch.dict(os.environ,{'GITHUB_EVENT_NAME':'schedule'}),patch('seo_feishu_bot.bot_config',return_value=CONFIG),patch.object(delivery,'read_receipt',return_value=None),patch.object(delivery,'wait_for_target') as wait,patch('seo_feishu_bot.send',side_effect=send),patch('seo_daily_publish.publish') as publish:
                self.assertEqual(delivery.deliver(PAYLOAD,root=root,now=now),0)
                ctx=delivery.context(CONFIG,now)
                saved=json.loads((Path(root)/ctx['path']).read_text())
                self.assertTrue(delivery.valid(saved,ctx))
                publish.assert_called_once_with(root,paths=[delivery.DIRECTORY])
    def test_old_report_is_rejected_even_outside_workflow(self):
        with patch('seo_feishu_bot.bot_config',return_value=CONFIG),self.assertRaisesRegex(RuntimeError,'旧日报'):
            delivery.deliver({'fetched_at':'2026-10-26'},now=NOW)

if __name__=='__main__':unittest.main()
