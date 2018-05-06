'use strict';

angular.module(
  'userApp',
  [
    'ui.router',
    'ngResource',
    'userApp.controllers',
    'userApp.services'
  ]
);

angular.module('userApp').config(function($stateProvider, $httpProvider) {
  $stateProvider.state('users', {
    url: '/users',
    templateUrl: 'templates/users.html',
    controller: 'UserListController'
  });
}).run(function($state) {
  $state.go('users');
});
