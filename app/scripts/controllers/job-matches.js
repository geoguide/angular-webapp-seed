'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JobMatchesCtrl
 * @description
 * # JobMatchesCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('JobMatchesCtrl', function (ENV,$routeParams, $window, doctorFactory, toasty, $log, $modal, offerFactory) {

	var _this = this;
	this.doctorId = $routeParams.id;
	this.matches = [];
	this.trackingData = [];
	this.get = function(doctorId){

		doctorFactory.getJobMatches(doctorId).then(function(result){
			_this.matches = result;
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
