---
title: ":floppy_disk: APAM Barabai"
layout: post
commentIssueId: 15 
date: 2018-11-20 14:13
tag:
- android
- centos
- simrs
- khanza
#star: true
image: /assets/images/logo-app.png
headerImage: true
projects: true
hidden: true # don't count this post in blog pagination
description: "Aplikasi Mobile untuk pasien rawat jalan SIMRS Khanza versi 2"
category: project
author: basoro
externalLink: false
---

### Aplikasi Mobile SIMRS Khanza Versi 2

Aplikasi Hybrid dengan menggunakan Cordova Phonegap. Untuk cara instalasi silahkan merujuk kesitus resmi YASKI <a href="https://yaski.or.id/detailpost/instalasi-apam-online-simrs-khanza" target="_blank">disini</a>.

APAM Barabai adalah Aplikasi Pasien dan Aduan Masyarakat Barabai. Aplikasi yang diperuntukan bagi pasien yang ingin mendaftar online di Rumah Sakit. Syaratnya SIMRS yang digunakan adalah SIMRS Khanza. Silahkan merujuk <a href="https://basoro.id/simrs-khanza/">kesini</a> untuk keterangan lebih lanjut. 


<!--<img src="/assets/images/apam-barabai.png" style="display:block;margin-left:auto;margin-right:auto;" alt="APAM Barabai" />-->

<style>

</style>
      <div class="docs-demo-device docs-demo-device-ios">
        <div class="docs-demo-device-buttons"><a class="active" data-theme="ios">iOS</a><a data-theme="md">Android</a></div>
        <div class="docs-demo-device-iframe">
          <iframe width="320" height="548" frameborder="0" scrolling="on"></iframe>
          <div class="fade-overlay"></div>
        </div>
        <div class="docs-demo-device-android-buttons">
          <div class="triangle"></div>
          <div class="circle"></div>
          <div class="square"></div>
        </div>
      </div>
      <div class="docs-content">
        <div class="with-device" style="height:100vh !important;">
          <h2 data-device-preview="http://basoro.io/apam/index.html"></h2>
        </div>
      </div>
  <script src="//cdn.framework7.io/js/jquery-1.11.0.min.js"></script>
  <script>
  ;(function(){
    $('.theme-switch a').click(function (e) {
      if ($(this).hasClass('active')) {
        return;
      }
      e.preventDefault();
      var url = $(this).attr('href');
      $('header .phone iframe').attr('src', url);
      $('.theme-switch a').toggleClass('active');
      $('header .phone').toggleClass('phone-android');
      $('header .phone .fullscreen').attr('href', url);
    });

    var demoDevicePreviewLink;
    function handleDeviceScroll() {
      var st = $(window).scrollTop();
      var firstPreviewPosition = $('[data-device-preview]:first').offset().top;
      var device = $('.docs-demo-device:not(.docs-inline-device)');
      device.addClass('visible');
      var deviceStartOffset = device.parent().offset().top;
      var devicePosition = st - deviceStartOffset;
      if(devicePosition < firstPreviewPosition - deviceStartOffset) {
        devicePosition = firstPreviewPosition -  deviceStartOffset;
      }
      if (devicePosition + device.outerHeight() > device.parent().outerHeight()) {
        devicePosition = device.parent().outerHeight() - device.outerHeight();
      }
      var stopPosition;
      if ($('.stop-scroll-device').length > 0) {
        stopPosition = $('.stop-scroll-device').offset().top;
      } else {
        stopPosition = $('.docs-content .with-device').offset().top + $('.docs-content .with-device').outerHeight();
      }
      if (stopPosition) {
        if (devicePosition + device.outerHeight() > stopPosition - deviceStartOffset) {
          devicePosition = stopPosition - device.outerHeight() - deviceStartOffset;
        }
      }
      device.css({top: devicePosition});
      var newPreviewLink;
      $('[data-device-preview]').each(function(){
        var link = $(this);
        if (link.offset().top < st + $(window).height()/2 - 200) {
          newPreviewLink = link.attr('data-device-preview');
        }
      });
      if (!newPreviewLink) newPreviewLink = $('[data-device-preview]:first').attr('data-device-preview');
      if (newPreviewLink !== demoDevicePreviewLink) {
        demoDevicePreviewLink = newPreviewLink;
        device.find('.fade-overlay').addClass('visible');
        var onLoadTriggerd;
        device.find('iframe')[0].onload = function() {
          onLoadTriggerd = true;
          setTimeout(function () {
            device.find('.fade-overlay').removeClass('visible');
          }, 0);
        };
        setTimeout(function () {
          if (!onLoadTriggerd) {
            device.find('.fade-overlay').removeClass('visible');
          }
        }, 1000);
        device.find('iframe').attr('src', newPreviewLink);
      }
    }
    if ($('.docs-content .with-device').length > 0) {
      $(window).resize(function(){
        handleDeviceScroll();
      });
      $(window).scroll(function(){
        handleDeviceScroll();
      });
      handleDeviceScroll();
    }
    if ($('.docs-demo-device').length > 0) {
      $('.docs-demo-device-buttons a').on('click', function (e) {
        e.preventDefault();
        var a = $(this);
        if (a.hasClass('active')) return;
        a.parent().find('.active').removeClass('active');
        a.addClass('active');
        var device = a.parents('.docs-demo-device');
        var theme = a.attr('data-theme');
        var src = device.find('iframe').attr('src');
        device.find('.fade-overlay').addClass('visible');
        device
          .removeClass('docs-demo-device-ios docs-demo-device-android')
          .addClass('docs-demo-device-' + (theme === 'md' ? 'android' : 'ios'));
        device.find('iframe').attr('src', src.split('?')[0] + '?theme=' + theme);
        setTimeout(function () {
          device.find('.fade-overlay').removeClass('visible');
        }, 1000);
      });
    }

    })();
  </script>

Silahkan download source code dibawah ini.

<h3>Last releases<span class="total-downloads"></span></h3>
<table class="table-downloads">
  <thead>
    <tr>
      <th>Release</th>
      <th>Size</th>
      <th class="none">Count</th>
      <th class="none">Date</th>
      <th class="none">Days</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.js"></script>
<script src="/assets/js/apam-barabai.js"></script>
