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
        dnsStr = "nameserver " + get.dns1 + "\n" ;
        if get.dns2:
            dnsStr += "nameserver " + get.dns2 + '\n'
        public.writeFile('/etc/resolv.conf',dnsStr);
        return public.returnMsg(True,'Setting successed!')

    def GetConfig(self,get):
        dnsStr = public.ExecShell('cat /etc/resolv.conf|grep nameserver')
        tmp = dnsStr[0].split()
        dnsInfo = {}
        dnsInfo['dns1'] = ''
        dnsInfo['dns2'] = ''
        if len(tmp) > 1:
            dnsInfo['dns1'] = tmp[1];
        if len(tmp) > 2:
            dnsInfo['dns2'] = tmp[3];
        return dnsInfo;

    def TestDns(self,get):
        resolv = '/etc/resolv.conf'
        dnsStr = "nameserver " + get.dns1 + "\n" + "nameserver " + get.dns2;
        backupDns = public.readFile(resolv)
        public.writeFile(resolv,dnsStr);
        tmp = public.ExecShell("ping -c 1 -w 1 www.google.com")
        isPing = False
        try:
            if tmp[0].split('time=')[1].split()[0]: isPing = True
        except:
            pass
        public.writeFile(resolv,backupDns);
        if isPing:
            return public.returnMsg(True,'Current DNS can be used!<br>'+tmp[0].replace('\n','<br>'))
        return public.returnMsg(False,'Current DNS cannot be used!<br>'+tmp[1])
