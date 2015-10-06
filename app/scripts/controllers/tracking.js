'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:TrackingCtrl
 * @description
 * # TrackingCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('TrackingCtrl', function ($routeParams, doctorFactory, toasty, $log, $modal) {

	var _this = this;
	this.doctorId = $routeParams.id;
	this.trackingData = [];
	this.get = function(doctorId){

		doctorFactory.getTracking(doctorId).then(function(result){
			_this.trackingData = result;
		});
		
	};

	/* Init */

	var init = function(){
		_this.get(_this.doctorId);
		doctorFactory.getJobMatches(_this.doctorId).then(function(result){
			_this.matches = result;
		});
	};

	init();

});
