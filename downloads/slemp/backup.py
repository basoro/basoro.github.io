#!/usr/bin/python
#coding: utf-8

import sys,os
reload(sys)
sys.setdefaultencoding('utf-8')
os.chdir('/opt/slemp/server/panel');
sys.path.append("")
import public,db,time

class backupTools:

    def backupSite(self,name,count):
        sql = db.Sql();
        path = sql.table('sites').where('name=?',(name,)).getField('path');
        startTime = time.time();
        if not path:
            endDate = time.strftime('%Y/%m/%d %X',time.localtime())
            log = "Situs web ["+name+"] tidak ada!"
            print "★["+endDate+"] "+log
            print "----------------------------------------------------------------------------"
            return;

        backup_path = sql.table('config').where("id=?",(1,)).getField('backup_path') + '/site';
        if not os.path.exists(backup_path): public.ExecShell("mkdir -p " + backup_path);

        filename= backup_path + "/Web_" + name + "_" + time.strftime('%Y%m%d_%H%M%S',time.localtime()) + '.tar.gz'
        public.ExecShell("cd " + os.path.dirname(path) + " && tar zcvf '" + filename + "' '" + os.path.basename(path) + "' > /dev/null")
        endDate = time.strftime('%Y/%m/%d %X',time.localtime())

        if not os.path.exists(filename):
            log = "Backup situs web ["+name+"] gagal!"
            print "★["+endDate+"] "+log
            print "----------------------------------------------------------------------------"
            return;

        outTime = time.time() - startTime
        pid = sql.table('sites').where('name=?',(name,)).getField('id');
        sql.table('backup').add('type,name,pid,filename,addtime,size',('0',os.path.basename(filename),pid,filename,endDate,os.path.getsize(filename)))
        log = "Backup situs web ["+name+"] sukses, dengan lama ["+str(round(outTime,2))+"] detik";
        public.WriteLog('Crontab',log)
        print "★["+endDate+"] " + log
        print "|---Simpan backup yang terbaru ["+count+"]"
        print "|---Nama file: "+filename

        backups = sql.table('backup').where('type=? and pid=?',('0',pid)).field('id,filename').select();

        num = len(backups) - int(count)
        if  num > 0:
            for backup in backups:
                public.ExecShell("rm -f " + backup['filename']);
                sql.table('backup').where('id=?',(backup['id'],)).delete();
                num -= 1;
                print "|---File cadangan yang kedaluwarsa telah dibersihkan:" + backup['filename']
                if num < 1: break;

    def backupDatabase(self,name,count):
        sql = db.Sql();
        path = sql.table('databases').where('name=?',(name,)).getField('path');
        startTime = time.time();
        if not path:
            endDate = time.strftime('%Y/%m/%d %X',time.localtime())
            log = "Basis data ["+name+"] tidak ada!"
            print "★["+endDate+"] "+log
            print "----------------------------------------------------------------------------"
            return;

        backup_path = sql.table('config').where("id=?",(1,)).getField('backup_path') + '/database';
        if not os.path.exists(backup_path): public.ExecShell("mkdir -p " + backup_path);

        filename = backup_path + "/Db_" + name + "_" + time.strftime('%Y%m%d_%H%M%S',time.localtime())+".sql.gz"

        import re
        mysql_root = sql.table('config').where("id=?",(1,)).getField('mysql_root')
        mycnf = public.readFile('/etc/my.cnf');
        rep = "\[mysqldump\]\nuser=root"
        sea = '[mysqldump]\n'
        subStr = sea + "user=root\npassword=" + mysql_root+"\n";
        mycnf = mycnf.replace(sea,subStr)
        if len(mycnf) > 100:
            public.writeFile('/etc/my.cnf',mycnf);

        public.ExecShell("/opt/slemp/server/mysql/bin/mysqldump --opt --default-character-set=utf8 " + name + " | gzip > " + filename)

        if not os.path.exists(filename):
            endDate = time.strftime('%Y/%m/%d %X',time.localtime())
            log = "Backup basis data ["+name+"] gagal!"
            print "★["+endDate+"] "+log
            print "----------------------------------------------------------------------------"
            return;

        mycnf = public.readFile('/etc/my.cnf');
        mycnf = mycnf.replace(subStr,sea)
        if len(mycnf) > 100:
            public.writeFile('/etc/my.cnf',mycnf);

        endDate = time.strftime('%Y/%m/%d %X',time.localtime())
        outTime = time.time() - startTime
        pid = sql.table('databases').where('name=?',(name,)).getField('id');

        sql.table('backup').add('type,name,pid,filename,addtime,size',(1,os.path.basename(filename),pid,filename,endDate,os.path.getsize(filename)))
        log = "Sukses membackup basis data ["+name+"], dengan waktu ["+str(round(outTime,2))+"] detik";
        public.WriteLog('Crontab',log)
        print "★["+endDate+"] " + log
        print "|---Simpan backup yang terbaru ["+count+"]"
        print "|---Nama file: "+filename

        backups = sql.table('backup').where('type=? and pid=?',('1',pid)).field('id,filename').select();

        num = len(backups) - int(count)
        if  num > 0:
            for backup in backups:
                public.ExecShell("rm -f " + backup['filename']);
                sql.table('backup').where('id=?',(backup['id'],)).delete();
                num -= 1;
                print "|---File cadangan yang kedaluwarsa telah dibersihkan:" + backup['filename']
                if num < 1: break;


if __name__ == "__main__":
    backup = backupTools()
    type = sys.argv[1];
    if type == 'site':
        backup.backupSite(sys.argv[2], sys.argv[3])
    else:
        backup.backupDatabase(sys.argv[2], sys.argv[3])
