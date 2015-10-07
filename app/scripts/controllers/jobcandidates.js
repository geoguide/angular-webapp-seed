'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JobcandidatesctrlCtrl
 * @description
 * # JobcandidatesctrlCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('JobCandidatesCtrl', function (jobFactory, toasty, $log, $routeParams) {
	var _this = this;
	this.candidates = [];
	this.jobData = {};
	this.jobId = $routeParams.id;
	_this.loading = true;

	this.findCandidates = function(){
		_this.loading = true;
		jobFactory.findCandidates(_this.jobId).then(function(data){
			console.log(JSON.stringify(data, false, 1));
			_this.candidates = data;
			_this.error = false;
			_this.loading = false;
		},function(error){
			_this.error = true;
			_this.jobData = null;
		});
	};
	var init = function(){
		_this.findCandidates(_this.jobId);
		
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
