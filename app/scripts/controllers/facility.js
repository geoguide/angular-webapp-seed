'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilityCtrl
 * @description
 * # FacilityCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('FacilityCtrl', function ($routeParams, facilityFactory, toasty, $log, $modal, MODIOCORE) {

	var _this = this;
	this.MODIOCORE = MODIOCORE;
	this.facilityId = $routeParams.id;
	this.facilityData = null;
	this.tab = 'facility-info';
	//Date of ASDASD
	this.opened = false;
	this.error = false;
	this.loading = true;
	this.membership = false;
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
			_this.facilityData.selected_settings = [];

			_this.membership = _this.facilityData.settings & _this.MODIOCORE.facilitySettings.values.membership.id;

			for (var i = 0; i < _this.settings.length; i++) {
		var item = _this.settings[i];
				if ((_this.facilityData.settings & item.id) == item.id) {
				_this.facilityData.selected_settings.push(item);
				}
			}

			_this.error = false;
			_this.loading = false;
		},function(error){
			_this.error = true;
			_this.loading = false;
			_this.facilityData = null;
		});
	};

		this.save = function () {
			var facility = {};

			_this.facilityData.settings = facilityFactory.mapSettings(_this.facilityData.selected_settings);
			angular.copy(_this.facilityData,facility);
			delete facility.selected_settings;

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
