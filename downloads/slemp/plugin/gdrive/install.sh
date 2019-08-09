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
pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
mkdir -p $pluginPath
echo 'Installing script file...' > $install_tmp
	wget -O /opt/slemp/server/panel/script/backup_gdrive.py $download_Url/plugin/gdrive/gdrive_main.py -T 5
	wget -O /opt/slemp/server/plugin/gdrive/gdrive_main.py $download_Url/plugin/gdrive/gdrive_main.py -T 5
	wget -O /opt/slemp/server/panel/plugin/gdrive/index.html $download_Url/plugin/gdrive/index.html -T 5
	wget -O /opt/slemp/server/panel/plugin/gdrive/info.json $download_Url/plugin/gdrive/info.json -T 5
	wget -O /opt/slemp/server/panel/plugin/gdrive/credentials.json $download_Url/plugin/gdrive/credentials.json -T 5
  ln -s /opt/slemp/server/panel/plugin/gdrive/credentials.json /root/credentials.json

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
