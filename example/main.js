angular.module('example', ['angular-storage'])
.config(function($locationProvider) {
	$locationProvider.html5Mode(true);
})
.controller('main', function($scope, $storage, $location) {

	$storage.use('dropbox', {key: 'k1qze3r66qaw1c1', secret: 'wscgukasiq2pf4d'});
	var cache = $storage.cache(true);
	$storage.clearCache();
	$scope.files = [];

	$scope.remove = function(file) {
		$storage.remove(file.path, function() {
			for (var i=0;i<$scope.files.length;i++) {
				if ($scope.files[i].path === file.path)
					return $scope.files.splice(i, 1);
			}
		});
	};

	$scope.open = function(file) {
		if (file.is_dir)
			$location.search({dir: file.path});
		else if (file.mime_type === 'text/plain') {
			$storage.readFile(file.path).then(function(file) {
				$scope.file = file;
			});
		}
	};

	$scope.mkdir = function(name) {
		$scope.cdir = "";
		$storage.mkdir(name, function(dir) {
			$scope.files.push(dir);
		});
	};

	$scope.save = function(file) {
		$storage.writeFile(file.path, file.content);
	};

	$scope.login = function() {
		$storage.authenticate().then(function(profile) {
			$scope.profile = profile;
			$scope.refresh();
		});
	};

	$scope.refresh = function() {
		$storage.readdir($scope.directory).then(function(files) {
			$scope.files = files;
		});
	};

	$scope.$watch('directory', function(dirpath) {
		if (!dirpath) return;
		$storage.isAuthenticated().then(function(user) {
			if (user.authenticated)
				$scope.refresh();
			else
				$scope.login();
		});
	});

	$scope.$on('$locationChangeSuccess', function() {
		$scope.directory = $location.$$search.dir || '/';
	});

});