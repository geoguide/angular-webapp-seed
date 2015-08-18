'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:CoordinatorsCtrl
 * @description
 * # CoordinatorsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('CoordinatorsCtrl', function ($scope,$modal,$modalStack,doctorFactory,toasty,applicationFactory,$log) {
	var _this = this;
	
	this.coordinators = [];
	this.searchQuery = '';
	this.modalInstance = '';
	
	/* Variables */
	this.formData = {};
	this.totalCoordinators = 0;
	this.currentPage = 1;
	this.coordinatorsPerPage = 25;
	this.totalPages = this.totalCoordinators/this.coordinatorsPerPage;
	this.maxSize = 8;
	
	
	/* Private Functions */
	function getResultsPage(pageNumber) {
		var queryData = {
			search_query: _this.searchQuery,
			page_number: pageNumber,
			sort_by: _this.sortBy,
			sort_direction: _this.sortDirection
		};
		doctorFactory.queryCoordinators(queryData).then(function(response) {
			_this.coordinators = response.coordinators;
			_this.totalCoordinators = response.total;
			_this.totalPages = _this.totalCoordinators/_this.coordinatorsPerPage;
		});
	}
	
	
	/* Public Functions */
	this.sortResult = function(sortOn){
		_this.sortDirection = !_this.sortDirection;
		_this.sortBy = sortOn;
		getResultsPage(this.currentPage);
	};
	this.getResults = function(){
		return getResultsPage(this.currentPage);
	};
	
	this.goTo = applicationFactory.goTo;
	
	this.submitForm = function(){
		doctorFactory.createCoordinator(_this.formData).then(function(data){
			applicationFactory.goTo('/coordinator/'+data.id);
			$modalStack.dismissAll();
		},function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};

	this.open = function () {

		this.modalInstance = $modal.open({
			templateUrl: 'create-coordinator-modal',
			controller: 'CoordinatorsCtrl',
			controllerAs: 'coordCtrl',
			scope: $scope,
			resolve: {
				//Variables to add to modal's scope
			}
		});

		_this.modalInstance.result.then(function (data) {
			//something on close
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	this.closeModal = function(){
		$modalStack.dismissAll();
	};
	getResultsPage(1);
});