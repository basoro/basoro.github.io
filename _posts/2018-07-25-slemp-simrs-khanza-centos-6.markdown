---
title: "SLEMP SIMRS Khanza Centos 6"
layout: post
date: 2018-07-25 14:13
image: /assets/images/markdown.jpg
headerImage: false
tag:
- linux
- centos
- simrs
- khanza
star: true
category: blog
author: basoro
description: Markdown summary with different options
---

### Simple Linux Nginx MySQL PHP-FPM Untuk Server SIMRS Khanza di Linux Centos 6 Minimal  

Cara penggunaan.

1. Pastikan server anda sudar terinstall Centos 6 Minimal

2. Pastikan server anda terhubung ke internet

3. Login ke server
![screen shot 2018-07-25 at 14 13 14](https://user-images.githubusercontent.com/14934712/43182981-163c818c-9016-11e8-8479-a03021f161c0.png)

4. Update server dengan perintah  
<code>yum -y update</code>
![screen shot 2018-07-25 at 14 14 03](https://user-images.githubusercontent.com/14934712/43182987-1b95bc98-9016-11e8-9bfc-574c5f0757a0.png)

5. Install wget dengan perintah  
<code>yum -y install wget</code>
![screen shot 2018-07-25 at 14 17 39](https://user-images.githubusercontent.com/14934712/43182995-2118261a-9016-11e8-95fd-82adbf97d8be.png)

6. Download scriptnya dengan perintah  
<code>wget https://<i></i>raw.githubusercontent.com/basoro/basoro.github.io/master/_/khanza-slemp.sh</code>
![screen shot 2018-07-25 at 14 18 31](https://user-images.githubusercontent.com/14934712/43183007-2be26dee-9016-11e8-875d-e1a40d2277d0.png)

7. Jalankan instalasi LEMP dan SIMRS Khanza dengan perintah  
<code>sh khanza-slemp.sh</code>
![screen shot 2018-07-25 at 14 24 24](https://user-images.githubusercontent.com/14934712/43183110-7a6f2880-9016-11e8-8e50-fc00be970e19.png)

8. Tunggu sampai instalasi selesai  
![selesai](https://user-images.githubusercontent.com/14934712/43175609-8dfe5926-8ff2-11e8-8675-8982db17eb57.png)

9. Akses panel Simple LEMP Khanza anda di  
<code>http://ipserver:8888</code>  
Username: <code>admin</code>  
Password: <code>nimda</code>  
![login-panel](https://user-images.githubusercontent.com/14934712/43175698-f4f77018-8ff2-11e8-99ea-599ae8a7e94e.png)

10. Tambilan dashboard Simple LEMP Khanza  
![dashboard](https://user-images.githubusercontent.com/14934712/43175942-1ae18394-8ff4-11e8-8c33-d66afa59ce14.png)


Fitur-Fitur:

1. Lightweight LEMP Panel

2. Latest SIMRS Khanza Database, WebApps and Dist Packages

3. Include TinyFileManager to manage Khanza WebApps
![tiny-filemanager](https://user-images.githubusercontent.com/14934712/43175867-c4bb04d6-8ff3-11e8-8446-fe2fcae73173.png)

4. Include PHPMiniMySQLAdmin to manage SIK Database
![miniphpmyadmin](https://user-images.githubusercontent.com/14934712/43175898-eaf5ee4a-8ff3-11e8-9e3b-fe043d1e00b5.png)
