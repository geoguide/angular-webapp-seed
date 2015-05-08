'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp')
  .controller('DashboardCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
