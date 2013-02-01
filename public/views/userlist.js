window.UserListView = Backbone.View.extend({

	initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }
    
});

window.UserListItemView = Backbone.View.extend({

    
});