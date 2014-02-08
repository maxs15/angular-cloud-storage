# angular-storage

An angular module wrapping storages API

### Storage services supported
Dropbox: Yes  
Google Drive: Not yet  
...

## Installation
In your document include this scripts:  
- angular-storage.js  
- [angular-local-storage](https://github.com/grevory/angular-local-storage) to enable caching support (Optional)  
- Regarding the services you are using:  
 * For dropbox: [dropbox/dropbox-js](https://github.com/dropbox/dropbox-js) and services/dropbox.js  
 
 In your AngularJS app, you'll need to import the angular-storage module:  
 ```
 angular.module('myApp', ['angular-storage']);
 ```

## Documentation

### Configuration

##### To use a service and set the configuration
$storage.use(serviceName, config)  
-> Returns a boolean for success

##### To enable/disable caching using local storage
$storage.cache(boolean)  
-> Returns a boolean for success

##### To clear the cache
$storage.clearCache();  
-> Returns a boolean for success

### Controls
Every method below has an optional successCallback and errorCallback after the required parameters.

##### To log in
$storage.authenticate();  
-> Returns a profile object

##### To log out
$storage.signOut();

##### To read a file
$storage.readFile(path);  
-> Returns a file object

##### To write a file
$storage.writeFile(path, data);

##### To read a directory
$storage.readdir(path)  
-> Returns an array of files

##### To remove a file or a directory
$storage.remove(path)

##### To create a directory
$storage.mkdir(path);

##### To Move a file or folder to a different location  
$storage.move(fromPath, toPath);

##### To Copy a file or folder 
$storage.copy(fromPath, toPath);

## Example

Please check the /example folder