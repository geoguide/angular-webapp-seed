'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp')
  .controller('JobsCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
