# coding: utf-8
from __future__ import print_function
import sys, os, json
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
# from google_auth_oauthlib import flow
from google.auth.transport.requests import Request
from googleapiclient.http import MediaFileUpload

if sys.version_info[0] == 2:
    reload(sys)
    sys.setdefaultencoding('utf-8')
os.chdir('/opt/slemp/server/panel')
sys.path.append("")
import public, db, time, re


class gdrive_main():
    __credentials = "/opt/slemp/server/panel/plugin/gdrive/credentials.json"
    __setup_path = "/opt/slemp/server/panel/plugin/gdrive"
    __backup_dir_name = "backup"
    __creds = None
    # __scpos = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.appdata',
    #            'https://www.googleapis.com/auth/drive']
    __scpos = ['https://www.googleapis.com/auth/drive.file']

    _DEFAULT_AUTH_PROMPT_MESSAGE = (
        'Please visit this URL to authorize this application: {url}')
    """str: The message to display when prompting the user for
    authorization."""
    _DEFAULT_AUTH_CODE_MESSAGE = (
        'Enter the authorization code: ')
    """str: The message to display when prompting the user for the
    authorization code. Used only by the console strategy."""

    _DEFAULT_WEB_SUCCESS_MESSAGE = (
        'The authentication flow has completed, you may close this window.')

    def __init__(self):
        self.set_libList()
        self.set_creds()

    def run_local_server(
            self, flow, host='localhost', port=8080,
            authorization_prompt_message=_DEFAULT_AUTH_PROMPT_MESSAGE,
            success_message=_DEFAULT_WEB_SUCCESS_MESSAGE,
            open_browser=True,
            **kwargs):
        import wsgiref.simple_server
        import wsgiref.util
        import webbrowser
        from google_auth_oauthlib.flow import _RedirectWSGIApp
        from google_auth_oauthlib.flow import _WSGIRequestHandler
        #from google_auth_oauthlib.flow import Flow

        wsgi_app = _RedirectWSGIApp(success_message)
        local_server = wsgiref.simple_server.make_server(
            host, port, wsgi_app, handler_class=_WSGIRequestHandler)

        flow.redirect_uri = 'http://{}:{}/'.format(
            host, local_server.server_port)
        auth_url, _ = flow.authorization_url(**kwargs)
        public.writeFile("/tmp/auth_url",str(auth_url))

        if open_browser:
            webbrowser.open(auth_url, new=1, autoraise=True)

        print(authorization_prompt_message.format(url=auth_url))

        local_server.handle_request()

        # Note: using https here because oauthlib is very picky that
        # OAuth 2.0 should only occur over https.
        authorization_response = wsgi_app.last_request_uri.replace(
            'http', 'https')
        flow.fetch_token(authorization_response=authorization_response)

        return flow.credentials

    def set_libList(self):
        libList = public.readFile("/opt/slemp/server/panel/data/libList.conf")
        if libList:
            libList = json.loads(libList)
        for i in libList:
            if "gdrive" in i.values():
                return
        d = {
            "name": "Google Drive",
            "type": "Cron job",
            "ps": "Back up your website or database to Google Cloud Storage.",
            "status": False,
            "opt": "gdrive",
            "module": "os",
            "script": "gdrive",
            "help": "http://ataaka.basoro.id",
            "key": "",
            "secret": "",
            "bucket": "",
            "domain": "",
            "check": ["/opt/slemp/server/panel/plugin/gdrive/gdrive_main.py",
                      "/opt/slemp/server/panel/script/backup_gdrive.py"]
        }
        data = d
        libList.append(data)
        public.writeFile("/opt/slemp/server/panel/data/libList.conf", json.dumps(libList))
        return libList

    def set_creds(self):
        if os.path.exists(self.__setup_path + '/token.pickle'):
            with open(self.__setup_path + '/token.pickle', 'rb') as token:
                self.__creds = pickle.load(token)
            return True
        else:
            print("Failed to get Google token, please verify before use")

    def get_token(self,get):
        if self.set_creds():
            return public.returnMsg(True,"Get success")
        if not self.__creds or not self.__creds.valid:
            if self.__creds and self.__creds.expired and self.__creds.refresh_token:
                print("1")
                self.__creds.refresh(Request())
            else:
                print("2")
                flow = InstalledAppFlow.from_client_secrets_file(self.__credentials, self.__scpos)
                self.__creds = self.run_local_server(flow, port=0)
            with open('token.pickle', 'wb') as token:
                pickle.dump(self.__creds, token)

    def get_auth_url(self,get):
        if os.path.exists("/tmp/auth_url"):
            return public.readFile("/tmp/auth_url")

    def set_auth_url(self,get):
        # os.system('curl "%s"' % get.url)
        import requests
        requests.get(get.url)
        time.sleep(3)
        if os.path.exists("/opt/slemp/server/panel/token.pickle"):
            os.system("mv /opt/slemp/server/panel/token.pickle /opt/slemp/server/panel/plugin/gdrive/token.pickle")
            return public.returnMsg(True,"Verification successful")
        return public.returnMsg(False, "Verification failed")

    def check_connect(self,get):
        if os.path.exists(self.__setup_path + '/token.pickle'):
            with open(self.__setup_path + '/token.pickle', 'rb') as token:
                __creds = pickle.load(token)
        else:
            print("Failed to get Google token, please verify before use")
            return public.returnMsg(True, "Failed to get Google token, please verify before use")
        service = build('drive', 'v3', credentials=__creds)
        results = service.files().list(
            pageSize=10, fields="nextPageToken, files(id, name)").execute()
        try:
            results.get('files', [])
            return public.returnMsg(True, "Verification successful")
        except:
            return public.returnMsg(False, "Verification failed")
        # if not items:
        #     print('No files found.')
        #     return False
        # else:
        #     print('Files:')
        #     for item in items:
        #         print('{0} ({1})'.format(item['name'], item['id']))
        #     return items


    def _get_filename(self,filename):
        l = filename.split("/")
        return l[-1]

    def _create_folder_cycle(self,filepath):
        l = filepath.split("/")
        fid_list = []
        for i in l:
            if not i:
                continue
            fid = self.__get_folder_id(i)
            if fid:
                fid_list.append(fid)
                continue
            if not fid_list:
                fid_list.append("")
            print("fid_list",str(fid_list))
            fid_list.append(self.create_folder(i,fid_list[-1]))
        return fid_list[-1]

    def upload_file(self,get):
        """
        get.filename File name after uploading
        get.filepath Upload file path
        :param get:
        :return:
        """
        filename = self._get_filename(get.filename)
        parents = self._create_folder_cycle(get.filepath)
        drive_service = build('drive', 'v3', credentials=self.__creds)
        file_metadata = {'name': filename, 'parents': [parents]}
        media = MediaFileUpload(get.filename, resumable=True)
        file = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        print('Upload Success ,File ID: %s' % file.get('id'))

    def _get_file_id(self,filename):
        service = build('drive', 'v3', credentials=self.__creds)
        results = service.files().list(pageSize=10, q="name='{}'".format(filename),fields="nextPageToken, files(id, name)").execute()
        items = results.get('files', [])
        if not items:
            return []
        else:
            for item in items:
                return item["id"]

    def _delete_file(self,file_id):
        drive_service = build('drive', 'v3', credentials=self.__creds)
        drive_service.files().delete(fileId=file_id).execute()
        print("delete ok")

    def __get_folder_id(self, floder_name):
        service = build('drive', 'v3', credentials=self.__creds)
        results = service.files().list(pageSize=10, q="name='{}' and mimeType='application/vnd.google-apps.folder'".format(floder_name),fields="nextPageToken, files(id, name)").execute()
        items = results.get('files', [])
        if not items:
            return []
        else:
            for item in items:
                return item["id"]

    def create_folder(self,folder_name,parents=""):
        print("folder_name: {}\nparents: {}".format(folder_name,parents))
        service = build('drive', 'v3', credentials=self.__creds)
        file_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        if parents:
            file_metadata['parents'] = [parents]
        folder = service.files().create(body=file_metadata,fields='id').execute()
        print('Create Folder ID: %s' % folder.get('id'))
        return folder.get('id')

    def get_database_character(self,db_name):
        try:
            import panelMysql
            tmp = panelMysql.panelMysql().query("show create database `%s`" % db_name.strip())
            c_type = str(re.findall("SET\s+([\w\d-]+)\s",tmp[0][1])[0])
            c_types = ['utf8','utf-8','gbk','big5','utf8mb4']
            if not c_type.lower() in c_types: return 'utf8'
            return c_type
        except:
            return 'utf8'

    def download_file(self,filename,m=True):
        return "Google storage products do not currently support downloads"

    def backup_site(self, name, count):
        sql = db.Sql()
        path = sql.table('sites').where('name=?', (name,)).getField('path')
        startTime = time.time()
        if not path:
            endDate = time.strftime('%Y/%m/%d %X', time.localtime())
            log = "The site [" + name + "] does not exist!"
            print("★[" + endDate + "] " + log)
            print("----------------------------------------------------------------------------")
            return

        backup_path = sql.table('config').where("id=?", (1,)).getField('backup_path') + '/site'
        if not os.path.exists(backup_path): public.ExecShell("mkdir -p " + backup_path)

        filename = backup_path + "/Web_" + name + "_" + time.strftime('%Y%m%d_%H%M%S',
                                                                      time.localtime()) + '_' + public.GetRandomString(
            8) + '.tar.gz'
        public.ExecShell("cd " + os.path.dirname(path) + " && tar zcvf '" + filename + "' '" + os.path.basename(
            path) + "' > /dev/null")
        endDate = time.strftime('%Y/%m/%d %X', time.localtime())

        if not os.path.exists(filename):
            log = "Website [" + name + "] backup failed!"
            print("★[" + endDate + "] " + log)
            print("----------------------------------------------------------------------------")
            return;

        get = getObject()
        get.filename = filename
        get.filepath = 'backup/sites/' + name
        print("Start upload")
        #print(get.filename) #/www/backup/site/Web_bt.youbadbad.cn_20190802_121927_2bDwmdM3.tar.gz
        #print(get.filepath) #bt_backup/sites/bt.youbadbad.cn/
        self.upload_file(get)
        outTime = time.time() - startTime
        pid = sql.table('sites').where('name=?', (name,)).getField('id')
        download = get.filepath + '/' + os.path.basename(filename)
        sql.table('backup').add('type,name,pid,filename,addtime,size',('0', download, pid, 'gdrive', endDate, os.path.getsize(filename)))
        log = "The website [" + name + "] has been successfully backed up to Google Drive, using [" + str(round(outTime, 2)) + "] seconds"
        public.WriteLog('TYPE_CRON', log)
        print("★[" + endDate + "] " + log)
        print("|---Keep the latest [" + count + "] backups")
        print("|---File name:" + os.path.basename(filename))

        public.ExecShell("rm -f " + filename)

        backups = sql.table('backup').where('type=? and pid=? and filename=?', ('0', pid, 'gdrive')).field(
            'id,name,filename').select()
        num = len(backups) - int(count)
        if num > 0:
            for backup in backups:
                print(backup['filename'])
                if os.path.exists(backup['filename']):
                    public.ExecShell("rm -f " + backup['filename'])
                # get.filename = 'bt_backup/sites/' + name + '/' + backup['name'].split("/")[-1]
                name = self._get_filename(backup['name'].split("/")[-1])
                file_id = self._get_file_id(name)
                try:
                    self._delete_file(file_id)
                except Exception as e:
                    print(e)
                sql.table('backup').where('id=?', (backup['id'],)).delete()
                num -= 1
                print("|---The expired backup file has been cleaned up：" + backup['name'])
                if num < 1: break
        return None

    def backup_database(self, name, count):
        print("start backup database")
        sql = db.Sql()
        path = sql.table('databases').where('name=?', (name,)).getField('id')
        startTime = time.time()
        if not path:
            endDate = time.strftime('%Y/%m/%d %X', time.localtime())
            log = "The database [" + name + "] does not exist!"
            print("★[" + endDate + "] " + log)
            print("----------------------------------------------------------------------------")
            return;

        backup_path = sql.table('config').where("id=?", (1,)).getField('backup_path') + '/database'
        if not os.path.exists(backup_path): public.ExecShell("mkdir -p " + backup_path);

        filename = backup_path + "/Db_" + name + "_" + time.strftime('%Y%m%d_%H%M%S',
                                                                     time.localtime()) + '_' + public.GetRandomString(
            8) + ".sql.gz"

        import re
        mysql_root = '"'+sql.table('config').where("id=?", (1,)).getField('mysql_root')+'"'
        mycnf = public.readFile('/etc/my.cnf')
        rep = "\[mysqldump\]\nuser=root"
        sea = "[mysqldump]\n"
        subStr = sea + "user=root\npassword=" + mysql_root + "\n"
        mycnf = mycnf.replace(sea, subStr)
        if len(mycnf) > 100:
            public.writeFile('/etc/my.cnf', mycnf)
        sh = "/opt/slemp/server/mysql/bin/mysqldump --default-character-set="+ self.get_database_character(name) +" --force --opt " + name + " | gzip > " + filename
        public.ExecShell(sh)
        if not os.path.exists(filename):
            endDate = time.strftime('%Y/%m/%d %X', time.localtime())
            log = "Database [" + name + "] backup failed!"
            print("★[" + endDate + "] " + log)
            print("---------------------------------------------------------------------------")
            return
        mycnf = public.readFile('/etc/my.cnf')
        mycnf = mycnf.replace(subStr, sea)
        if len(mycnf) > 100:
            public.writeFile('/etc/my.cnf', mycnf)
        # 上传
        get = getObject()
        get.filename = filename
        get.filepath = 'backup/database/' + name
        print("Start upload",get.filename,get.filepath)
        self.upload_file(get)
        endDate = time.strftime('%Y/%m/%d %X', time.localtime())
        outTime = time.time() - startTime
        pid = sql.table('databases').where('name=?', (name,)).getField('id')
        download = get.filepath + '/' + os.path.basename(filename)
        sql.table('backup').add('type,name,pid,filename,addtime,size',(1, download, pid, 'gdrive', endDate, os.path.getsize(filename)))
        log = "The database [" + name + "] has been successfully backed up to Google Drive, using [" + str(round(outTime, 2)) + "] seconds"
        public.WriteLog('TYPE_CRON', log)
        print("★[" + endDate + "] " + log)
        print("|---Keep the latest [" + count + "] backups")
        print("|---File name:" + os.path.basename(filename))
        public.ExecShell("rm -f " + filename)
        backups = sql.table('backup').where('type=? and pid=? and filename=?', ('1', pid, 'gdrive')).field(
            'id,name,filename').select()
        num = len(backups) - int(count)
        if num > 0:
            for backup in backups:
                if os.path.exists(backup['filename']):
                    public.ExecShell("rm -f " + backup['filename'])
                # get.filename = 'bt_backup/database/' + name + '/' + backup['name'].split("/")[-1]
                name = self._get_filename(backup['name'].split("/")[-1])
                file_id = self._get_file_id(name)
                try:
                    self._delete_file(file_id)
                except Exception as e:
                    print(e)
                sql.table('backup').where('id=?', (backup['id'],)).delete()
                num -= 1
                print("|---The expired backup file has been cleaned up：" + backup['name'])
                if num < 1: break
        return None

    def backup_path(self, path, count):
        sql = db.Sql()
        startTime = time.time()
        if path[-1:] == '/': path = path[:-1]
        name = os.path.basename(path)
        backup_path = sql.table('config').where("id=?", (1,)).getField('backup_path') + '/path'
        if not os.path.exists(backup_path): os.makedirs(backup_path);
        filename = backup_path + "/Path_" + name + "_" + time.strftime('%Y%m%d_%H%M%S',
                                                                       time.localtime()) + '.tar.gz'
        os.system("cd " + os.path.dirname(path) + " && tar zcvf '" + filename + "' '" + os.path.basename(
            path) + "' > /dev/null")

        get = getObject()
        get.filename = filename
        get.filepath = 'backup/path/' + name
        self.upload_file(get)

        endDate = time.strftime('%Y/%m/%d %X', time.localtime())
        if not os.path.exists(filename):
            log = "Directory [" + path + "] backup failed"
            print("★[" + endDate + "] " + log)
            print("----------------------------------------------------------------------------")
            return

        outTime = time.time() - startTime
        download = get.filepath + '/' + os.path.basename(filename)
        print(name)
        sql.table('backup').add('type,name,filename,addtime,size',('2', download, 'gdrive', endDate, os.path.getsize(filename)))

        log = "The directory [" + path + "] is successfully backed up, using [" + str(round(outTime, 2)) + "] seconds"
        public.WriteLog('TYPE_CRON', log)
        print("★[" + endDate + "] " + log)
        print("|---Keep the latest [" + count + "] backups")
        print("|---File name:" + filename)

        backups = sql.table('backup').where('type=? and filename=?',('2',"gdrive")).field('id,name,filename').select()
        print(backups)

        if os.path.exists(filename): os.remove(filename)

        num = len(backups) - int(count)
        if num > 0:
            for backup in backups:
                if os.path.exists(backup['filename']):
                    public.ExecShell("rm -f " + backup['filename'])
                # get.filename = 'bt_backup/path/' + name + '/' + backup['name'].split("/")[-1]
                # print(get.filename)
                name = self._get_filename(backup['name'].split("/")[-1])
                file_id = self._get_file_id(name)
                try:
                    self._delete_file(file_id)
                except Exception as e:
                    print(e)
                sql.table('backup').where('id=?', (backup['id'],)).delete()
                num -= 1
                print("|---The expired backup file has been cleaned up：" + backup['filename'])
                if num < 1: break
        return None

    def backup_all_site(self, save):
        sites = public.M('sites').field('name').select()
        for site in sites:
            self.backup_site(site['name'], save)

    def backup_all_databases(self, save):
        databases = public.M('databases').field('name').select()
        for database in databases:
            self.backup_database(database['name'], save)

class getObject:
    pass

if __name__ == "__main__":
    import json
    data = None
    q = gdrive_main()
    #getObject.filename = "uploadtest"
    #getObject.filepath = "/tmp/uploadtest"
    # 检查获取验证
    q.set_creds()

    # print(q.check_connect(getObject))
    type = sys.argv[1]
    if type == 'site':
        if sys.argv[2] == 'ALL':
             q.backup_all_site( sys.argv[3])
        else:
            q.backup_site(sys.argv[2], sys.argv[3])
        exit()
    elif type == 'database':
        if sys.argv[2] == 'ALL':
            data = q.backup_all_databases(sys.argv[3])
        else:
            data = q.backup_database(sys.argv[2], sys.argv[3])
        exit()
    elif type == 'path':
        data = q.backup_path(sys.argv[2],sys.argv[3])
    else:
        data = 'ERROR: The parameter is incorrect!'
    print(json.dumps(data))
