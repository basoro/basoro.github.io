#!/usr/bin/python
#coding: utf-8
import sys,os
reload(sys)
sys.setdefaultencoding('utf-8')
os.chdir('/opt/slemp/server/panel');
sys.path.append("")
import public,db,time

class foo_main:
    __setupPath = '/opt/slemp/server/panel/plugin/foo';
    def SetConfig(self,get):
        data = {}
        data['username'] = get.bbs_name
        data['qq'] = get.qq
        data['email'] = get.email
        result = public.httpPost('#',data);
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
