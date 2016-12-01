# angular-fbxnd
> Angular 1.x bindings for [JavaScript Facebook SDK](https://developers.facebook.com/docs/javascript/reference/FB.api)

## Install

```js
bower install angular-fbxnd --save
```

## Usage

```js
angular
  .module('myapp.register', [
    'fbxnd'
  ])

  // Inject the `FBXnd` factory
  .controller('RegisterCtrl', function (FBXnd) {
    var app = this

    // Configuration
    var fb = FBXnd({
      appId: 777777770000000,
      xfbml: true,
      status: true,
      version: 'v2.3',
      lang: 'es_ES', // JSDK lang (en_EN, fr_FR, etc)
      injectJSDK: true // Inject the JSDK script into DOM automatically
    })

    // Inject the JSDK into DOM and return a Promise object then it's loaded
    fb.load()
      .then(function () {
        console.log('Loaded!')
      })

    // This a custom app function
    app.onFacebookConnect = function () {

      // Connect function calls `getStatusInfo()`, `login()` and `getProfile()` for you
      // and return a Promise object
      fb.connect()
        .then(function (res) {
          // OK
          console.info(res)
        }, function (res) {
          // ERROR
          console.error(res)
        })

    }
  })
```

## License
MIT license

© 2016 [José Luis Quintana](http://git.io/joseluisq)
