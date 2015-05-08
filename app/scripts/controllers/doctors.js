'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:DoctorsCtrl
 * @description
 * # DoctorsCtrl
 * Controller of the angularWebappSeedApp
 */
angular.module('angularWebappSeedApp')
	.controller('DoctorsCtrl', function ($scope,$http,API_URL) {
	
	$scope.awesomeThings = [
		'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
	];
    
	$scope.doctors = [];
	$scope.searchQuery = '';
	$scope.totalDoctors = 0;
	$scope.doctorsPerPage = 25; // this should match however many results your API puts on one page
	$scope.totalPages = $scope.totalDoctors/$scope.doctorsPerPage;
	
    
	function getResultsPage(pageNumber) {
		// TODO: Move this to service and then populate the 
		$http.get(API_URL+'/admin/doctors?search='+$scope.searchQuery).then(function(response) {
			$scope.doctors = response.data.doctors;
			$scope.totalDoctors = response.data.total;
			//console.log('docs: '+JSON.stringify($scope.doctors));
			//console.log('total: '+JSON.stringify($scope.totalDoctors));
			$scope.totalPages = $scope.totalDoctors/$scope.doctorsPerPage;
			//console.log($scope.totalPages);
			
		});
	}
	
	$scope.getTotalPages = function(){
		//console.log('total pages: '+Math.ceil($scope.totalPages));
		return new Array(Math.ceil($scope.totalPages));
	};
	
	$scope.getResults = function(){
		return getResultsPage(1);
	};
	
	getResultsPage(1);
});