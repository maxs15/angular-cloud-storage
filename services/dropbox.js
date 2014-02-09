angular.module('angular-storage')
.factory('$storageDropbox', function($q, $http) {

	var storage = {};
	var client = new Dropbox.Client({key: 'xxx', secret:'xxx', sandbox: true});

	storage.configure = function(options) {
		return client.setCredentials(options);
	};

	storage.authenticate = function(cb) {
		client.authenticate({interactive: true}, function(err, client) {
			if (err) return cb(err, client)
			client.getUserInfo(cb);
		})
	};

	storage.signOut = function(cb) {
		try {
			client.signOut(cb);
		} catch(e) {
			cb(e);
		}
	};

	storage.isAuthenticated = function(cb) {
		var err = client.isAuthenticated();
		cb(null, {authenticated: err});
	};

	storage.writeFile = function(filename, data, cb) {
		client.writeFile(filename, data, cb);
	};

	storage.readFile = function(filepath, cb) {
		client.readFile(filepath, function(err, data, stat) {
			if (stat)
				stat.content = data;
			cb(err, stat);
		});
	};

	storage.readdir = function(path, cb) {
		if (!path || typeof(path) !== 'string')
			return cb('Cannot use the given filepath');
		client.readdir(path, function(err, names, stat) {
			if (err) return cb(err);
			var files = stat._json.contents;
			for (var i=0;i<names.length;i++)
				files[i].name = names[i];
			cb(null, files);
		});
	};

	storage.mkdir = function(path, cb) {
		client.mkdir(path, cb);
	};

	storage.remove = function(filepath, cb) {
		if (!filepath || typeof(filepath) !== 'string')
			return cb('Cannot use the given filepath');
		client.remove(filepath, cb);
	};

	storage.copy = function(fromPath, toPath, cb) {
		client.copy(fromPath, toPath, cb);
	};

	storage.move = function(fromPath, toPath, cb) {
		client.move(fromPath, toPath, cb);
	};

	return storage;

});