;

jQuery( function() {
    $("body").on('click','[data-stopPropagation]',function (e) {
        e.stopPropagation();
    });

    // æ»šåŠ¨æ¡
    const ps = new PerfectScrollbar('.lyear-layout-sidebar-scroll', {
		swipeEasing: false,
		suppressScrollX: true
	});

    // ä¾§è¾¹æ 
    $(".lyear-aside-toggler").bind('click', function(){
        $('.lyear-layout-sidebar').toggleClass('lyear-aside-open');
        $("body").toggleClass('lyear-layout-sidebar-close');

        if ($('.lyear-mask-modal').length == 0) {
            $('<div class="lyear-mask-modal"></div>').prependTo('body');
        } else {
            $( '.lyear-mask-modal' ).remove();
        }
        $('.lyear-mask-modal').on( 'click', function() {
            $( this ).remove();
        	$('.lyear-layout-sidebar').toggleClass('lyear-aside-open');
            $('body').toggleClass('lyear-layout-sidebar-close');
        });
    });

	$( '.nav-item-has-subnav > a' ).on( 'click', function() {
		$subnavToggle = jQuery( this );
		$navHasSubnav = $subnavToggle.parent();
        $topHasSubNav = $subnavToggle.parents('.nav-item-has-subnav').last();
		$subnav       = $navHasSubnav.find('.nav-subnav').first();
        $viSubHeight  = $navHasSubnav.siblings().find('.nav-subnav:visible').outerHeight();
        $scrollBox    = $('.lyear-layout-sidebar-scroll');
		$navHasSubnav.siblings().find('.nav-subnav:visible').slideUp(500).parent().removeClass('open');
		$subnav.slideToggle( 300, function() {
			$navHasSubnav.toggleClass( 'open' );

			var scrollHeight  = 0;
			    pervTotal     = $topHasSubNav.prevAll().length,
			    boxHeight     = $scrollBox.outerHeight(),
		        innerHeight   = $('.sidebar-main').outerHeight(),
                thisScroll    = $scrollBox.scrollTop(),
                thisSubHeight = $(this).outerHeight(),
                footHeight    = 121;

			if (footHeight + innerHeight - boxHeight >= (pervTotal * 48)) {
			    scrollHeight = pervTotal * 48;
			}
            if ($subnavToggle.parents('.nav-item-has-subnav').length == 1) {
                $scrollBox.animate({scrollTop: scrollHeight}, 300);
            } else {
                // å­èœå•æ“ä½œ
                if (typeof($viSubHeight) != 'undefined' && $viSubHeight != null) {
                    scrollHeight = thisScroll + thisSubHeight - $viSubHeight;
                    $scrollBox.animate({scrollTop: scrollHeight}, 300);
                } else {
                    if ((thisScroll + boxHeight - $scrollBox[0].scrollHeight) == 0) {
                        scrollHeight = thisScroll - thisSubHeight;
                        $scrollBox.animate({scrollTop: scrollHeight}, 300);
                    }
                }
            }
		});
	});

	setTheme = function(input_name, data_name) {
	    $("input[name='"+input_name+"']").click(function(){
	        $('body').attr(data_name, $(this).val());
	    });
	}
  setTheme('site_theme', 'data-theme');
	setTheme('logo_bg', 'data-logobg');
	setTheme('header_bg', 'data-headerbg');
	setTheme('sidebar_bg', 'data-sidebarbg');

    // é€‰é¡¹å¡
    $('#iframe-content').multitabs({
        iframe : true,
        nav: {
            backgroundColor: '#ffffff',
            maxTabs : 35, // é€‰é¡¹å¡æœ€å¤§å€¼
        },
        init : [{
            type : 'main',
            title : 'Dashboard',
            url : 'dashboard.html'
        }]
    });

    $('.nav-item .multitabs').bind('click', function(){
        $('.nav-item').removeClass('active');
        $('.nav-subnav li').removeClass('active');
        $(this).parent('li').addClass('active');
        $(this).parents('.nav-item-has-subnav').addClass('open').first().addClass('active');
        var text=$(this).text().trim();
        var tab=$('a.mt-nav-tab:contains('+text+')')
        var index=tab.attr("data-index");
        var url=tab.attr("data-url");
        //console.log(index,url)
        var iframe=$("#multitabs_info_"+index)[0];
        if (iframe){
            iframe.src = url;
        }
    });
    $("#iframe-content").delegate("li","dblclick",function(){
        var tab=$(this).find("a")
        var index=tab.attr("data-index");
        //var url=tab.attr("data-url");
        //console.log(index,url)
        var iframe=$("#multitabs_info_"+index)[0]||$("#multitabs_main_"+index)[0];
        if (iframe){
            iframe.contentWindow.location.reload()
        }
    });
    if(parent!=self){
        parent.location=location;
    }
 });
