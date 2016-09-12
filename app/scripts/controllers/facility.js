'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilityCtrl
 * @description
 * # FacilityCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('FacilityCtrl', function ($routeParams, facilityFactory, toasty, $log, $modal) {

	var _this = this;
	this.facilityId = $routeParams.id;
	this.facilityData = null;
	this.tab = 'facility-info';
	//Date of ASDASD
	this.opened = false;
	this.error = false;
	this.loading = true;
	this.settings = facilityFactory.getSettingsList();
	this.open = function($event) {
		$log.log('open called');
		$event.preventDefault();
		$event.stopPropagation();

		_this.opened = true;
	};

	this.get = function(facilityId){

		var facilityData = facilityFactory.getFacility(facilityId);

		facilityData.then(function(data){
			_this.facilityData = data;
			_this.facilityData.settings = facilityFactory.settingsToProperties(_this.settings, _this.facilityData);
			_this.error = false;
			_this.loading = false;
		},function(error){
			_this.error = true;
			_this.loading = false;
			_this.facilityData = null;
		});
	};

		this.save = function () {
			var facility = facilityFactory.mapSettings(_this.settings, _this.facilityData);
			facilityFactory.saveFacility(facility).then(function (data) {
				toasty.success('Facility Saved.');
				_this.doctorData = data;
			}, function (error) {
				toasty.error(error.data);
			});
		};


	/* Init */

	var init = function(){
		_this.get(_this.facilityId);

	};

	init();
});
