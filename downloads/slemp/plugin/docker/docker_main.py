# coding: utf-8
import sys, os, re
import time

if sys.version_info[0] == 2:
    reload(sys)
    sys.setdefaultencoding('utf-8')
os.chdir('/opt/slemp/server/panel');
sys.path.append("")
import docker, public, json


class docker_main(object):
    __docker = None
    __path = '/opt/slemp/backup/docker/'
    __setupPath = '/opt/slemp/server/panel/docker'

    # 实例化SDK
    def __init__(self):
        if not os.path.exists(self.__path):
            public.ExecShell('mkdir -p %s' % self.__path)
        if not self.__docker: self.__docker = docker.from_env();

    # 判断服务是否正常
    def GetStatus(self, get):
        ret = ''
        try:
            import docker
        except:
            return public.returnMsg(False, '为安装docker模块,解决方法 pip install docker')
        sock = '/var/run/docker.pid'
        if os.path.exists(sock):
            try:
                __docker = docker.from_env()
                aaa = __docker.images
                if aaa:
                    return public.returnMsg(True, '服务正常')
                else:
                    return public.returnMsg(False, 'Docker服务未启动')
            except:
                return public.returnMsg(False, 'Docker服务未启动')
        else:
            return public.returnMsg(False, 'Docker服务未启动')

    # 启动Docker 服务

    def StartDocker(self, get):
        public.ExecShell('systemctl start docker')
        return True

    # 取容器列表
    def GetConList(self, get):
        conList = []
        for con in self.__docker.containers.list(all=True):
            tmp = con.attrs
            tmp['Created'] = self.utc_to_local(tmp['Created'].split('.')[0])
            conList.append(tmp)
        return conList

    # UTCS时间转换为时间戳
    def utc_to_local(self, utc_time_str, utc_format='%Y-%m-%dT%H:%M:%S'):
        import pytz, datetime, time
        local_tz = pytz.timezone('Asia/Jakarta')
        local_format = "%Y-%m-%d %H:%M"
        utc_dt = datetime.datetime.strptime(utc_time_str, utc_format)
        local_dt = utc_dt.replace(tzinfo=pytz.utc).astimezone(local_tz)
        time_str = local_dt.strftime(local_format)
        return int(time.mktime(time.strptime(time_str, local_format)))

    # 创建容器
    def CreateCon(self, get):
        try:
            conObject = self.__docker.containers.run(
                image=get.image,
                mem_limit=get.mem_limit + 'M',
                ports=eval(get.ports.replace('[', '(').replace(']', ')')),
                auto_remove=False,
                command=get.command,
                detach=True,
                stdin_open=True,
                tty=True,
                entrypoint=get.entrypoint,
                privileged=True,
                volumes=json.loads(get.volumes),
                cpu_shares=10
            )
            if conObject:
                # conObject.exec_run('(echo "'+get.ps.strip()+'";sleep 0.1;echo "'+get.ps.strip()+'")|passwd root',privileged = True,stdin = True);
                self.AcceptPort(get)
                return public.returnMsg(True, '创建成功!')

            return public.returnMsg(False, '创建失败!')
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '创建失败!' + str(ex))

    # pull Dockr 官方镜像
    def pull(self, get):
        images = get.images
        if ':' in images:
            pass

        else:
            images = images + ':latest'
        try:
            ret = self.__docker.images.pull(images)
            if ret:
                return public.returnMsg(True, 'pull 成功!')
            else:
                return public.returnMsg(False, '无效地址')
        except:
            ret = public.ExecShell('docker pull %s' % images)
            if 'invalid' in ret[-1]:
                return public.returnMsg(False, '无效地址')
            else:
                return public.returnMsg(False, '无效地址')
            # return public.returnMsg(False, '创建失败!' + str(ex))

    # pull 其他
    def pull_reg(self, get):
        ret = 'not\s?found\n$|invalid|Error'
        path = str(get.path)
        if not path and path == '': return public.returnMsg(False, '无效地址')
        ret2 = public.ExecShell('docker pull %s' % path)
        retur = re.findall(ret, ret2[-1])
        if len(retur) == 0:
            return public.returnMsg(True, 'pull 成功!')
        else:
            return public.returnMsg(False, '无效地址')

    # pull 私有仓库
    def pull_private(self, get):
        user_name = get.user
        user_pass = get.password
        registry = get.registry
        path = get.path
        if not user_name and not user_pass and not path: return public.returnMsg(False, '请输入正确的信息')
        login = self.login_check(user_name=user_name, user_pass=user_pass, registry=registry)
        if login:
            ret = self.pull_reg(get)
            return ret
        else:
            return public.returnMsg(False, '登陆失败')

    # 放行端口
    def AcceptPort(self, get):
        import firewalls
        f = firewalls.firewalls()
        get.ps = 'docker容器的端口'
        for port in json.loads(get.accept):
            get.port = port
            f.AddAcceptPort(get)
        return True

    # 判断端口是否被占用
    def IsPortExists(self, get):
        port=get.port
        ret=self.__check_dst_port(ip='localhost',port=port)
        ret2 = self.__check_dst_port(ip='0.0.0.0', port=port)
        if ret:
            return ret
        if not ret and ret2:
            return ret2
        if not ret and not ret2:
            return False


        # tmp = public.ExecShell("lsof -i -P|grep '" + get.port + "'")
        # if tmp[0]: return True;
        # tmp = public.ExecShell("lsof -i -P|grep '*:" + get.port.split(':')[1] + "'")
        # if tmp[0]: return True;
        # return False


    # 端口检测
    def __check_dst_port(self, ip, port, timeout=3):
        import socket
        ok = True
        try:
            s = socket.socket()
            s.settimeout(timeout)
            s.connect((ip, port))
            s.close()
        except:
            ok = False
        return ok

    # 删除容器
    def RemoveCon(self, get):
        try:
            conFind = self.__docker.containers.get(get.Hostname)
            path_list=conFind.attrs['GraphDriver']['Data']['LowerDir'].split(':')
            for i in path_list:
                os.system('chattr -R -i %s'%i)
            conFind.remove()
            return public.returnMsg(True, '删除成功!')
        except:
            return public.returnMsg(False, '删除失败,请先停止该容器!')

    # 查找容器
    def GetConFind(self, get):
        find = self.__docker.containers.get(get.Hostname)
        if not find: return None;
        return find.attrs

    # 启动容器
    def RunCon(self, get):
        try:
            conFind = self.__docker.containers.get(get.Hostname)
            if not conFind: return public.returnMsg(False, '指定容器不存在!');
            conFind.start()
            return public.returnMsg(True, '启动成功!')
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '启动失败!' + str(ex))

    # 停止容器
    def StopCon(self, get):
        try:
            conFind = self.__docker.containers.get(get.Hostname)
            if not conFind: return public.returnMsg(False, '指定容器不存在!');
            conFind.stop()
            return public.returnMsg(True, '停止成功!')
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '停止失败!' + str(ex))

    # 修改名称
    def ReName(self, get):
        try:
            conFind = self.__docker.containers.get(get.Hostname)
            if not conFind: return public.returnMsg(False, '指定容器不存在!');
            conFind.rename(get.name2)
            return public.returnMsg(True, '修改成功!')
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '修改失败!名称重复')

    # 导出容器为tar 格式
    def export(self, get):
        try:
            file_name = self.__path + get.Hostname + str(time.strftime('%Y%m%d_%H%M%S', time.localtime())) + '.tar'
            public.ExecShell('mkdir -p %s && touch %s' % (self.__path, file_name))
            f = open(file_name, 'wb')
            conFind = self.__docker.containers.get(get.Hostname)
            data = conFind.export()
            for i in data.read():
                f.write(i)
            f.close()
            return public.returnMsg(True, file_name);
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '操作失败: ' + str(ex));

    # image 导出
    def SaveImage(self, get):
        try:
            image = self.__docker.images.get(get.name2)
            data = image.save()
            file_name = self.__path + get.name2 + str(time.strftime('%Y%m%d_%H%M%S', time.localtime())) + '.tar'
            public.ExecShell('docker save  %s -o %s' % (get.name2, file_name))
            return public.returnMsg(True,file_name )
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '请输入正确的镜像')

    # image 导入
    def ExperImage(self, get):
        try:
            image = self.__path + get.imagename
            if not os.path.exists(image):
                return public.returnMsg(False, '文件不存在')
            public.ExecShell('docker load -i %s' % image)
            return public.returnMsg(True, '导入镜像成功!')
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '请输入正确的镜像')

    # 容器执行命令
    def ExecutiveOrder(self, get):
        try:
            conFind = self.__docker.containers.get(get.Hostname)
            cmd = 'docker exec -it %s /bin/bash' % get.Hostname
            return public.returnMsg(True, cmd)
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '连接失败')

    # 登陆验证
    def login_check(self, user_name, user_pass, registry):
        login_test = public.ExecShell('docker login -u=%s -p %s %s' % (user_name, user_pass, registry))
        ret = 'required$|Error'
        ret2 = re.findall(ret, login_test[-1])
        if len(ret2) == 0:
            return True
        else:
            return False

    # 登陆阿里云Docker hub
    def login(self, get):
        '''
        只支持阿里云 docker hub
        :param get:
        :return:
        '''
        user_name = get.user
        user_pass = get.passwd
        registry = get.registry
        hub_name = get.hub_name
        namespace = get.namespace
        if not user_pass and not user_pass and not registry and not hub_name and not namespace: return public.returnMsg(
            False, '请填写好正确信息')
        ret2 = self.login_check(user_name, user_pass, registry)
        if ret2:
            ret = {}
            ret['user_name'] = user_name
            ret['user_pass'] = user_pass
            ret['registry'] = registry
            ret['hub_name'] = hub_name
            ret['namespace'] = namespace
            public.writeFile(self.__setupPath + '/user.json', json.dumps(ret))

            return public.returnMsg(True, '登陆成功')
        else:
            return public.returnMsg(False, '登陆失败')

    # push 到仓库中
    def push(self, get):
        version = get.version
        imageid = get.imageid
        relist = self.__setupPath + '/user.json'
        if os.path.exists(relist):
            user_info = json.loads(public.readFile(relist))
            registry = self.chekc(user_info['registry'])
            hub_name = self.chekc(user_info['hub_name'])
            namespace = self.chekc(user_info['namespace'])
            user_name = user_info['user_name']
            user_pass = user_info['user_pass']
            if not user_name and user_pass and not registry and not hub_name and not namespace: public.returnMsg(False,
                                                                                                                 '信息验证失败')
            ret2 = self.login_check(user_name, user_pass, registry)
            if ret2:
                aa = 'docker tag %s %s/%s/%s:%s' % (imageid, registry, hub_name, namespace, version)
                push_imgae = public.ExecShell(
                    'docker tag %s %s/%s/%s:%s' % (imageid, registry, namespace, hub_name, version))
                txt = self.__setupPath + '/log.txt'
                push = public.ExecShell('docker push %s/%s/%s:%s ' % (registry, namespace, hub_name, version))

                ret = 'exist'
                rec = re.findall(ret, push[-1])
                if len(rec) == 0:
                    return public.returnMsg(True, 'Push 成功')
                else:
                    return public.returnMsg(False, 'Push 失败')
            else:
                return public.returnMsg(False, '登陆失败')
        else:
            return public.returnMsg(False, '请登陆')

    # 判断最后一个是否是/
    def chekc(self, string):
        strings = str(string)
        if strings == '': return False
        if strings[-1] == '/': return strings[0:-1]
        return strings

        # 重启容器

    def RestartCon(self, get):
        try:
            conFind = self.__docker.containers.get(get.Hostname)
            if not conFind: return public.returnMsg(False, '指定容器不存在!');
            conFind.restart()
            return public.returnMsg(True, '重启成功!')
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '重启成功!' + str(ex))

    # 登陆状态
    def GetUser(self, get):
        relist = self.__setupPath + '/user.json'
        if os.path.exists(relist):
            user_info = json.loads(public.readFile(relist))
            if ['user_name']:
                return public.returnMsg(True, user_info)
            else:
                return public.returnMsg(False, '未登陆')
        else:
            return public.returnMsg(False, '未登陆')

    # 内存配额
    def MemLimit(self, get):
        pass

    # CPU配额
    def CpuLimit(self, get):
        pass

    # 添加磁盘
    def AddDisk(self, get):
        pass

    # 绑定磁盘
    def BindingDisk(self, get):
        pass

    # 取创建依赖
    def GetCreateInfo(self, get):
        import psutil
        data = {}
        data['images'] = self.GetImageList(None)
        data['memSize'] = psutil.virtual_memory().total / 1024 / 1024
        data['iplist'] = self.GetIPList(None)
        return data

    # 取IP列表
    def GetIPList(self, get):
        ipConf = '/opt/slemp/server/panel/docker/iplist.json'
        if not os.path.exists(ipConf): return [];
        iplist = json.loads(public.readFile(ipConf))
        return iplist

    # 添加IP
    def AddIP(self, get):
        ipConf = '/opt/slemp/server/panel/docker/iplist.json'
        if not os.path.exists(ipConf):
            iplist = []
            public.writeFile(ipConf, json.dumps(iplist))

        iplist = json.loads(public.readFile(ipConf))
        ipInfo = {'address': get.address, 'netmask': get.netmask, 'gateway': get.gateway}
        iplist.append(ipInfo)
        public.writeFile(ipConf, json.dumps(iplist))
        return public.returnMsg(True, '添加成功!')

    # 删除IP
    def DelIP(self, get):
        ipConf = '/opt/slemp/server/panel/docker/iplist.json'
        if not os.path.exists(ipConf): return public.returnMsg(False, '指定IP不存在!')
        iplist = json.loads(public.readFile(ipConf))
        newList = []
        for ipInfo in iplist:
            if ipInfo['address'] == get.address: continue;
            newList.append(ipInfo)
        public.writeFile(ipConf, json.dumps(newList))
        return public.returnMsg(True, '删除成功!')

    # 生成快照
    def Snapshot(self, get):
        try:
            ConObject = self.GetConFind(get.Hostname)
            ConObject.commit(repository=get.imageName, tag=get.tag, message=get.message, author=get.author,
                             changes=get.chenges)
            return public.returnMsg(True, '操作成功!')
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '操作失败: ' + str(ex))

    # 制作镜像
    def CommitCon(self, get):
        try:
            # conFind = self.__docker.containers.get(get.Hostname)
            conFind = self.__docker.containers.get(get.Hostname)
            conFind.commit(repository=get.imageName, tag=get.tag, message=get.message, author=get.author,
                           changes=get.chenges);
            return public.returnMsg(True, '操作成功!');
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '操作失败: ' + str(ex));

    # 取镜像列表
    def GetImageList(self, get):
        imageList = []
        for image in self.__docker.images.list():
            tmp_attrs = image.attrs
            if len(tmp_attrs['RepoTags']) == 1:
                tmp_image = {}
                tmp_image['Id'] = tmp_attrs['Id'].split(':')[1][:12]
                tmp_image['RepoTags'] = tmp_attrs['RepoTags'][0]
                tmp_image['Size'] = tmp_attrs['Size']
                tmp_image['Labels'] = tmp_attrs['Config']['Labels']
                tmp_image['Comment'] = tmp_attrs['Comment']
                tmp_image['Created']=self.utc_to_local(tmp_attrs['Created'].split('.')[0])
                imageList.append(tmp_image)
            else:
                for i in range(len(tmp_attrs['RepoTags'])):
                    tmp_image = {}
                    tmp_image['Id'] = tmp_attrs['Id'].split(':')[1][:12]
                    tmp_image['RepoTags'] = tmp_attrs['RepoTags'][i]
                    tmp_image['Size'] = tmp_attrs['Size']
                    tmp_image['Labels'] = tmp_attrs['Config']['Labels']
                    tmp_image['Comment'] = tmp_attrs['Comment']
                    tmp_image['Created'] = self.utc_to_local(tmp_attrs['Created'].split('.')[0])
                    imageList.append(tmp_image)
        imageList = sorted(imageList, key=lambda x: x['Created'], reverse=True)
        return imageList

    # 删除镜像
    def RemoveImage(self, get):
        try:
            conFind = self.__docker.images.remove(get.imageId);
            return public.returnMsg(True, '删除成功!');
        except docker.errors.APIError as ex:
            return public.returnMsg(False, '删除失败,该镜像当前正在被使用!');

    # 用户管理页面
    def UserAdmin(self, get):
        return public.readFile('/opt/slemp/server/panel/docker/userdocker.html');

    # 用户登陆
    def UserLogin(self, get):
        return public.readFile('/opt/slemp/server/panel/docker/login-docker.html');
