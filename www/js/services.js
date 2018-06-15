'use strict';

angular.module('userApp.services', [])
  .factory('fileService', function ($http) {
    return {
      get: function () {
        return $http.get('/getFiles').$$state;
      }
    }
  });

  // .factory('User', function($resource) {http://localhost:8000
  //   return $resource('/api/users/:id', {
  //     id: '@_id'
  //   }, {
  //     update: {
  //       method: 'PUT'
  //     }
  //   });

 
