'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:ProviderOffersCtrl
 * @description
 * # ProviderOffersCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('ProviderOffersCtrl', function ($routeParams, doctorFactory, $log) {
	
   var _this = this;
   this.doctorId = $routeParams.id;
   this.offers = [];
   
	this.load = function(){
		doctorFactory.getJobOffers(_this.doctorId).then(function(result){
		   _this.offers = result;
		   return doctorFactory.getTracking(_this.doctorId);
		}).then(function(result){
			_this.trackingData = result;
			return doctorFactory.getJobMatches(_this.doctorId);
		}).then(function(result){
			_this.matches = result;
		},function(error){
			$log.error(error);
		});
	};
	
	this.load();
   
});
