'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JobMatchesCtrl
 * @description
 * # JobMatchesCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('JobMatchesCtrl', function (ENV,$routeParams, $window, doctorFactory, $log, $modal, offerFactory) {

	var _this = this;
	this.loading = true;
	this.doctorId = $routeParams.id;
	this.matches = [];
	this.trackingData = [];
	
	
	this.get = function(doctorId){
		_this.loading = true;
		doctorFactory.getJobMatches(doctorId).then(function(result){
			_this.matches = result;
			_this.loading = false;
		});
		
	};
	
	doctorFactory.getTracking(_this.doctorId).then(function(result){
		_this.trackingData = result;
	});

	/* Init */

	var init = function(){
		_this.get(_this.doctorId);

	};

	init();

});
