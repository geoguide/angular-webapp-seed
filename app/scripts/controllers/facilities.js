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
	this.facilitiesWithMembers = [];
	this.modalInstance = ''; /* Variables */
	this.formData = {};
	this.totalFacilities = 0;
	this.perPage = 25;
	this.totalPages = this.totalFacilities / this.perPage;
	this.maxSize = 8; /* Private Functions */
	this.loading = true;
	this.queryData = facilityFactory.queryData;

	this.getResults = function() {
		_this.loading = true;
		facilityFactory.queryFacilities(_this.queryData).then(function(response) {
			_this.facilities = response.facilities;
			_this.totalFacilities = response.total;
			_this.totalPages = _this.totalFacilities / _this.perPage;
			_this.loading = false;
		});
	};
	
	/* Public Functions */
	this.sortResult = function(sortOn) {
		_this.queryData.sortDirection = !_this.queryData.sortDirection;
		_this.queryData.sort_by = sortOn;
		_this.getResults();
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
	_this.getResults();
});
