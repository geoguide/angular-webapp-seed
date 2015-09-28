'use strict';
/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilitiesCtrl
 * @description
 * # FacilitiesCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('FacilitiesCtrl', function($scope, $modal, $modalStack, facilityFactory, toasty, applicationFactory, $log) {
	var _this = this;
	this.facilities = [];
	this.searchQuery = '';
	this.modalInstance = ''; /* Variables */
	this.formData = {};
	this.totalFacilities = 0;
	this.currentPage = 1;
	this.perPage = 25;
	this.totalPages = this.totalFacilities / this.perPage;
	this.maxSize = 8; /* Private Functions */
	this.loading = true;

	function getResultsPage(pageNumber) {
		_this.loading = true;
		var queryData = {
			q: _this.searchQuery,
			page: pageNumber,
			sort_by: _this.sortBy,
			sort_direction: _this.sortDirection,
			is_medical_school: _this.is_medical_school
		};
		facilityFactory.queryFacilities(queryData).then(function(response) {
			_this.facilities = response.facilities;
			_this.totalFacilities = response.total;
			_this.totalPages = _this.totalFacilities / _this.perPage;
			_this.loading = false;
		});
	} /* Public Functions */
	this.sortResult = function(sortOn) {
		_this.sortDirection = !_this.sortDirection;
		_this.sortBy = sortOn;
		getResultsPage(this.currentPage);
	};
	this.getResults = function() {
		return getResultsPage(this.currentPage);
	};
	this.goTo = applicationFactory.goTo;
	this.submitForm = function() {

	};
	this.open = function() {
		this.modalInstance = $modal.open({
			templateUrl: 'edit-facility-modal',
			controller: 'FacilitiesCtrl',
			controllerAs: 'fac',
			scope: $scope,
			resolve: {
				//Variables to add to modal's scope
			}
		});
		_this.modalInstance.result.then(function(data) {
			//something on close
		}, function() {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	this.closeModal = function() {
		$modalStack.dismissAll();
	};
	getResultsPage(1);
});
