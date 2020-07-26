#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
download_Url=https://basoro.id/downloads/slemp
install_tmp='/tmp/slemp_install.pl'
public_file=/opt/slemp/server/panel/script/public.sh
if [ ! -f $public_file ];then
	wget -O $public_file $download_Url/public.sh -T 5;
fi
. $public_file

pluginPath=/opt/slemp/server/panel/plugin/gdrive

Install_GDrive()
{
pip install --upgrade google-api-python-client==1.7.11 google-auth-httplib2==0.0.3 google-auth-oauthlib==0.4.0 cachetools==3.1.1
mkdir -p $pluginPath
echo 'Installing script file...' > $install_tmp
	wget -O /opt/slemp/server/panel/script/backup_gdrive.py $download_Url/plugin/gdrive/gdrive_main.py -T 5
	\cp -a -r /opt/slemp/server/panel/script/backup_gdrive.py /opt/slemp/server/panel/plugin/gdrive/gdrive_main.py
	wget -O /opt/slemp/server/panel/plugin/gdrive/index.html $download_Url/plugin/gdrive/index.html -T 5
	wget -O /opt/slemp/server/panel/plugin/gdrive/info.json $download_Url/plugin/gdrive/info.json -T 5
	wget -O /opt/slemp/server/panel/plugin/gdrive/credentials.json $download_Url/plugin/gdrive/credentials.json -T 5
  	ln -s /opt/slemp/server/panel/plugin/gdrive/credentials.json /root/credentials.json
	wget -O /opt/slemp/server/panel/data/libList.conf $download_Url/lib_gdrive.json -T 5
	wget -O /opt/slemp/server/panel/plugin/gdrive/credentials.json $download_Url/plugin/gdrive/cachetools.zip -T 5
	#rm -rf /usr/lib/python2.7/site-packages/cachetools
	#unzip -o /opt/slemp/server/panel/plugin/gdrive/cachetools.zip /usr/lib/python2.7/site-packages/ > /dev/null
	#rm -rf /opt/slemp/server/panel/plugin/gdrive/cachetools.zip
echo 'The installation is complete' > $install_tmp
}

Uninstall_GDrive()
{
	rm -rf /opt/slemp/server/panel/plugin/gdrive
	rm -f /opt/slemp/server/panel/script/backup_gdrive.py
	echo 'The installation is complete' > $install_tmp
}

action=$1
if [ "${1}" == 'install' ];then
	Install_GDrive
else
	Uninstall_GDrive
fi
