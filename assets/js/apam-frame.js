  ;(function(){
    // init search
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

    // Docs scroll spy
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
