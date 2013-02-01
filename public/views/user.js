// Backbone.Views.
// UserView.
window.UserView = Backbone.View.extend({

    initialize:function () {
        this.model.on('change', this.render, this);
        this.render();
    },

    render:function () {
        this.$el.html(this.template({
            isWarn : this.model.get('isWarn'),
            msg    : this.model.get('msg')
        }));
        return this;
    }
    
});

// UserListView
window.UserListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var self  = this,
            users = self.model.models;

        $(self.el).html('<ul class="thumbnails"></ul>');
        $.each(users, function (i, value) {
            $('.thumbnails', self.el).append(new UserListItemView({ model: value }).render().el); 
        });

        return self;
    }
});

window.UserListItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

// LoginView
window.LoginView = Backbone.View.extend({

	events: {
        'click #submitLogin' : 'login'
    },

	initialize:function () {
        this.render({isWarn:0, msg:''});
    },

    render:function (isWarn, msg) {
        this.$el.html(this.template({
            isWarn : isWarn,
            msg    : msg
        }));
        return this;
    },

    login: function () {
        var self = this;
        $.ajax({
            url: '/login',
            type: 'POST',
            data: {
                username : this.$('#login').val(),
                password : this.$('#password').val()
            }
        }).done(function(data) {
            if(data.isWarn)
                self.render(data.isWarn, data.msg);
            else {
                app.navigate('home', true);
            }
        });
    }
    
});

// RegistrationView.
window.RegistrationView = Backbone.View.extend({

    events: {
        'click #submitRegister' : 'register'
    },

    initialize:function () {
        this.render();
    },

    render:function (isWarn, msg) {
        this.$el.html(this.template({
            isWarn : isWarn,
            msg    : msg
        }));
        return this;
    },

    register: function () {
        var pw       = this.$('#password').val(),
            pw2      = this.$('#password2').val(),
            username = this.$('#login').val(),
            self     = this;

        if(pw != pw2) {
            self.render(1, 'Passwords not equal!');
        } else {
            $.ajax({
                url: '/register',
                type: 'POST',
                data: {
                    username: username,
                    password: pw
                }
            }).done(function(data) {
                if(data.isWarn)
                    self.render(data.isWarn, data.msg);
                else {
                    app.navigate('login', true);
                }
            });
        }
    }
    
});