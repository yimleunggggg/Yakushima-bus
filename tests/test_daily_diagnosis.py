import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"scripts"))
from seo_daily_diagnosis import compared,analyse,HeadTags
from seo_feishu_bot import card


def block(rows,complete=True):return {"rows":rows,"complete":complete}
def row(key,number,metric="sessions"):return {"keys":[key],metric:number}


class DiagnosisTests(unittest.TestCase):
    def test_missing_or_truncated_baseline_cannot_create_drop_to_zero(self):
        self.assertEqual(compared({"current":block([row("/",2)]),"previous":block([row("/fare",20)],False)},"sessions",page=True),[])
    def test_unknown_landing_is_not_merged_into_homepage(self):
        pair={"current":block([row("/",554),row("",9)]),"previous":block([row("/",674)])}
        home=next(r for r in compared(pair,"sessions",page=True) if r['key']=='/')
        self.assertEqual(home['current'],554)
    def test_anonymized_query_absence_cannot_be_treated_as_zero(self):
        pair={"current":block([row("known",5,"clicks")]),"previous":block([row("hidden",50,"clicks"),row("known",10,"clicks")])}
        changes=compared(pair,"clicks",visible_only=True)
        self.assertEqual([(r['key'],r['delta']) for r in changes],[("known",-5)])
    def test_duplicate_page_slashes_aggregate_before_comparison(self):
        pair={"current":block([row("https://yakushimabus.com/fare/",2,"clicks"),row("https://yakushimabus.com/fare",3,"clicks")]),"previous":block([row("https://yakushimabus.com/fare/",10,"clicks")])}
        self.assertEqual(compared(pair,"clicks",page=True)[0]['delta'],-5)
    def test_visitor_drop_does_not_falsely_imply_google_drop(self):
        payload={"fetched_at":"2026-10-27","ga4_daily":{"last_7d":{"active_users":479},"previous_7d":{"active_users":549},"period":{"last_7d_start":"2026-10-19","last_7d_end":"2026-10-25"}},"gsc_7d":{"clicks":375,"period":{"start":"2026-10-18","end":"2026-10-24"}},"gsc_previous_7d":{"clicks":320,"period":{"start":"2026-10-11","end":"2026-10-17"}},"diagnostics":{"ga4_aligned_source":{"current":block([row("google / organic",471)]),"previous":block([row("google / organic",425)])}}}
        a=analyse(payload)
        self.assertIn("访问425→471",a['judgment'])
        self.assertIn("与整站统计周不同",a['judgment'])
        text=card(payload,"https://example.com")["elements"][0]["text"]["content"]
        self.assertNotIn("对照看板查看",text)
        self.assertNotIn("优先看哪些搜索入口",text)
        self.assertEqual(a['user_actions'],[])
    def test_card_labels_shared_dates_and_stops_cross_platform_claim_on_mismatch(self):
        base={"fetched_at":"2026-10-27", "ga4_daily":{"timezone":"America/Los_Angeles", "period":{"yesterday":"2026-10-24","last_7d":"2026-10-18~2026-10-24"}}, "gsc_latest_complete_day":"2026-10-24", "gsc_7d":{}, "analysis":{"card_findings":["有依据的发现"],"judgment":"同周期判断", "agent_actions":[],"user_actions":[]}}
        rendered=str(card(base,"https://example.com"))
        self.assertIn("共同数据日：2026-10-24", rendered)
        self.assertIn("2026-10-18~2026-10-24", rendered)
        base['gsc_latest_complete_day']='2026-10-23'
        rendered=str(card(base,"https://example.com"))
        self.assertIn("数据未对齐",rendered)
        self.assertNotIn("同周期判断",rendered)

    def test_noindex_is_detected_regardless_of_meta_attribute_order(self):
        p=HeadTags();p.feed('<meta content="noindex,follow" name="robots"><link href="https://yakushimabus.com/" rel="canonical">')
        self.assertTrue(p.noindex);self.assertEqual(p.canonical,"https://yakushimabus.com/")

if __name__=="__main__":unittest.main()
