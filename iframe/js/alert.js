Alert = {
    confirm: function (title, content, url) {
        $.alert({
            title: title,
            content: content,
            buttons: {
                confirm: {
                    text: 'Confirm',
                    btnClass: 'btn-primary',
                    action: function () {
                        Common.ajaxSubmit(null, false, url, null, null, null)
                    }
                },
                cancel: {
                    text: 'Cancel',
                    action: function () {

                    }
                }
            }
        });
    },

}
