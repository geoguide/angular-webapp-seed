'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
