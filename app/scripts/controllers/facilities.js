'use strict';
/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilitiesCtrl
 * @description
 * # FacilitiesCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('FacilitiesCtrl', function($scope, facilityFactory, applicationFactory, $log, $modalStack,$modal) {
	var _this = this;
	this.facilities = [];
	this.facilitiesWithMembers = [];
	this.formData = {};
	this.newFacility = {};
	this.totalFacilities = 0;
	this.perPage = 25;
	this.totalPages = this.totalFacilities / this.perPage;
	this.maxSize = 8; /* Private Functions */
	this.loading = true;
	this.queryData = facilityFactory.queryData;
	this.settings = facilityFactory.getSettingsList();

	this.open = function (modalId,dataIn) {

		_this.newFacility.settings = facilityFactory.getSettingsList().filter(function(item){
			return item.defaultValue;
		});

		this.modalInstance = $modal.open({
			templateUrl: 'create-facility-modal',
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			scope: $scope,
			resolve: {
				modalObject: function(){
					return dataIn;
				},
				parentCtrl: function(){
					return _this;
				}
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

	this.getResults = function() {
		_this.loading = true;
		_this.queryData.exclude_location = true;
		if (_this.facilitiesFilter) {
			_this.queryData[_this.facilitiesFilter.property] = 1;
		}
		facilityFactory.queryFacilities(_this.queryData).then(function(response) {
			_this.facilities = response.facilities.map(function(facility){
				var settings = facilityFactory.settingsToProperties(_this.settings, facility).map(function(sett){
					return sett.label;
				});
			facility.settings = settings.join(', ');
			return facility;
		});
			_this.queryData = {};
			_this.totalFacilities = response.total;
			_this.totalPages = _this.totalFacilities / _this.perPage;
			_this.loading = false;
		});
	};

	this.submitFacility = function(){
		var facility = facilityFactory.mapSettings(_this.settings, _this.newFacility);
		facilityFactory.createFacility(facility).then(function(response){
			applicationFactory.goTo('/facility/'+response.data.id);
			$modalStack.dismissAll();
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
