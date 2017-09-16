// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
  , 'starter.controllers'
  , 'starter.services'
  , 'starter.directives'
  , 'monospaced.elastic'
  , 'ksSwiper'
  , 'ionic.contrib.ui.tinderCards2',
  'ionic', 'ngCordova'
])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      GoogleMaps.init();
    })
  })
  .config(function ($provide, $ionicConfigProvider, $compileProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    // $ionicConfigProvider.scrolling.jsScrolling(false);
    // $translateProvider.useStaticFilesLoader({
    //     prefix: 'l10n/',
    //     suffix: '.json'
    //   });
    // $translateProvider.preferredLanguage("en");
    // $translateProvider.fallbackLanguage("en");
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|cdvfile|file|filesystem|blob):|data:image\//);
    $ionicConfigProvider.backButton.text(null).icon('ion-arrow-left-c color-coral');
  })
  .config(function ($stateProvider, $urlRouterProvider) {



    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

     .state('tab.maps', {
        url: '/maps',
        views: {
          'tab-maps': {
            templateUrl: 'templates/tab-maps.html',
            controller: 'MapCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

  })

  .factory('Markers', function($http) {

    var markers = [];

    return {
      getMarkers: function(){

        return $http.get("http://example.com/markers.php").then(function(response){
          markers = response;
          return markers;
        });

      }
    }

  })

  .factory('GoogleMaps', function($cordovaGeolocation, Markers){

    var apiKey = false;
    var map = null;

    function initMap(){

      var options = {timeout: 10000, enableHighAccuracy: true};

      $cordovaGeolocation.getCurrentPosition(options).then(function(position){

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        //Wait until the map is loaded
        google.maps.event.addListenerOnce(map, 'idle', function(){

          //Load the markers
          loadMarkers();

        });

      }, function(error){
        console.log("Could not get location");

        //Load the markers
        loadMarkers();
      });

    }

    function loadMarkers(){

      //Get all of the markers from our Markers factory
      Markers.getMarkers().then(function(markers){

        console.log("Markers: ", markers);

        var records = markers.data.result;

        for (var i = 0; i < records.length; i++) {

          var record = records[i];
          var markerPos = new google.maps.LatLng(record.lat, record.lng);

          // Add the markerto the map
          var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: markerPos
          });

          var infoWindowContent = "<h4>" + record.name + "</h4>";

          addInfoWindow(marker, infoWindowContent, record);

        }

      });

    }

    function addInfoWindow(marker, message, record) {

      var infoWindow = new google.maps.InfoWindow({
        content: message
      });

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
      });

    }

    return {
      init: function(){
        initMap();
      }
    }

  })

  .controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {

  });

