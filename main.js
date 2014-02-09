angular.module('test', ['angular-storage'])
.run(function($storage) {
	$storage.use('dropbox', {key: 'k1qze3r66qaw1c1', secret: 'wscgukasiq2pf4d'});
	$storage.auth()
	.then($storage.write('test.txt', 'test').then($storage.read('test.txt').then(function(data) {
		console.log('data = ', data);
	})));
});