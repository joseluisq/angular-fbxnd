# angular-fbxnd
> Facebook JSDK Factory for Angular 1.x

## Usage

```js
angular
  .module('myapp.register', [
    'fbxnd'
  ])

  .controller('RegisterCtrl', function (FBXnd) {
    var app = this

    var fb = FBXnd({
      appId: 777777770000000,
      xfbml: true,
      status: true,
      version: 'v2.3',
      lang: 'es_ES',
      injectJSDK: true // Inject the JSDK script automatically 
    })

    // Load the JSDK and return a Promise object
    fb.load().then(function () {
      console.log('Loaded')
    })
    
    // Your custom callback function
    app.onFacebookConnect = function () {

      // Connect (getStatusInfo, Login and getProfile) then return a Promise object
      fb.connect().then(function (res) {
        console.info(res)
      }, function (res) {
        console.error(res)
      })

    }
  })
```