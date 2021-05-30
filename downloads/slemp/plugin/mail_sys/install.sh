#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
install_tmp='/tmp/bt_install.pl'
public_file=/opt/slemp/server/panel/install/public.sh
if [ ! -f $public_file ];then
	wget -O $public_file http://download.bt.cn/install/public.sh -T 5;
fi
. $public_file
download_Url=$NODE_URL
echo 'download url...'
echo $download_Url
pluginPath=/opt/slemp/server/panel/plugin/mail_sys
pluginStaticPath=/opt/slemp/server/panel/plugin/mail_sys/static

cpu_arch=`arch`
if [[ $cpu_arch != "x86_64" ]];then
  echo 'Does not support non-x86 system installation'
  exit 0
fi

systemver=`cat /etc/redhat-release|sed -r 's/.* ([0-9]+)\..*/\1/'`
postfixver=`postconf mail_version|sed -r 's/.* ([0-9\.]+)$/\1/'`

Install_centos7()
{
  if [[ $cpu_arch != "x86_64" ]];then
    echo 'Does not support non-x86 system installation'
    exit 0
  fi

  yum install epel-release -y
  # 卸载系统自带的postfix
  if [[ $cpu_arch = "x86_64" && $postfixver != "3.4.7" ]];then
    yum remove postfix -y
    rm -rf /etc/postfix
  fi
  if [[ ! -f "/usr/sbin/postfix" ]]; then
    yum install postfix -y
    yum install postfix-sqlite -y
  fi
  # 安装dovecot和dovecot-sieve
  yum install dovecot-pigeonhole -y
  if [[ ! -f "/usr/sbin/dovecot" ]]; then
    yum install dovecot -y
  fi
  # 安装opendkim
  if [[ ! -f "/usr/sbin/opendkim" ]]; then
    yum install opendkim -y
  fi
  yum install cyrus-sasl-plain -y
}

Install()
{
  if [ ! -d /opt/slemp/server/panel/plugin/mail_sys ];then
    mkdir -p $pluginPath
    mkdir -p $pluginStaticPath

    Install_centos7
  fi

  # 安装dovecot和dovecot-sieve
  if [ ! -f /etc/dovecot/conf.d/90-sieve.conf ];then
    if [ -f "/usr/bin/apt-get" ];then
      apt install dovecot-sieve -y
    else
      rm -rf /etc/dovecot_back
      cp -a /etc/dovecot /etc/dovecot_back
      yum remove dovecot -y
      yum install dovecot-pigeonhole -y
      if [ ! -f /usr/sbin/dovecot ]; then
        yum install dovecot -y
      fi
      \cp -a /etc/dovecot_back/* /etc/dovecot
      chown -R vmail:dovecot /etc/dovecot
      chmod -R o-rwx /etc/dovecot

      systemctl enable dovecot
      systemctl restart  dovecot
    fi
  fi

  filesize=`ls -l /etc/dovecot/dh.pem | awk '{print $5}'`
  echo $filesize

  if [ ! -f "/etc/dovecot/dh.pem" ] || [ $filesize -lt 300 ]; then
    openssl dhparam 2048 > /etc/dovecot/dh.pem
  fi

  echo 'Installing script file...' > $install_tmp

  wget -O $pluginPath/mail_sys_main.py $download_Url/install/plugin/mail_sys/mail_sys_main.py -T 5
  wget -O $pluginPath/receive_mail.py $download_Url/install/plugin/mail_sys/receive_mail.py -T 5
  wget -O $pluginPath/index.html $download_Url/install/plugin/mail_sys/index.html -T 5
  wget -O $pluginPath/info.json $download_Url/install/plugin/mail_sys/info.json -T 5
  wget -O $pluginStaticPath/api.zip $download_Url/install/plugin/mail_sys/api.zip -T 5
  wget -O /opt/slemp/server/panel/static/ckeditor.zip $download_Url/install/plugin/mail_sys/ckeditor.zip -T 5

  if [ ! -d "/opt/slemp/server/panel/static/ckeditor" ]; then
    unzip /opt/slemp/server/panel/static/ckeditor.zip -d /opt/slemp/server/panel/static
  fi

  echo 'The installation is complete' > $install_tmp
}

#卸载
Uninstall()
{
  yum remove postfix -y
  yum remove dovecot -y
  yum remove opendkim -y
  yum remove dovecot-pigeonhole -y

  rm -rf /etc/postfix
  rm -rf /etc/dovecot
  rm -rf /etc/opendkim

  rm -rf $pluginPath
}

#操作判断
if [ "${1}" == 'install' ];then
  Install
elif [ "${1}" == 'uninstall' ];then
  Uninstall
fi
