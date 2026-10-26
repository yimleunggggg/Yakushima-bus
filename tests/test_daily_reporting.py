import sys,unittest
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from seo_daily_observations import complete_windows,comparison,enrich
import seo_feishu_util as fu

class ReportingTests(unittest.TestCase):
    def test_china_morning_does_not_include_ongoing_los_angeles_day(self):
        end,previous,start,prior=complete_windows('America/Los_Angeles',datetime(2026,10,26,10,30,tzinfo=ZoneInfo('Asia/Shanghai')))
        self.assertEqual(str(end),'2026-10-24')
        self.assertEqual(str(start),'2026-10-18')
        self.assertEqual(str(prior),'2026-10-11')
    def test_dst_fallback_still_selects_previous_calendar_day(self):
        end,*_=complete_windows('America/Los_Angeles',datetime(2026,11,2,1,tzinfo=ZoneInfo('Asia/Shanghai')))
        self.assertEqual(str(end),'2026-10-31')
    def test_missing_is_not_zero_and_zero_baseline_is_not_infinite_growth(self):
        self.assertEqual(comparison('GA4','users',None,12,'x')['status'],'缺失')
        self.assertEqual(comparison('GA4','users',3,0,'x')['change'],'新增（前期为0）')
        self.assertEqual(comparison('GSC','CTR',19.14,14.85,'x','个百分点')['change'],'+4.29个百分点')
    def test_missing_source_does_not_create_zero_comparisons(self):
        with patch('seo_daily_observations.integration_checks',return_value=[]):
            d=enrich({'ga4_daily':{'error':'unavailable'},'gsc_28d':{'error':'invalid_grant'}})
        self.assertTrue(all(r['current'] is None and r['status']=='缺失' for r in d['daily_changes']))
    def test_feishu_resolves_title_to_real_sheet_id_and_verifies_roundtrip(self):
        fu._SHEET_IDS.clear();calls=[]
        def api(method,path,token,**kwargs):
            calls.append((method,path,kwargs))
            if 'sheets/query' in path:return {'data':{'sheets':[{'title':'每日变化','sheet_id':'real-id'}]}}
            if method=='GET':return {'data':{'valueRange':{'values':[['日期','点击'],['2026-10-26',4]]}}}
            return {'data':{}}
        with patch.object(fu,'api_json',side_effect=api):fu.write_range('token','sheet','每日变化',[['日期','点击'],['2026-10-26',4]])
        put=next(c for c in calls if c[0]=='PUT')
        self.assertEqual(put[2]['json']['valueRange']['range'],'real-id!A1:B2')
        self.assertTrue(any(c[0]=='GET' and 'real-id' in c[1] for c in calls))
    def test_feishu_url_rich_text_keeps_visible_text_and_target(self):
        url='https://example.com/report'
        self.assertEqual(fu.canonical_cell([{'type':'url','text':url,'link':url,'cellPosition':None}]),url)
        self.assertNotEqual(fu.canonical_cell([{'type':'url','text':url,'link':'https://wrong.example'}]),url)
    def test_failed_readback_fails_delivery(self):
        fu._SHEET_IDS.clear()
        def api(method,path,token,**kwargs):
            if 'sheets/query' in path:return {'data':{'sheets':[{'title':'日报','sheet_id':'id'}]}}
            return {'data':{'valueRange':{'values':[['wrong']]}}}
        with patch.object(fu,'api_json',side_effect=api),self.assertRaisesRegex(RuntimeError,'回读与写入不一致'):
            fu.write_range('token','sheet','日报',[['expected']])
class DashboardBotTests(unittest.TestCase):
    def test_latest_dashboard_does_not_sum_rolling_windows_or_fill_gaps(self):
        from seo_daily_dashboard import build_dashboard,trend_rows
        d={"fetched_at":"2026-10-26","ga4_daily":{"period":{"yesterday":"2026-10-25"},"yesterday":{"active_users":7}},"daily_changes":[]}
        trends=trend_rows([d],d)
        self.assertEqual(len(trends),14)
        self.assertEqual(trends[-1][1],7)
        self.assertEqual(trends[-2][1],"未取得")
        self.assertEqual(build_dashboard([d])[4][2],"未取得")
    def test_bot_retry_uses_same_uuid_and_requires_acceptance(self):
        import seo_feishu_bot as bot
        payload={"fetched_at":"2026-10-26"}
        config={"FEISHU_BOT_RECEIVE_ID":"target","FEISHU_BOT_RECEIVE_ID_TYPE":"open_id"}
        with patch.object(fu,'cfg',side_effect=lambda k:config.get(k,'')),patch.object(fu,'tenant_token',return_value='token'),patch.object(fu,'resolve_spreadsheet_token',return_value=('sheet',{},None)),patch.object(fu,'ensure_sheet_tab',return_value='home'),patch.object(fu,'api_json',return_value={'data':{'message_id':'message'}}) as api:
            self.assertEqual(bot.send(payload),0)
            first=api.call_args.kwargs['json']
            bot.send(payload)
            self.assertEqual(first['uuid'],api.call_args.kwargs['json']['uuid'])
            api.return_value={'data':{}}
            with self.assertRaisesRegex(RuntimeError,'消息ID'):bot.send(payload)
    def test_bot_without_recipient_does_not_send(self):
        import seo_feishu_bot as bot
        with patch.object(fu,'cfg',return_value=''),patch.object(fu,'tenant_token') as auth:
            self.assertEqual(bot.send({'fetched_at':'2026-10-26'}),2)
            auth.assert_not_called()

class BotConfigTests(unittest.TestCase):
    def test_json_bundle_uses_matched_app_and_recipient(self):
        import json
        import seo_feishu_bot as bot
        bundle={"app_id":"right-app","app_secret":"fake-unit-test-secret","receive_id":"right-recipient","receive_id_type":"open_id"}
        with patch.object(fu,'cfg',side_effect=lambda k:json.dumps(bundle) if k=='FEISHU_BOT_CONFIG_JSON' else 'different-legacy-value'):
            self.assertEqual(bot.bot_config(),bundle)
    def test_broken_bundle_is_rejected_without_echoing_credential(self):
        import seo_feishu_bot as bot
        for raw in ['not-json','{"app_secret":"fake-secret"}','[]']:
            with patch.object(fu,'cfg',return_value=raw),self.assertRaises(RuntimeError) as error:
                bot.bot_config()
            self.assertNotIn('fake-secret',str(error.exception))

if __name__=='__main__':unittest.main()
