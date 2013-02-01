window.HeaderView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var self = this;
        $.ajax({
            url: '/checkAuth',
            type: 'GET',
        }).done(function (data) {
            $(self.el).html(self.template({
                isLoggedIn: data.isLoggedIn
            }));
            return this;
        });
    },

    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});