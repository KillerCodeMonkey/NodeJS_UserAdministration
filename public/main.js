//Backbone.Router
var AppRouter = Backbone.Router.extend({
    // Route-conditions.
    routes: {
        'home'      : 'showHome',
        'login'     : 'showLogin',
        'logout'    : 'doLogout',
        'register'  : 'showRegistration',
        'users'     : 'showUserList',
        'users/:id' : 'showUser'
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    showHome: function () {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        this.headerView.render();
        this.headerView.selectMenuItem('home-menu');
        $('#content').html(this.homeView.el);
    },

    showLogin: function () {
        $('#content').html((new LoginView()).el);
        this.headerView.selectMenuItem('login-menu');
    },

    doLogout: function () {
        location.href = '/logout';
        this.headerView.render();
        this.headerView.selectMenuItem('login-menu');
    },

    showRegistration: function () {
        $('#content').html((new RegistrationView()).el);
        this.headerView.selectMenuItem('register-menu');
    },

    showUserList: function () {
        var userListModel = new UserList();
        userListModel.fetch({
            success: function() {
                $("#content").html(new UserListView({model: userListModel}).el);
            }
        });
        this.headerView.selectMenuItem('userlist-menu');
    },

    showUser: function () {
        var userModel = new User();
        if(!this.userView) {
            this.userView = new UserView({
                model: userModel
            });
        }
        $('#content').html(this.userListView.el);
    }
});
// Load template for each Backbone.View.
utils.loadTemplate(['HomeView', 'LoginView', 'RegistrationView', 'UserListItemView', 'UserView', 'HeaderView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});