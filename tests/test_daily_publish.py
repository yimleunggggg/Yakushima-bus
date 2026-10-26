import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"scripts"))
import seo_daily_publish as pub


def command(*args):
    return subprocess.run(list(args),check=True,capture_output=True,text=True).stdout


class PublishTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup)
        self.folder=Path(self.temp.name);self.remote=self.folder/"remote.git";self.root=self.folder/"collector";self.other=self.folder/"editor"
        command("git","init","--bare","--initial-branch=main",str(self.remote))
        command("git","clone",str(self.remote),str(self.root))
        self.metric="docs/seo/metrics/daily-latest.json"
        self.setup_identity(self.root)
        (self.root/"app.py").write_text("initial source")
        dest=self.root/self.metric;dest.parent.mkdir(parents=True)
        dest.write_text(self.snapshot(1))
        self.commit(self.root,"initial")
        command("git","-C",str(self.root),"push","origin","main")
        command("git","clone",str(self.remote),str(self.other));self.setup_identity(self.other)
    def setup_identity(self,root):
        command("git","-C",str(root),"config","user.name","Test")
        command("git","-C",str(root),"config","user.email","test@example.invalid")
    def snapshot(self,hour):
        return json.dumps({"fetched_at_iso":f"2026-10-27T{hour:02d}:00:00+08:00","value":hour})
    def commit(self,root,message):
        command("git","-C",str(root),"add",".")
        command("git","-C",str(root),"commit","-m",message)
    def test_parallel_source_and_same_day_report_are_preserved(self):
        incoming=self.snapshot(3);(self.root/self.metric).write_text(incoming)
        (self.other/"app.py").write_text("another chat changed source")
        (self.other/self.metric).write_text(self.snapshot(2));self.commit(self.other,"parallel edit")
        command("git","-C",str(self.other),"push")
        head=command("git","-C",str(self.root),"rev-parse","HEAD")
        pub.publish(self.root)
        self.assertEqual(command("git","--git-dir",str(self.remote),"show","main:app.py"),"another chat changed source")
        self.assertEqual(command("git","--git-dir",str(self.remote),"show","main:"+self.metric),incoming)
        self.assertEqual((self.root/self.metric).read_text(),incoming)
        self.assertEqual(command("git","-C",str(self.root),"rev-parse","HEAD"),head)
    def test_push_race_retries_without_rebase_or_discarding_collected_data(self):
        incoming=self.snapshot(3);(self.root/self.metric).write_text(incoming)
        real=pub.git; raced=[]
        def racing(root,*args,**kwargs):
            if args and args[0]=="push" and not raced:
                raced.append(True)
                (self.other/"app.py").write_text("source changed during publish")
                (self.other/self.metric).write_text(self.snapshot(2));self.commit(self.other,"race")
                command("git","-C",str(self.other),"push")
            return real(root,*args,**kwargs)
        with patch.object(pub,"git",side_effect=racing),patch.object(pub.time,"sleep"):
            pub.publish(self.root)
        self.assertEqual(command("git","--git-dir",str(self.remote),"show","main:app.py"),"source changed during publish")
        self.assertEqual(command("git","--git-dir",str(self.remote),"show","main:"+self.metric),incoming)
        self.assertFalse((self.root/".git/rebase-merge").exists())
    def test_newer_remote_snapshot_cannot_be_replaced_by_old_run(self):
        (self.root/self.metric).write_text(self.snapshot(2))
        remote_new=self.snapshot(4);(self.other/self.metric).write_text(remote_new);self.commit(self.other,"newer report")
        command("git","-C",str(self.other),"push")
        pub.publish(self.root)
        self.assertEqual(command("git","--git-dir",str(self.remote),"show","main:"+self.metric),remote_new)
        self.assertEqual((self.root/self.metric).read_text(),self.snapshot(2))

if __name__=="__main__":unittest.main()
