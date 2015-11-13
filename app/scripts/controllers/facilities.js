'use strict';
/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilitiesCtrl
 * @description
 * # FacilitiesCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('FacilitiesCtrl', function($scope, facilityFactory, applicationFactory, $log) {
	var _this = this;
	this.facilities = [];
	this.facilitiesWithMembers = [];
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

	_this.getResults();
});
