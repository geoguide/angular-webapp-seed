'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
