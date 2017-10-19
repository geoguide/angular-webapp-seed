'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JobcandidatesctrlCtrl
 * @description
 * # JobcandidatesctrlCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('JobCandidatesCtrl', function (jobFactory, $log, $routeParams, MODIOCORE) {
	var _this = this;
	this.candidates = [];
	this.jobData = {};
	this.tab = 'candidates';
	this.jobId = $routeParams.id;
	_this.loading = true;

	this.findCandidates = function(){
		_this.loading = true;
		jobFactory.findCandidates(_this.jobId).then(function(data){
			_this.candidates = data;
			var jobTypes = MODIOCORE.jobTypes.getValues();
			for (var i = 0; i < _this.candidates.length; i++) {
				var candidate = _this.candidates[i];
				candidate.telemed_exp_name = MODIOCORE.telemedineExperience.get({id: candidate.doctor_telemed_exp}).name;
				if (candidate.job_type) {
					var result = [];
					for (var key in jobTypes) {
						var job_type = jobTypes[key];

						if ((candidate.job_type & job_type.id) == job_type.id) {
							result.push(job_type.short_label);
						}
					}
					candidate.job_type_title = result.join(', ');
				}
			}
			
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
