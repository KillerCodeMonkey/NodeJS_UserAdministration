// Backbone.Models
// User model.
window.User = Backbone.Model.extend({
	urlRoot: '/users',
	idAttribute: "_id",

	defaults: {
		isWarn  : 0,
		msg     : '',
		password: '',
		username: '',
		salt	: '',
		_id		: null
	}
});
// User collection.
window.UserList = Backbone.Collection.extend({
	url   : '/users',
	model : User
});