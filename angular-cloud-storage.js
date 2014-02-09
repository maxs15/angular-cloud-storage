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
			cache: false
		};

		/**
		* Convert a callback to a promise
		*/
		var promise = function(fn, params, successCallback, errorCallback, array, cached) {
			var deferred = $q.defer();
			var obj = array ? [] : {};
			obj.$resolved = false;
			obj.$promise = deferred.promise;
			obj.$promise.then(successCallback, errorCallback);
			if (!params) params = [];

			var cb = function(err, data) {
				angular.extend(obj, data);
				obj.$resolved = true;
				if (err)
					deferred.reject(err);
				else
					deferred.resolve(data);
				if(window.test) $rootScope.$apply();
			};

			if (cached) {
				cb(null, cached);
			} else {
				params.push(cb);
				fn.apply(null, params);
			}
			return obj;
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
		storage.cache = function(boolean) {
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
		storage.authenticate = function(successCallback, errorCallback) {
			return promise(service.authenticate, [], successCallback, errorCallback);
		};

		/**
	   * @method isAuthenticated
	   * @description Checks if this client can perform API calls on behalf of a user
	   */
		storage.isAuthenticated = function(successCallback, errorCallback) {
			return promise(service.isAuthenticated, [], successCallback, errorCallback);
		};

		/**
	   * @method signOut
	   * @description log out
	   */
		storage.signOut = function(successCallback, errorCallback) {
			return promise(service.signOut, [], successCallback, errorCallback);
		};

		/**
	   * @method readdir
	   * @description read a directory
	   */
		storage.readdir = function(path, successCallback, errorCallback) {
			return promise(service.readdir, [path], successCallback, errorCallback, true);
		};

		/**
	   * @method read
	   * @description read a file
	   */
		storage.readFile = function(path, successCallback, errorCallback) {
			var cached = null;

			if (config.cache) {
				cached = cache.get(path);
			}

			var caching = function(file) {
				if (config.cache) {
					var success = cache.add(file.path, file);
					if (!success) cache.remove(file.path);
				}
				if(successCallback) successCallback(file);
			};

			return promise(service.readFile, [path], caching, errorCallback, false, cached);
		};

		/**
	   * @method write
	   * @description write a file
	   */
		storage.writeFile = function(path, data, successCallback, errorCallback) {

			var caching = function(file) {
				if (config.cache) {
					file.content = data;
					cache.add(file.path, file);
				}
				if(successCallback) successCallback(file);
			};

			return promise(service.writeFile, [path, data], caching, errorCallback);
		};

		/**
	   * @method mkdir
	   * @description To create a directory
	   */
		storage.mkdir = function(path, successCallback, errorCallback) {
			return promise(service.mkdir, [path], successCallback, errorCallback);
		};

		/**
	   * @method remove
	   * @description To remove a file or a directory
	   */
		storage.remove = function(path, successCallback, errorCallback) {
			return promise(service.remove, [path], successCallback, errorCallback);
		};

		/**
	   * @method copy
	   * @description To Copy a file or folder 
	   */
		storage.copy = function(fromPath, toPath, successCallback, errorCallback) {
			return promise(service.remove, [fromPath, toPath], successCallback, errorCallback);
		};

		/**
	   * @method move
	   * @description To Move a file or folder to a different location  
	   */
		storage.move = function(fromPath, toPath, successCallback, errorCallback) {
			return promise(service.move, [fromPath, toPath], successCallback, errorCallback);
		};

		return storage;

	}]);

})();