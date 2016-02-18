'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JoboffersCtrl
 * @description
 * # JoboffersCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('JobOffersCtrl', function (jobFactory, $log, $routeParams) {
  	var _this = this;
  	this.offers = [];
  	this.jobData = {};
  	this.tab = 'offers';
  	this.jobId = $routeParams.id;
  	_this.loading = true;

  	this.findOffers = function(){
  		_this.loading = true;
  		jobFactory.findOffers(_this.jobId).then(function(data){
  			_this.offers = data;
  			_this.error = false;
  			_this.loading = false;
  		},function(error){
  			_this.error = true;
  			_this.jobData = null;
  		});
  	};
  	var init = function(){
  		_this.findOffers(_this.jobId);

  		jobFactory.getJob(_this.jobId).then(function(data){
  			_this.jobData = data;
  			_this.error = false;
  		},function(error){
  			_this.error = true;
  			_this.jobData = null;
  		});
  	};

  	init();

});
