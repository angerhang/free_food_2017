// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform, GoogleMaps) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    GoogleMaps.init();
  })
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('map', {
    url: '/',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
  });

  $urlRouterProvider.otherwise("/");

})

.factory('Markers', function($http) {

  var markers = [{"id":"1","name":"Marker One","lat":"47.3901766","lng":"8.5128191"},{"id":"2","name":"zurich flughafen","lat":"47.4501395","lng":"8.5613664"}];

  return {
    getMarkers: function(){

      // return $http.get("http://localhost/markers.php").then(function(response){
      //     markers = response;
      //     return markers;
      // });
      return markers;
    }
  }

})

.factory('GoogleMaps', function($cordovaGeolocation, $ionicLoading, $rootScope, $cordovaNetwork, Markers, ConnectivityMonitor){

  var markerCache = [];
  var apiKey = false;
  var map = null;

  function initMap(){

    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){

        var locations = [
          ['Bondi Beach', -33.890542, 151.274856, 4],
          ['Coogee Beach', -33.923036, 151.259052, 5],
          ['Cronulla Beach', -34.028249, 151.157507, 3],
          ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
          ['Maroubra Beach', -33.950198, 151.259302, 1],
          ['Zurich',47.3768866,8.541694,6],
          ['Zurich Technopark',47.389161,8.5150677,7],
          ['Zurich Flughafen',47.4582165,8.5554755,8],
          ['Zurich BachserMärt Forum',47.382426,8.529462,6],
          ['FIFA World Football Museum',47.362692, 8.531596,7],
        ];

        var marker, i;

        var icon = {
          url: "../css/4.png",
          anchor: new google.maps.Point(25,50),
          scaledSize: new google.maps.Size(50, 50)
        }

        for (i = 0; i < locations.length ; i++) {
          if (i > 3) {
            icon.url = "../css/5.png"
          }
          
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            icon: icon
          });
          var infoWindowContent = "<h4>" + locations[i][0] + "</h4>";

          var infowindow = new google.maps.InfoWindow({
            content: infoWindowContent
          });
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(locations[i][0]);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }

        enableMap();

      });

    }, function(error){
      console.log("Could not get location");
    });

  }

  function enableMap(){
    $ionicLoading.hide();
  }

  function disableMap(){
    $ionicLoading.show({
      template: 'You must be connected to the Internet to view this map.'
    });
  }

  function loadGoogleMaps(){

    $ionicLoading.show({
      template: 'Loading Google Maps'
    });

    //This function will be called once the SDK has been loaded
    window.mapInit = function(){
      initMap();
    };

    //Create a script element to insert into the page
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "googleMaps";

    //Note the callback function in the URL is the one we created above
    if(apiKey){
      script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey + '&sensor=true&callback=mapInit';
    }
    else {
      script.src = 'http://maps.google.com/maps/api/js?sensor=true&callback=mapInit';
    }

    document.body.appendChild(script);

  }

  function checkLoaded(){
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      loadGoogleMaps();
    } else {
      enableMap();
    }
  }

  function addConnectivityListeners(){

    if(ionic.Platform.isWebView()){

      // Check if the map is already loaded when the user comes online, if not, load it
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        checkLoaded();
      });

      // Disable the map when the user goes offline
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        disableMap();
      });

    }
    else {

      //Same as above but for when we are not running on a device
      window.addEventListener("online", function(e) {
        checkLoaded();
      }, false);

      window.addEventListener("offline", function(e) {
        disableMap();
      }, false);
    }

  }

  return {
    init: function(key){

      if(typeof key != "undefined"){
        apiKey = key;
      }

      if(typeof google == "undefined" || typeof google.maps == "undefined"){

        console.warn("Google Maps SDK needs to be loaded");

        disableMap();

        if(ConnectivityMonitor.isOnline()){
          loadGoogleMaps();
        }
      }
      else {
        if(ConnectivityMonitor.isOnline()){
          initMap();
          enableMap();
        } else {
          disableMap();
        }
      }

      addConnectivityListeners();

    }
  }

})

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){

  return {
    isOnline: function(){

      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();
      } else {
        return navigator.onLine;
      }

    },
    ifOffline: function(){

      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();
      } else {
        return !navigator.onLine;
      }

    }
  }
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {

});
