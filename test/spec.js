window.test = true;

describe('angular-storage', function () {
	var $storage = null;
	var $rootScope = null;

	var fail = function(done) {
		return function() {
			expect(true).toBe(false);
			done();
		};
	};

	beforeEach(module('angular-storage'));

	beforeEach(inject(function(_$storage_, _$rootScope_) {
		$storage = _$storage_;
		$rootScope = _$rootScope_;
		$storage.use('dropbox', {key: 'k1qze3r66qaw1c1', secret: 'wscgukasiq2pf4d'});
		$storage.authenticate();
	}));

	it('should read a directory', function(done){
		$storage.readdir('/', function(files) {
			expect(files).toBeDefined();
			done();
		}, fail(done));
	});

	it('should write a file', function(done){
		$storage.writeFile('/test1.txt', 'test', function(file) {
			expect(file.name).toEqual('test1.txt');
			done();
		}, fail(done));
	});

	it('should read a file', function(done){
		$storage.readFile('/test1.txt', function(file) {
			expect(file.content).toEqual('test');
			done();
		}, fail(done));
	});

	it('should remove a file', function(done){
		$storage.remove('/test1.txt', function(file) {
			done();
		}, fail(done));
	});

	it('should create a directory', function(done){
		$storage.mkdir('test2', function(dir) {
			expect(dir.name).toEqual('test2');
			done();
		}, fail(done));
	});

	it('should remove a directory', function(done){
		$storage.remove('/test2', function(file) {
			done();
		}, fail(done));
	});

	// At the end
	it('should sign out', function(done){
		$storage.signOut(function() {
			done();
		}, fail(done));
	});

});