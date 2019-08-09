#!/usr/bin/python
#coding: utf-8
import sys,os
reload(sys)
sys.setdefaultencoding('utf-8')
os.chdir('/www/server/panel');
sys.path.append("class/")
import public,db,time

class beta_main:
    __setupPath = '/www/server/panel/plugin/beta';
    def SetConfig(self,get):
        data = {}
        data['username'] = get.bbs_name
        data['qq'] = get.qq
        data['email'] = get.email
        result = public.httpPost('http://www.bt.cn/Api/LinuxBeta',data);
        import json;
        data = json.loads(result);
        if data['status']:
            public.writeFile(self.__setupPath + '/config.conf',get.bbs_name + '|' + get.qq + '|' + get.email);
        return data;
    def GetConfig(self,get):
        try:
            cfile = self.__setupPath + '/config.conf'
            if not os.path.exists(cfile): cfile = 'data/beta.pl'
            return public.readFile(cfile).strip();
        except:
            return 'False';
