import os
os.chdir("/opt/slemp/server/panel")
import public, re, psutil, json
try:
    import urllib2
except:
    import urllib as urllib2
class dns_manager_main(object):
    def __init__(self):
        self.net_path = "/etc/sysconfig/network-scripts/"
        self.config = "/opt/slemp/server/panel/plugin/dns_manager/config.json"
        self.path = "/opt/slemp/server/panel/plugin/dns_manager/"
        self.dns_conf_path = "/var/named/chroot"
        self.zone_file = self.dns_conf_path + "/etc/named.rfc1912.zones"
        if self.dns_server_check() == "pdns":
            self._pdns_compatible()

    def __check_pubilc_ip(self):
        try:
            url = 'http://pv.sohu.com/cityjson?ie=utf-8'
            opener = urllib2.urlopen(url,timeout=3)
            m_str = opener.read()
            ip_address = re.search('\d+.\d+.\d+.\d+', m_str).group(0)
            c_ip = public.check_ip(ip_address)
            if not c_ip:
                a, e = public.ExecShell("curl ifconfig.me")
                return a
            return ip_address
        except:
            filename = '/opt/slemp/server/panel/data/iplist.txt'
            ip_address = public.readFile(filename).strip()
            if ip_address:
                return ip_address
            else:
                return False

    def __check_card(self,ip):
        net_info = psutil.net_if_addrs()
        if net_info:
            for card in net_info.values():
                if ip == card[0].address:
                    return {"ip": True}

    def __get_sub_card_name(self):
        net_card = {}
        net_info = psutil.net_if_addrs()
        for card in net_info.keys():
            card_name_list = ["eth","ens","em"]
            for i in card_name_list:
                if i in card:
                    sub_card = "{}:0".format(card)
                    net_card["sub_card"] = sub_card
                    net_card["card"] = card
                    return net_card

    def __back_card(self):
        net_card = self.__get_sub_card_name()
        source = self.net_path + "ifcfg-" + net_card["card"]
        target = source + "_bak"
        public.ExecShell("cp {0} {1}".format(source, target))

    def __restore_card(self):
        net_card = self.__get_sub_card_name()
        sub_card = self.net_path + "ifcfg-" + net_card["sub_card"]
        source = self.net_path + "ifcfg-" + net_card["card"]
        target = source + "_bak"
        public.ExecShell("rm -f {0} && ifdown {1}".format(sub_card, net_card["sub_card"]))
        public.ExecShell("rm -f {0} && mv {1} {0}".format(source, target))
        public.ExecShell("ifdown {0} && ifup {0}".format(net_card["card"]))

    def __create_subcard(self,ip):
        self.__back_card()
        net_card = self.__get_sub_card_name()
        sub_card = net_card["sub_card"]
        if sub_card:
            content = """DEVICE={0}
IPADDR={1}
NETMASK=255.255.255.0
ONBOOT=yes
"""
            content = content.format(sub_card, ip)
            sub_card_path = self.net_path + "ifcfg-" + sub_card
            public.writeFile(sub_card_path, content)
            public.ExecShell("ifup {}".format(sub_card))
        if not self.__check_net_work():
            self.__restore_card()
            return public.returnMsg(False, "Failed to create a self-network card, please contact the official staff")
        return public.returnMsg(True, "Success")

    def get_can_listen_ip(self,get):
        public_ip = self.__check_pubilc_ip()
        net_info = psutil.net_if_addrs()
        addr = []
        for i in net_info.values():
            if i[0].address == "127.0.0.1":
                continue
            addr.append(i[0].address)
        if not public_ip in addr:
            addr.append(public_ip)
        addr.append('any')
        return addr

    def set_listen_ip(self,get):
        values = self.__check_give_vaule(get)
        if "listen_ip" not in values:
            return public.returnMsg(False, "Please enter listen ip")
        ip = values["listen_ip"]
        if ip != "any" and not self.__check_card(ip):
            result = self.__create_subcard(ip)
            if not result["status"]:
                return result
        conffile = self.dns_conf_path+"/etc/named.conf"
        self.__back_file(conffile)
        conf = public.readFile(conffile)
        rep = "\d+\s+\{\s*([\w\.]+)"
        if ":" in ip:
            rep = "\d+\s+\{\s*([\w\:]+)"
        new_conf = re.sub(rep,"53 { "+values["listen_ip"],conf)
        public.writeFile(conffile,new_conf)
        cc = self.__check_conf()
        if cc:
            self.__restore_file(conffile)
            return public.returnMsg(False, "Configuration failed "+ str(cc))
        config = self.__read_config(self.config)
        config["listen_ip"] = ip
        self.__write_config(self.config,config)
        public.ExecShell("systemctl restart named-chroot")
        return public.returnMsg(True, "Configuration successful")

    def __get_listen_ip(self):
        config = self.__read_config(self.config)
        if not config["listen_ip"]:
            return self.__check_pubilc_ip()
        return config["listen_ip"]

    def __check_net_work(self):
        urlList = ["http://www.baidu.com", "http://www.google.com"]
        for url in urlList:
            try:
                if os.path.exists('/opt/slemp/server/panel/pyenv'):
            	    import requests
            	    opener = requests.get(url)
            	    opener.text
                else:
                    opener = urllib2.urlopen(url)
                    opener.read()
                return True
            except:
                return False

    def __create_dns_resolve(self, values):
        domain = values["domain"]
        ip = self.__get_listen_ip()
        if str(ip) == "any":
            ip = self.__check_pubilc_ip()
        type = "A"
        if ":" in ip:
            type = "AAAA"
        if not values['soa']:
            values['soa'] = "ns1." + domain
        resolve_file = "{0}/var/named/{1}.zone".format(self.dns_conf_path, domain)
        resolve_conf = """$TTL 86400
{0}.      IN SOA  {4}.     admin.{0}. (
                                        0       ; serial
                                        7200      ; refresh
                                        3600      ; retry
                                        1209600      ; expire
                                        180 )    ; minimum
{3}
{0}.            600     IN      {2}        {1}
{0}.            600     IN      MX 10      mail.{0}.
{0}.            600     IN      CAA        0 issue "letsencrypt.org"
www             600     IN      {2}        {1}
mail            600     IN      {2}        {1}
ns1             600     IN      {2}        {1}
ns2             600     IN      {2}        {1}
""".format(domain, ip, type,values["nsservers"],values['soa'])
        public.writeFile(resolve_file, resolve_conf)
        self.__back_file(resolve_file, act="def")
        return True

    def __check_domain_resolve(self, domain, host="",type="A",value=None):
        import dns.resolver
        ip = self.__get_listen_ip()
        if str(ip) == "any":
            ip = self.__check_pubilc_ip()
        if self.dns_server_check() == "pdns":
            ip = "127.0.0.1"
        my_resolver = dns.resolver.Resolver()
        my_resolver.nameservers = [ip]
        if host:
            domain = host+"."+domain
        try:
            l = []
            a = my_resolver.query(domain, type)
            for i in a.response.answer:
                for j in i.items:
                    l.append(str(j))
            if not value:
                return l
            for i in l:
                if type == 'CAA':
                    if value['ca_domain_name'] in i:
                        return l
                    l.pop()
                    if not l:
                        return False
                if value['value'] in i:
                    return l
        except:
            return False

    def __check_domain_exist(self,domain):
        config = self.__read_config(self.config)
        for i in config["domain"]:
            if i == domain:
                return True

    def __read_config(self, path):
        if not os.path.exists(path) or not public.readFile(path):
                public.writeFile(path, json.dumps({"domain":[],"listen_ip":""}))
        upBody = public.readFile(path)
        return json.loads(upBody)

    def __write_config(self ,path, data):
        public.writeFile(path, json.dumps(data))

    def _make_ns_record(self,values):
        if not (values["ns1domain"] or values["ns2domain"]):
            values["nsservers"] = """
{0}.            86400   IN      NS         ns1.{0}.
{0}.            86400   IN      NS         ns2.{0}.""".format(values["domain"])
        else:
            values["nsservers"] = """
{0}.            86400   IN      NS         {1}.
{0}.            86400   IN      NS         {2}.""".format(values["domain"], values["ns1domain"],
                                                                  values["ns2domain"])
    def _check_bind_conf(self,domain):
        cc = self.__check_conf()
        if cc:
            self.__restore_file(self.zone_file)
            resolve_file = "{0}/var/named/{1}.zone".format(self.dns_conf_path, domain)
            if os.path.exists(resolve_file):
                os.remove(resolve_file)
            return public.returnMsg(False, "Add domain name failed2 " + str(cc))
        public.ExecShell("systemctl restart named-chroot")

    def add_domain(self, get):
        self.__release_port(get)
        values = self.__check_give_vaule(get)
        if "status" in values.keys():
            return values
        self._make_ns_record(values)
        domain = values["domain"]
        if self.__check_domain_exist(domain):
            return public.returnMsg(False, "Domain name already exists")
        zone_config = """
zone "%s" IN {
        type master;
        file "/var/named/chroot/var/named/%s.zone";
        allow-update { none; };
};
""" % (domain, domain)
        self.__back_file(self.zone_file)
        public.writeFile(self.zone_file,zone_config)
        if self.__create_dns_resolve(values):
            if self.dns_server_check() == 'bind':
                self._check_bind_conf(domain)
            else:
                public.ExecShell('systemctl restart pdns')
            if self.__check_domain_resolve(domain):
                config = self.__read_config(self.config)
                config["domain"].append(domain)
                self.__write_config(self.config, config)
                public.WriteLog('DNS', 'Add domain name [' + domain + '] successful')
                return public.returnMsg(True, "Add domain name successfully")
        public.WriteLog('DNS', 'Add domain name [' + domain + '] failed')
        self.__restore_file(self.zone_file)
        return public.returnMsg(False, "Add domain name failed1")

    def get_domain_list(self, get):
        config = self.__read_config(self.config)
        if config["domain"]:
            return public.returnMsg(True, config["domain"])
        if not self.__get_listen_ip():
            return "0"
        return public.returnMsg(True, config["domain"])

    def __delete_zone(self,domain):
        zone_conf = public.readFile(self.zone_file)
        reg = '\n*zone\s+"%s"(.|\n)+"%s.+\n\s+allow.+\n};\n*' % (domain,domain)
        zone_conf = re.sub(reg,"",zone_conf)
        public.writeFile(self.zone_file,zone_conf)

    def delete_domain(self, get):
        values = self.__check_give_vaule(get)
        if "status" in values.keys():
            return values
        domain = values["domain"]
        config = self.__read_config(self.config)
        if domain in config["domain"]:
            config["domain"].remove(domain)
            self.__write_config(self.config,config)
            resolve_file = "{0}/var/named/{1}.zone".format(self.dns_conf_path, domain)
            r_l = [resolve_file,resolve_file+"_bak",resolve_file + "_def"]
            for i in r_l:
                if os.path.exists(i):
                    os.remove(i)
            self.__delete_zone(domain)
            public.ExecShell("systemctl restart named-chroot")
            public.WriteLog('DNS', 'Delete domain name [' + domain + '] successful')
            return public.returnMsg(True, "Delete domain name successful")

    def __check_resolve_exist(self,zone_file,values):
        v = values.copy()
        if "id" in v:
            id = v["id"]
        else:
            id = ""
        if v["act"] == "modify" and id:
            old_conf = self.__read_config(self.path+"tmp")
            old_conf = old_conf[str(id)]
            if "MX" in old_conf:
                v["host"] = old_conf[0]
                v["ttl"] = old_conf[1]
                v["type"] = old_conf[2]
                v["mx_priority"] = old_conf[3]
                v["value"] = old_conf[4]
            else:
                v["host"] = old_conf[0]
                v["ttl"] = old_conf[1]
                v["type"] = old_conf[2]
                v["value"] = old_conf[3]
        if v["act"] != "add":
            if '"' in v["value"]:
                v["value"] = '"{}"'.format(v["value"].replace('"',""))
        if v["host"] == "*":
            v["host"] = "\*"
        with open(zone_file) as f:
            for i in f.readlines():
                value = v["value"]
                for f in ["$","?","+","^","*","(",")"]:
                    value = value.replace(f,'\\'+f)

                if v["type"] == "MX":
                    rep = "{host}\s+{ttl}\s+IN\s+{type}\s+{mx_priority}\s+{value}".format(host=v["host"], type=v["type"],
                                                                                          mx_priority=v["mx_priority"],
                                                                                          ttl=v["ttl"], value=v["value"])
                elif v['type'] == 'CAA':
                    rep = "{host}\s+{ttl}\s+IN\s+{type}\s+{flags}\s+{tag}\s+{ca_domain_name}\"*".format(host=v["host"],
                        type=v["type"],ttl=v["ttl"],flags=v["flags"],tag=v['tag'],ca_domain_name=v['ca_domain_name'])
                else:
                    rep = "{host}\s+{ttl}\s+IN\s+{type}\s+\"*{value}\"*".format(host=v["host"], type=v["type"],
                                                                                ttl=v["ttl"],
                                                                                value=value)
                public.writeFile('/tmp/2',str(rep))
                result = re.search(rep, i)
                if result:
                    return result

    def __back_file(self, file, act=None):
        file_type = "_bak"
        if act:
            file_type = "_def"
        public.ExecShell("/usr/bin/cp -p {0} {1}".format(file, file + file_type))

    def __restore_file(self, file, act=None):
        file_type = "_bak"
        if act:
            file_type = "_def"
        public.ExecShell("/usr/bin/cp -p {1} {0}".format(file, file + file_type))

    def __check_conf(self):
        a, e = public.ExecShell("/usr/sbin/named-checkconf -t /var/named/chroot -z")
        c = re.search("(error|failed|missing)", a)
        if c or e:
            return [a,e]

    def __edit_resolve_file(self, zone_file, act, values):
        if values["type"] == "MX":
            add_resolve = "{host}\t{ttl}\tIN\t{type}\t{mx_priority}\t{value}\n".format(host=values["host"], type=values["type"],mx_priority=values["mx_priority"],ttl=values["ttl"], value=values["value"])
        elif values["type"] == "CAA":
            add_resolve = "{host}\t{ttl}\tIN\t{type}\t{flags} {tag} {ca_domain_name}\n".format(host=values["host"], type=values["type"],
                                                                        ttl=values["ttl"], flags=values["flags"],tag=values['tag'],
                                                                                              ca_domain_name =values['ca_domain_name'])
        else:
            add_resolve = "{host}\t{ttl}\tIN\t{type}\t{value}\n".format(host=values["host"], type=values["type"],
                                                                        ttl=values["ttl"], value=values["value"])

        result = self.__check_resolve_exist(zone_file, values)
        zone_conf = public.readFile(zone_file)
        if act == "add" and result:
            return True
        self.__back_file(zone_file)
        if act == "add" and not result:
            public.writeFile(zone_file, add_resolve)
        if act == "delete" and result:
            tmp = zone_conf.replace(result.group(0),"")
            new_conf = ""
            for i in tmp.splitlines():
                if i:
                    new_conf += i+"\n"
            public.writeFile(zone_file, new_conf)
        if act == "modify" and result:
            tmp = zone_conf.replace(result.group(0), add_resolve[:-1])
            public.writeFile(zone_file, tmp)
        if self.__check_conf() and self.dns_server_check() != "pdns":
            self.__restore_file(zone_file)
            return True

    def act_resolve(self, get):
        values = self.__check_give_vaule(get)
        if "status" in values.keys():
            return values
        domain = values["domain"]
        act = values["act"]
        d = {"delete":"Delete","add":"Add","modify":"Modify"}
        zone_dir = "/var/named/chroot/var/named/"
        # zone_files = os.listdir(zone_dir)
        get_file = domain + ".zone"
        # for i in zone_files:
        #     if get_file == i:
        zone_file = zone_dir+get_file
        if not self.__edit_resolve_file(zone_file, act, values):
            self._dnssever_restart()
            v = values["host"]
            if v == "@" or v == domain + ".":
                v = ""
            if values["type"] != "NS":
                if not self.__check_domain_resolve(domain, host=v,type=values["type"],value=values) and values["act"] == "delete":
                    public.WriteLog('DNS', '{0} resolve {1} successful'.format(domain, d[act]))
                    return public.returnMsg(True, '{0} successful'.format(d[act]))
                elif self.__check_domain_resolve(domain, host=v,type=values["type"],value=values) and values["act"] != "delete":
                    public.WriteLog('DNS', '{0} resolve {1} successful'.format(domain, d[act]))
                    return public.returnMsg(True, '{0} successful'.format(d[act]))
                else:
                    return public.returnMsg(False, '{0} Fail'.format(d[act]))
            else:
                public.WriteLog('DNS', '{0} resolve {1} successful'.format(domain, d[act]))
                return public.returnMsg(True, '{0} successful'.format(d[act]))
        public.WriteLog('DNS', 'resolve {0} failed, please check if the hostname already exists'.format(domain,d[act]))
        return public.returnMsg(False, '{0} failed, please check if the hostname already exists'.format(d[act]))

    def __change_json(self, data):
        conf_json = {}
        n = 0
        for i in data.splitlines():
            if "MX" in i:
                rep = "([\w\.\*\-\_]+|@)\s+(\d+)\s+\w+\s+(\w+)\s+(\w+)\s+([\w\.\"]+.*)"
            elif 'CAA' in i:
                rep = "([\w\.\*\-\_]+|@)\s+(\d+)\s+\w+\s+(\w+)\s+(\d+)\s+(\w+)\s+\"([\w\.\"]+.*)\""
            else:
                rep = "([\w\.\*\-\_]+|@)\s+(\d+)\s+\w+\s+(\w+)\s+([\w\.\"]+.*)"

            result = re.search(rep, i)
            if result:
                if "MX" in i:
                    result_list = [result.group(1), result.group(2), result.group(3), result.group(4), result.group(5)]
                elif 'CAA' in i:
                    result_list = [result.group(1), result.group(2), result.group(3), result.group(4)+' '+result.group(5)+' '+result.group(6)]
                else:
                    result_list = [result.group(1),result.group(2),result.group(3),result.group(4)]
                conf_json[str(n)] = result_list
                n += 1
        public.writeFile(self.path+"tmp",json.dumps(conf_json))
        return conf_json

    def get_resolve(self,get):
        values = self.__check_give_vaule(get)
        if "status" in values.keys():
            return values
        domain = values["domain"]
        zone_dir = "/var/named/chroot/var/named/"
        # zone_files = os.listdir(zone_dir)
        get_file = domain + ".zone"
        # for i in zone_files:
        #     if get_file == i:
        zone_file = zone_dir+get_file
        if os.path.exists(zone_file):
            zone_conf = public.readFile(zone_file)
            return self.__change_json(zone_conf)

    def restore_def_resolve(self, get):
        values = self.__check_give_vaule(get)
        domain = values["domain"]
        resolve_file = "{0}/var/named/{1}.zone".format(self.dns_conf_path, domain)
        self.__restore_file(resolve_file, act="def")
        public.WriteLog('DNS', 'Restore default parsing success')
        public.ExecShell("systemctl restart named-chroot")
        return public.returnMsg(True, "Successful recovery")

    def get_logs(self, get):
        import page
        page = page.Page()
        count = public.M('logs').where('type=?', (u'DNS',)).count()
        limit = 10
        info = {}
        info['count'] = count
        info['row'] = limit
        info['p'] = 1
        if hasattr(get, 'p'):
            info['p'] = int(get['p'])
        info['uri'] = get
        info['return_js'] = ''
        if hasattr(get, 'tojs'):
            info['return_js'] = get.tojs
        data = {}

        data['page'] = page.GetPage(info, '1,2,3,4,5,8')
        data['data'] = public.M('logs').where('type=?', (u'DNS',)).order('id desc').limit(
            str(page.SHIFT) + ',' + str(page.ROW)).field('log,addtime').select()
        return data

    def clearup_logs(self,get):
        public.M('logs').where('type=?', (u'DNS',)).delete()
        return public.returnMsg(True, "Clean up successfully")

    def get_service_status(self,get):
        sh = "ps aux|grep named|grep -v 'grep'"
        if self.dns_server_check() == 'pdns':
            sh = 'ps aux|grep pdns|grep -v "grep"'
        a,e = public.ExecShell(sh)
        if (a):
            return True
        else:
            return False

    def stop_service(self,get):
        import time
        services = 'named-chroot'
        if self.dns_server_check() == 'pdns':
            services = 'pdns'
        public.ExecShell("systemctl stop {}".format(services))
        time.sleep(1)
        if self.get_service_status(get):
            public.ExecShell("pkill -9 named")
        if self.get_service_status(get):
            return public.returnMsg(False, "Stop service failed")
        return public.returnMsg(True, "Stop service successfully")

    def start_service(self,get):
        if not self.get_service_status(get):
            services = 'named-chroot'
            if self.dns_server_check() == 'pdns':
                services = 'pdns'
            public.ExecShell("systemctl start {}".format(services))
            if not self.get_service_status(get):
                return public.returnMsg(False, "Stop service failed")
            return public.returnMsg(True, "Start service successfully")
        return public.returnMsg(False, "Service has started, no need to start")

    def __first_check(self):
        if public.readFile(self.path+"first.txt"):
            return True
        public.writeFile(self.path+"first.txt","1")

    def __release_port(self,get):
        try:
            import firewalls
            port = ["53", "953"]
            for p in port:
                access_port = public.M('firewall').where("port=?", (p,)).count()
                if int(access_port) > 0:
                    continue
                get.port = p
                get.ps = 'DNS'
                firewalls.firewalls().AddAcceptPort(get)
            return port
        except:
            return False

    def export_data(self,get):
        """
        e_type        all/specific domain
        :param get:
        :return:
        """
        import time
        export_time = time.strftime("%Y%m%d%H%M", time.localtime())
        file_name = "{}export_{}.json".format(self.path,export_time)
        if get.e_type == "all":
            data = json.dumps(self._get_all_domain_data(get))
        else:
            data = json.dumps(self._get_specific_domain_data(get))
        public.writeFile(file_name, data)
        return public.returnMsg(True,file_name)

    def _get_all_domain_data(self,get):
        domain_list = self.get_domain_list(get)["msg"]
        data = {}
        for d in domain_list:
            get.domain = d
            data[d] = self.get_resolve(get)
        return data

    def _get_specific_domain_data(self,get):
        domain = get.e_type
        get.domain = domain
        return {domain:self.get_resolve(get)}

    def import_data(self,get):
        import files

        f = files.files()
        get.f_path = self.path
        result = f.upload(get)
        return result

    def import_data2(self,get):
        config = self.__read_config(self.config)
        domain_list = self.get_domain_list(get)["msg"]
        data = public.readFile(self.path + get.f_name)
        if not data:
            return public.returnMsg(False, "Import file is empty or import failed")
        data = json.loads(data)
        logfile = "{}import.log".format(self.path)
        public.writeFile(logfile,"")
        for i in data:
            if i in domain_list:
                public.writeFile(logfile,"Domain name already exists, skip {} import\n".format(i))
                continue
            self._make_resolve_content(i,data[i])
            config["domain"].append(i)
            public.writeFile(logfile, "Successfully imported {}\n".format(i))
        self.__write_config(self.config,config)
        self._dnssever_restart()
        return public.returnMsg(True,"Successfully imported")

    def _make_resolve_content(self,domain,data):
        resolve_file = "{0}/var/named/{1}.zone".format(self.dns_conf_path, domain)
        # resolve_file = "/tmp/{}.zone".format(i)
        resolve_conf = """$TTL 1D
{0}.      IN SOA  f1g1ns1.dnspod.net.     admin.{0}. (
                                        0       ; serial
                                        1D      ; refresh
                                        1H      ; retry
                                        1W      ; expire
                                        3H )    ; minimum
""".format(domain)
        for d in data.values():
            add_resolve = "{host}\t{ttl}\tIN\t{type}\t{value}\n".format(host=d[0], type=d[2], ttl=d[1],value=d[3])
            if "MX" in d:
                add_resolve = "{host}\t{ttl}\tIN\t{type}\t{mx_priority}\t{value}\n".format(host=d[0], type=d[2],mx_priority=d[3],ttl=d[1], value=d[4])
            resolve_conf += add_resolve
        named_strs = """

zone "%s" IN {
        type master;
        file "%s.zone";
        allow-update { none; };
};""" % (domain, domain)
        public.writeFile(resolve_file,resolve_conf)
        public.writeFile(self.zone_file,named_strs)


    def dns_server_check(self,get=None):
        server = 'bind'
        if os.path.exists('/usr/sbin/pdns_server'):
            server = 'pdns'
        return server

    def _pdns_compatible(self):
        reg = 'file\s+"/var.*'
        conf = public.readFile(self.zone_file)
        if re.search(reg,conf):
            return
        conf = conf.replace('file "','file "/var/named/chroot/var/named/')
        public.writeFile(self.zone_file,conf)
        public.ExecShell('systemctl restart pdns')

    def _dnssever_restart(self):
        services = 'named-chroot'
        if self.dns_server_check() == 'pdns':
            services = 'pdns'
        public.ExecShell("systemctl restart {}".format(services))

    def get_soa_record(self,get):
        values = self.__check_give_vaule(get)
        if "status" in values.keys():
            return values
        domain = values["domain"]
        zone_dir = "/var/named/chroot/var/named/"
        get_file = domain + ".zone"
        zone_file = zone_dir+get_file
        zone_conf = public.readFile(zone_file)
        return self._soa_process(zone_conf)

    def _soa_process(self,conf):
        data = []
        soa_reg = '[\w\.]+\s+IN\s+SOA\s+([\w\.]+)\s+([\w\.]+)'
        soa_tmp = re.search(soa_reg,conf)
        if not soa_tmp:
            return False
        result = soa_tmp.groups()
        data.append({'name':'ns_server','tips':'name server','content':result[0]})
        data.append({'name':'admin_mail','tips':'dns admin email','content':result[1]})
        serial = {'name':'serial','reg':'\s+(\d+)\s*;\s*serial','tips':'zone file version'}
        refresh = {'name':'refresh','reg':'\s+(\w+)\s*;\s*refresh','tips':'How often to check the serial number on the master server'}
        retry = {'name':'retry','reg':'\s+(\w+)\s*;\s*retry','tips':'The interval time when the slave server reconnects to the master server'}
        expire = {'name':'expire','reg':'\s+(\w+)\s*;\s*expire','tips':'When the time exceeds the number of seconds set by Expire and the slave server cannot get in touch with the master, the slave will delete its copy.'}
        minimum = {'name':'minimum','reg':'\s+(\w+)\s*\)\s*;\s*minimum','tips':'Represents the default TTL value of all records in this zone file'}
        for i in [serial,refresh,retry,expire,minimum]:
            tmp = re.search(i['reg'],conf)
            if not tmp:
                return False
            i['content'] = tmp.group(1)
            data.append(i)
        return data

    def set_soa_record(self,get):
        values = self.__check_give_vaule(get)
        zone_dir = "/var/named/chroot/var/named/"
        get_file = values['domain'] + ".zone"
        zone_file = zone_dir+get_file
        zone_conf = public.readFile(zone_file)
        new_conf = '''{d}.      IN SOA  {ns}     {email} (
                                        {serial}       ; serial
                                        {refresh}      ; refresh
                                        {retry}      ; retry
                                        {expire}      ; expire
                                        {minimum} )    ; minimum'''.format(
        d=values['domain'],ns=values['ns_server'],email=values['admin_mail'],serial=values['serial'],
        refresh=values['refresh'],retry=values['retry'],expire=values['expire'],minimum=values['minimum'])
        soa_reg = '{}\.(\n|.)+;\s*minimum'.format(values['domain'])
        zone_conf = re.sub(soa_reg,new_conf,zone_conf)
        public.writeFile(zone_file,zone_conf)
        self._dnssever_restart()
        return public.returnMsg(True,'Setup Successfully')


    def __check_give_vaule(self, get):
        values = {}
        rep_ip = "^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$"
        rep_ipv6 = "^\s*((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){6}(:|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|(:[0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}:){5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}){0,1}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}){0,2}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}){0,3}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:)(:[0-9A-Fa-f]{1,4}){0,4}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(:(:[0-9A-Fa-f]{1,4}){0,5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?\s*$"
        rep_host = "^[a-zA-Z0-9\_]+\-{0,1}\_{0,1}[a-zA-Z0-9\_]*$"
        rep_domain_point = "^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.$"
        rep_domain = "^(?=^.{3,255}$)[a-zA-Z0-9\_\-][a-zA-Z0-9\_\-]{0,62}(\.[a-zA-Z0-9\_\-][a-zA-Z0-9\_\-]{0,62})+$"
        soa_reg = '\d+\w?'
        if hasattr(get,'ns_server'):
            if re.search(rep_domain_point, get.ns_server):
                values["ns_server"] = str(get.ns_server)
            else:
                return public.returnMsg(False, "Please check if the SOA name server domain name format is correct")
        if hasattr(get,'admin_mail'):
            if re.search(rep_domain_point, get.admin_mail):
                values["admin_mail"] = str(get.admin_mail)
            else:
                return public.returnMsg(False, "Please check if the dns admin email format is correct")
        if hasattr(get,'serial'):
            if re.search(soa_reg, get.serial):
                values["serial"] = str(get.serial)
            else:
                return public.returnMsg(False, "Please check if the serial format is correct")
        if hasattr(get,'refresh'):
            if re.search(soa_reg, get.refresh):
                values["refresh"] = str(get.refresh)
            else:
                return public.returnMsg(False, "Please check if the refresh format is correct")
        if hasattr(get,'retry'):
            if re.search(soa_reg, get.retry):
                values["retry"] = str(get.retry)
            else:
                return public.returnMsg(False, "Please check if the retry format is correct")
        if hasattr(get,'expire'):
            if re.search(soa_reg, get.expire):
                values["expire"] = str(get.expire)
            else:
                return public.returnMsg(False, "Please check if the expire format is correct")
        if hasattr(get,'minimum'):
            if re.search(soa_reg, get.minimum):
                values["minimum"] = str(get.minimum)
            else:
                return public.returnMsg(False, "Please check if the minimum format is correct")
        if hasattr(get,"ns1domain"):
            if not get.ns1domain:
                values["ns1domain"] = None
            else:
                if re.search(rep_domain,get.ns1domain):
                    values["ns1domain"] = str(get.ns1domain)
                else:
                    return public.returnMsg(False, "Please check if the NS1 domain name format is correct")
        if hasattr(get,"ns2domain"):
            if not get.ns2domain:
                values["ns2domain"] = None
            else:
                if re.search(rep_domain,get.ns2domain):
                    values["ns2domain"] = str(get.ns2domain)
                else:
                    return public.returnMsg(False, "Please check if the NS2 domain name format is correct")

        if hasattr(get,"soa"):
            if not get.soa:
                values["soa"] = None
            else:
                if re.search(rep_domain,get.soa):
                    values["soa"] = str(get.soa)
                else:
                    return public.returnMsg(False, "Please check if the soa format is correct")

        if hasattr(get, "id"):
            values["id"] = int(get.id)
        if hasattr(get, "domain"):
            if re.search(rep_domain, get.domain):
                values["domain"] = str(get.domain)
            else:
                return public.returnMsg(False, "Please check if the domain name format is correct")
        if hasattr(get, "host"):
            if re.search(rep_domain, get.host):
                values["host"] = str(get.host)
            elif re.search(rep_host, get.host):
                values["host"] = str(get.host)
            elif re.search(rep_domain_point, get.host):
                values["host"] = str(get.host)
            elif get.host == "@":
                values["host"] = str(get.host)
            elif get.host == "*":
                values["host"] = str(get.host)
            else:
                return public.returnMsg(False, "Please check if the host name format is correct.")
        if hasattr(get, "type"):
            rep = "(NS|A|CNAME|MX|TXT|AAAA|SRV)"
            if re.search(rep, get.type):
                values["type"] = str(get.type)
            else:
                return public.returnMsg(False, "Please check if the parsing type format is correct.")
        if hasattr(get, "ttl"):
            try:
                values["ttl"] = int(get.ttl)
            except:
                return public.returnMsg(False, "Please check if the TTL value format is correct.")
        if hasattr(get, "mx_priority"):
            try:
                values["mx_priority"] = int(get.mx_priority)
            except:
                return public.returnMsg(False, "Please check if the MX priority format is correct.")
        if hasattr(get, "act"):
            l = ["delete", "add", "modify"]
            if get.act in l:
                values["act"] = get.act
            else:
                return public.returnMsg(False, "Please check if the operation type format is correct.")
        if hasattr(get,"listen_ip"):
            if re.search(rep_ip,get.listen_ip) or re.search(rep_ipv6,get.listen_ip) or get.listen_ip == "any":
                values["listen_ip"] = get.listen_ip
            else:
                return public.returnMsg(False, "Please check if the IP address format is correct.")
        if hasattr(get, "value"):
            try:
                if values["type"] == "A":
                    if re.search(rep_ip, get.value):
                        values["value"] = str(get.value)
                if values["type"] == "NS":
                    if re.search(rep_ip, get.value):
                        values["value"] = str(get.value)+"."
                    if re.search(rep_domain, get.value):
                        values["value"] = str(get.value) + "."
                    if re.search(rep_domain_point, get.value):
                        values["value"] = str(get.value)
                    if re.search(rep_host, get.value):
                        values["value"] = str(get.value) + "."
                if values["type"] == "CNAME":
                    if re.search(rep_domain_point, get.value):
                        values["value"] = str(get.value)
                    if re.search(rep_domain, get.value):
                        values["value"] = str(get.value) + "."
                if values["type"] == "MX":
                    if re.search(rep_domain_point, get.value):
                        values["value"] = str(get.value)
                    if re.search(rep_domain, get.value):
                        values["value"] = str(get.value) + "."
                    if re.search(rep_ip, get.value):
                        values["value"] = str(get.value)+ "."
                if values["type"] == "TXT":
                    values["value"] = str(get.value) if '"' == get.value[0] else str('"'+get.value+'"')
                if values["type"] == "AAAA":
                    if re.search(rep_ipv6, get.value):
                        values["value"] = str(get.value)
                if values["type"] == "SRV":
                    values["value"] = str(get.value)
                if values["type"] == "CAA":
                    values["flags"] = str(get.flags)
                    values["tag"] = str(get.tag)
                    values["ca_domain_name"] = str(get.ca_domain_name) if '"' in get.ca_domain_name else str('"'+get.ca_domain_name+'"')
                    values["value"] = ''
                if "value" not in values: return public.returnMsg(False, "Please check if the record value format is correct")
            except:
                return public.returnMsg(False, "Please check if the record value format is correct")
        return values
