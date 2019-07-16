#!/usr/bin/python
#coding: utf-8
import sys
import os
import shutil
import time
import glob
print '=================================================================='
print '★['+time.strftime("%Y/%m/%d %I:%M:%S")+']，log cut'
print '=================================================================='
print '|--Keep the lastest ['+sys.argv[2]+'] '
logsPath = '/opt/slemp/wwwlogs/'
oldFileName = logsPath+sys.argv[1]
if not os.path.exists(oldFileName):
    print '|---'+sys.argv[1]+' is not exists!'
    exit()



logs=sorted(glob.glob(oldFileName+"_*"))
count=len(logs)
num=count - int(sys.argv[2])

for i in range(count):
    if i>num:
	    break;
    os.remove(logs[i])
    print '|---Redundant logs ['+logs[i]+'] have delected!'

newFileName=oldFileName+'_'+time.strftime("%Y-%m-%d_%I%M%S")+'.log'
shutil.move(oldFileName,newFileName)
os.system("kill -USR1 `cat /opt/slemp/server/nginx/logs/nginx.pid`");
print '|---Log has cut to:'+newFileName
