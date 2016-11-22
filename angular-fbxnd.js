(function (angular) {
  angular

    .module('fbxnd', [])

    .factory('FBXnd', function ($q) {
      /**
       * window.FB extended class
       * José Luis Quintana <https://git.io/joseluisq | MIT License
       * Reference: https://developers.facebook.com/docs/javascript/reference/FB.api
       *
       * @param {Object} options - Options
       * @param {Function} fn - Callback
       */
      function FBXnd(options) {
        if (!(this instanceof FBXnd)) {
          return new FBXnd(options)
        }

        this.fb = null
        this.ready = false
        this.options = options
      }

      /**
       * Initialize method
       * @param  {Function} fn - Callback
       */
      FBXnd.prototype.load = function (fn) {
        var me = this
        me.ready = !!(window.FB || false)

        if (me.ready) {
          return me.loadAsync();
        } else {
          me.injectJSDK()
          return me.loadAsync(true);
        }
      }

      /**
       * Checks if window.FB SDK is ready
       * @return {[type]} [description]
       */
      FBXnd.prototype.isReady = function () {
        return this.ready
      }

      /**
       * Ready callback
       * @param  {Function} fn - Callback
       */
      FBXnd.prototype.loadAsync = function (async) {
        var me = this

        return $q(function (resolve, reject) {
          if (async) {
            window.fbAsyncInit = function () {
              me.defaults()
              resolve()
            }
          } else {
            resolve()
          }
        })
      }

      FBXnd.prototype.defaults = function () {
        this.ready = true
        this.fb = window.FB
        this.fb.init(this.options)
      }

      /**
       * Facebook connect
       * @param  {Function} fn - Callback
       */
      FBXnd.prototype.connect = function (fn) {
        if (this.ready) {
          var fb = this.fb

          return $q(function (resolve, reject) {
            fb.getLoginStatus(function (response) {
              if (response.status === 'not_authorized') {
                login(fb, resolve, reject)
              } else {
                if (response.status === 'connected') {
                  getProfile(fb, resolve, reject)
                } else if (response.status === 'not_authorized') {
                  // the user is logged in to Facebook,
                  // but has not authenticated your app
                  reject(response)
                } else {
                  login(fb, resolve, reject)
                }
              }
            })
          })
        } else {
          this.error('Facebook JS SDK is not loaded !')
        }
      }

      /**
       * Faceboook login
       * https://developers.facebook.com/docs/facebook-login/permissions/
       * publish_actions
       * @param  {Function} fn Callback
       */
      function login(fb, resolve, reject) {
        fb.login(function (res) {
          if (res.authResponse) {
            fb.api('/me', function (response) {
              resolve(response)
            })
          } else {
            reject(res)
          }
        }, {
          scope: 'email'
        })
      }

      function getProfile(fb, resolve, reject) {
        fb.api('/me', function (response) {
          if (response.error) {
            reject(response)
          } else {
            resolve(response)
          }
        })
      }

      /**
       * Facebook logout
       * @param  {Function} fn Callback
       */
      FBXnd.prototype.logout = function (fn) {
        var fb = this.fb

        return $q(function (resolve, reject) {
          fb.logout(function (res) {
            resolve(res)
          })
        })
      }

      /**
       * Get facebook profile by Id
       * @param  {Number} id - Facebook Id
       * @param  {Function} fn Callback
       */
      FBXnd.prototype.getProfileBy = function (id) {
        var fb = this.fb

        return $q(function (resolve, reject) {
          fb.api('/' + id, function (res) {
            resolve(res)
          })
        })
      }

      /**
       * Create a facebook post
       * @param  {String} message - String message
       * @param  {Function} fn - Callback
       */
      FBXnd.prototype.post = function (message) {
        var fb = this.fb

        return $q(function (resolve, reject) {
          fb.api('/me/feed', 'post', {
            message: message
          }, function (response) {
            resolve(response)
          })
        })
      }

      /**
       * Share on facebook
       * @param  {Object}   options - Options for share
       * Options:
       *  {
       * 		method: "feed",
       *   	name: "",
       *    link: "",
       *    picture: "",
       *    caption: "",
       *    description: ""
       *  }
       * @param  {Function} fn - Callback
       */
      FBXnd.prototype.share = function (options) {
        var fb = this.fb

        return $q(function (resolve, reject) {
          fb.ui(options, function (response) {
            resolve(response)
          })
        })
      }

      /**
       * Inject facebook JSDK
       */
      FBXnd.prototype.injectJSDK = function () {
        var options = this.options

        if (options.injectJSDK) {
          var fbroot = document.createElement('div')

          fbroot.id = 'fb-root'
          document.body.insertBefore(fbroot, document.body.firstChild);

          (function (d, s, id) {
            var js
            var fjs = d.getElementsByTagName(s)[0]
            var lang = options.lang || 'en_US'

            if (d.getElementById(id)) {
              return
            }

            js = d.createElement(s)
            js.id = id
            js.src = '//connect.facebook.net/' + lang + '/all.js'
            fjs.parentNode.insertBefore(js, fjs)
          }(document, 'script', 'facebook-jssdk'))
        }
      }

      return FBXnd
    })

})(window.angular)
