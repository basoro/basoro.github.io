var Common = {

    /**
     * ajax submit
     * @param url
     * @param data
     */
    ajaxSubmit: function (element, inPopup, url,success,fail, done) {
        lightyear.loading('show');
        $.ajax({
            type: 'post',
            url: url,
            data: $(element).parents("form").serialize(),
            dataType: "json",
            success: function response(result) {
                if (result.code == 1) {
                    lightyear.loading('hide');
                    lightyear.notify(result.message||"Success", 'success', 1000);
                    if (typeof success == "function"){
                        success();
                    }
                } else {
                    lightyear.loading('hide');
                    lightyear.notify(result.message||"Fail", 'danger', 1000);
                    if (typeof fail == "function"){
                        fail();
                    }
                }
                if (typeof done == "function"){
                    done();
                }
                if (result.redirect.url) {
                    var u=result.redirect.url;
                    if(u=="?"){
                        u=location.href
                    }
                    var sleepTime = result.redirect.sleep || 2000;
                    setTimeout(function () {
                        if (inPopup) {
                            parent.location.href = u;
                        } else {
                            location.href = u;
                        }
                    }, sleepTime);
                }
            },
            error: function error(result) {
                lightyear.loading('hide');
                lightyear.notify(result.message, 'danger', 1000);
            },
        });
    },

    ajaxAddSubmit: function (element, inPopup, url) {
        lightyear.loading('show');
        $.ajax({
            type: 'post',
            url: url,
            data: $(element).parents("form").serialize(),
            dataType: "json",
            success: function response(result) {
                if (result.code == 1) {
                    lightyear.loading('hide');
                    $.alert({
                        title: "Success",
                        content: "Added Success",
                        buttons: {
                            confirm: {
                                text: 'Continue',
                                btnClass: 'btn-primary',
                                action: function () {
                                    location.reload()
                                }
                            },
                            cancel: {
                                text: 'Back',
                                action: function () {
                                    if (inPopup) {
                                        parent.location.href = result.redirect.url;
                                    } else {
                                        location.href = result.redirect.url;
                                    }
                                }
                            }
                        }
                    });

                } else {
                    lightyear.loading('hide');
                    lightyear.notify(result.message, 'danger', 1000);
                }
            },
            error: function error(result) {
                lightyear.loading('hide');
                lightyear.notify(result.message, 'danger', 1000);
            },
        });
    },
}
