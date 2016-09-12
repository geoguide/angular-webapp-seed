'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilityCtrl
 * @description
 * # FacilityCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
	.controller('FacilityNotesCtrl', function ($routeParams, facilityFactory, toasty, $log, $modal) {
		var _this = this;
		this.facilityId = $routeParams.id;
		this.facilityData = null;
		this.tab = 'facility-notes';
		//Date of ASDASD
		this.opened = false;
		this.error = false;
		this.loading = true;
		this.open = function ($event) {
			$log.log('open called');
			$event.preventDefault();
			$event.stopPropagation();

		_this.opened = true;
		};

		this.get = function (facilityId) {

			var facilityData = facilityFactory.getFacility(facilityId);

			facilityData.then(function (data) {
				_this.facilityData = data;
				_this.error = false;
				_this.loading = false;
			}, function (error) {
				_this.error = true;
				_this.facilityData = null;
				_this.loading = false;
			});
		};

		this.save = function () {
			facilityFactory.saveFacility(_this.facilityData).then(function (data) {
				toasty.success('Facility Saved.');
				_this.doctorData = data;
			}, function (error) {
				toasty.error(error.data);
			});
		};


		/* Init */

		var init = function () {
			_this.get(_this.facilityId);

		};

		init();
	});
