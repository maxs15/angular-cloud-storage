# angular-cloud-storage

An angular module wrapping cloud storages API

### Cloud storage services supported
Dropbox: Yes  
Google Drive: Not yet
...

## Installation
In your document include this scripts:  
- angular-cloud-storage.js  
- [angular-local-storage](https://github.com/grevory/angular-local-storage) to enable caching support (Optional)  
- Regarding the services you are using:  
 * For dropbox: [dropbox/dropbox-js](https://github.com/dropbox/dropbox-js) and services/dropbox.js  
 
 In your AngularJS app, you'll need to import the angular-cloud-storage module:  
 ```
 angular.module('myApp', ['angular-cloud-storage']);
 ```

## Documentation

### Configuration

##### To use a service and set the configuration
```
$storage.use(serviceName, config)
```
Returns a boolean for success

##### To enable/disable caching using local storage
expireTime: time in seconds before the file cache will expire (120 by default)  
```
$storage.cache(boolean, expireTime)
```
Returns a boolean for success

##### To clear the cache
```
$storage.clearCache()
```
Returns a boolean for success

### Controls
Every method below returns a promise

##### To log in
```
$storage.authenticate()
```   

##### Checks if this client can perform API calls on behalf of a user
```
$storage.isAuthenticated()
```   

##### To log out
```
$storage.signOut()
```

##### To read a file
force_sync: force to read the file (if you are using the cache)
```
$storage.readFile(path, force_sync)
```

##### To write a file
```
$storage.writeFile(path, data)
```

##### To read a directory
```
$storage.readdir(path)
```

##### To remove a file or a directory
```
$storage.remove(path)
```

##### To create a directory
```
$storage.mkdir(path)
```

##### To Move a file or folder to a different location  
```
$storage.move(fromPath, toPath)
```

##### To Copy a file or folder 
```
$storage.copy(fromPath, toPath)
```

## Example
 ```grunt connect ``` to start a webserver and open http://localhost:8080/example in your browser

## Tests
 ```grunt connect ``` to start a webserver and open http://localhost:8080/test/test-runner.html
