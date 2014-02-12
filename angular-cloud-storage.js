(function() {

	var deps = [];
	var localstorage = null;
	try {
		localstorage = angular.module("LocalStorageModule");
		deps.push('LocalStorageModule');
	} catch (e) {}

	angular.module('angular-storage', deps)
	.service('$storage', ['$injector', '$q', '$rootScope', function($injector, $q, $rootScope) {

		var service = null;
		var cache = null;
		var storage = {};
		var config = {
			cache: false,
			expireTime: 120, // In seconds
		};

		/**
		* Convert a callback to a promise
		*/
		var promise = function(fn, params, cached) {
			var deferred = $q.defer();
			if (!params) params = [];

			var cb = function(err, data) {
				if (err)
					deferred.reject(err);
				else
					deferred.resolve(data);
				if(window.test) $rootScope.$apply(); // For tests purpose
			};

			if (cached) {
				cb(null, cached);
			} else {
				params.push(cb);
				fn.apply(null, params);
			}
			return deferred.promise;
		};

		/**
	   * @method write
	   * @description specify which service to use ('dropbox', 'gdrive' ...) and configure it
	   */
		storage.use = function(sname, config) {
			var name = sname.charAt(0).toUpperCase() + sname.slice(1);
			if ($injector.has('$storage' + name)) {
				service = $injector.get('$storage' + name);
				this.configure(config);
				return true;
			}
			return false;
		};

		/**
	   * @method configure
	   * @description enable/disable caching using local storage
	   */
		storage.cache = function(boolean, expireTime) {
			if (expireTime) config.expireTime = expireTime;
			if (boolean === false)
				return config.cache = false;
			if (localstorage) {
				cache = $injector.get('localStorageService');
				if (!cache.isSupported)
					boolean = false
			}
			else
				boolean = false; 
			config.cache = boolean;
			return boolean;
		};

		/**
	   * @method clearCache
	   * @description clear all the localStorage cache
	   */
		storage.clearCache = function() {
			if (config.cache && cache)
				return cache.clearAll();
			return false;
		};

		/**
	   * @method configure
	   * @description configure the service
	   */
		storage.configure = function(config) {
			if (!service || !config) return false;
			return service.configure(config);
		};

		/**
	   * @method auth
	   * @description log in
	   */
		storage.authenticate = function() {
			return promise(service.authenticate, []);
		};

		/**
	   * @method isAuthenticated
	   * @description Checks if this client can perform API calls on behalf of a user
	   */
		storage.isAuthenticated = function() {
			return promise(service.isAuthenticated, []);
		};

		/**
	   * @method signOut
	   * @description log out
	   */
		storage.signOut = function() {
			return promise(service.signOut, []);
		};

		/**
	   * @method readdir
	   * @description read a directory
	   */
		storage.readdir = function(path) {
			return promise(service.readdir, [path]);
		};

		/**
	   * @method read
	   * @description read a file
	   */
		storage.readFile = function(path, force_sync) {
			var cached = null;

			if (config.cache && !force_sync) {
				cached = cache.get(path);
				if (cached) {
					/* Checking expiration */
					var currentDate = new Date().getTime();
					var secondsBetween = Math.abs((currentDate - cached.lastSynced) / 1000);
					if (secondsBetween > config.expireTime)
						cached = null;
				}
			}

			var pr = promise(service.readFile, [path], cached);
			pr.then(function(file) {
				if (config.cache) {
					file.lastSynced = new Date().getTime();
					var success = cache.add(file.path, file);
					if (!success) cache.remove(file.path);
				}
			});
			return pr;
		};

		/**
	   * @method write
	   * @description write a file
	   */
		storage.writeFile = function(path, data) {

			var pr = promise(service.writeFile, [path, data]);
			pr.then(function(file) {
				if (config.cache) {
					file.content = data;
					file.lastSynced = new Date().getTime();
					cache.add(file.path, file);
				}
			});
			return pr;
		};

		/**
	   * @method mkdir
	   * @description To create a directory
	   */
		storage.mkdir = function(path) {
			return promise(service.mkdir, [path]);
		};

		/**
	   * @method remove
	   * @description To remove a file or a directory
	   */
		storage.remove = function(path) {
			return promise(service.remove, [path]);
		};

		/**
	   * @method copy
	   * @description To Copy a file or folder 
	   */
		storage.copy = function(fromPath, toPath) {
			return promise(service.remove, [fromPath, toPath]);
		};

		/**
	   * @method move
	   * @description To Move a file or folder to a different location  
	   */
		storage.move = function(fromPath, toPath) {
			return promise(service.move, [fromPath, toPath]);
		};

		return storage;

	}]);

})();