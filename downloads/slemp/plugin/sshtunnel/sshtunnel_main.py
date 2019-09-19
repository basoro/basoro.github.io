#!/usr/bin/python
#coding: utf-8
import sys,os
reload(sys)
sys.setdefaultencoding('utf-8')
os.chdir('/opt/slemp/server/panel');
sys.path.append("")
import public,db,time

class sshtunnel_main:
    __setupPath = '/opt/slemp/server/panel/plugin/sshtunnel';

    def SetConfig(self,get):
        confStr = "USER_NAME " + get.username + "\n" ;
        confStr += "PASS " + get.username + '\n'
        public.writeFile('/usr/sbin/ssh_tunnel',confStr);
        return public.returnMsg(True,'Setting successed!')

    def GetConfig(self,get):
        confStr = public.ExecShell('cat /usr/sbin/ssh_tunnel|grep USER_NAME')
        tmp = confStr[0].split()
        confInfo = {}
        confInfo['username'] = ''
        confInfo['password'] = ''
        if len(tmp) > 1:
            confInfo['username'] = tmp[1];
        if len(tmp) > 2:
            confInfo['password'] = tmp[3];
        return confInfo;

    def RunTunnel(self,get):
        ssh_tunnel = '/usr/sbin/ssh_tunnel'
        confStr = "USER_NAME " + get.username + "\n" + "PASS " + get.password;
        backupDns = public.readFile(ssh_tunnel)
        public.writeFile(ssh_tunnel,confStr);
        tmp = public.ExecShell("ping -c 1 -w 1 www.google.com")
        isPing = False
        try:
            if tmp[0].split('time=')[1].split()[0]: isPing = True
        except:
            pass
        public.writeFile(ssh_tunnel,backupDns);
        if isPing:
            return public.returnMsg(True,'Current DNS can be used!<br>'+tmp[0].replace('\n','<br>'))
        return public.returnMsg(False,'Current DNS cannot be used!<br>'+tmp[1])
